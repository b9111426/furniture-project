import config from './asset/config.js'
import { totalProductsNum } from './admin/totalProductNum.js'
import { renderC3 } from './libs/renderC3.js'
import adminEvent from './admin/adminEvent.js'

const { api_path, token, adminInstance } = config
const orderList = document.querySelector('.js-orderList')
const productsNum = document.querySelector('.productsNum')
const totalOrders = document.querySelector('.totalOrders')
const totalCounted = document.querySelector('.totalCounted')

function init () {
  getOrdList()
}
init()

export function getOrdList () {
  adminInstance.get(`/${api_path}/orders`, {
    headers: {
      Authorization: token
    }
  })
    .then(res => {
      const orderData = res.data.orders
      let str = ''
      let totalCountedNum = 0
      const productObject = []

      orderData.forEach(item => {
        // 組product資料
        item.products.forEach(i => productObject.push(i))

        // 加總資訊
        totalCountedNum += item.total

        // 組時間字串
        const timeStamp = new Date(item.createdAt * 1000)
        const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth() + 1}/${timeStamp.getDate()}`
        // 組訂單字串
        let productStr = ''
        item.products.forEach(productItem => {
          if (productItem) { productStr += `<p>${productItem.title}x${productItem.quantity}</p>` }
        })


        // 組產品字串
        str += /* html */`
          <tr>
            <td class="orderNum">${item.id}</td>
            <td>
              <p>${item.user.name}</p>
              <p>0${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
                ${productStr}
            </td>
            <td>${orderTime}</td>
            <td >
              <div class="orderPage-toggleBtn">
                <img class="loading d-none" src="./asset/load.gif" alt="">
                <input type="checkbox" class="orderPage-checkbox" ${item.paid ? 'checked' : ''}>
                <span class="toggle-switch" data-status="${item.paid}" data-id="${item.id}">
                    <span class="undo">未處理</span>
                    <span class="done">已處理</span>
                </span>
              </div>
            </td>
            <td>
              <div class="orderPage-deleteBtn">
                <img class="loading d-none" src="./asset/load.gif" alt="">
                <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
              </div>
            </td>
          </tr>`
      })

      if (orderData.length) {
        orderList.innerHTML = str
      } else {
        orderList.innerHTML = '<tr class="emptyOrder"><td></td><td  colspan="6">無訂單資料</td><td></td></tr>'
      }

      //列表資訊
      const {totalNum} = totalProductsNum(productObject)
      productsNum.textContent = totalNum
      totalOrders.textContent = orderData.length
      totalCounted.textContent = totalCountedNum.toString()

      renderC3(productObject)
      
    })
}

document.addEventListener('DOMContentLoaded',()=>{
  adminEvent.init(orderList)
})

