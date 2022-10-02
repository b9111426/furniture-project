import config from './asset/config.js'
import { sweetAlertSet } from './libs/sweetAlertSet.js'
const { api_path, token, adminInstance } = config
let orderData = []
const orderList = document.querySelector('.js-orderList')
const totalStatus = document.querySelector('.totalStatus')
const totalOrders = document.querySelector('.totalOrders')
const totalCounted = document.querySelector('.totalCounted')
const discardAllBtn = document.querySelector('.discardAllBtn')

function init () {
  getOrdList()
};
init()
function getOrdList () {
  adminInstance.get(`/${api_path}/orders`, {
    headers: {
      Authorization: token
    }
  })
    .then(res => {
      orderData = res.data.orders
      let str = ''
      let totalStatusNum = 0
      let totalCountedNum = 0
      const productObject = {}
      orderData.forEach(item => {
        // 加總資訊
        if (!item.paid) { totalStatusNum++ }
        totalCountedNum += item.total

        // 組時間字串
        const timeStamp = new Date(item.createdAt * 1000)
        const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth() + 1}/${timeStamp.getDate()}`
        // 組訂單字串
        let productStr = ''
        item.products.forEach(productItem => {
          if (productItem) { productStr += `<p>${productItem.title}x${productItem.quantity}</p>` }
        })

        // 組chart資料
        item.products.forEach(item => {
          const itemName = item.title
          if (!productObject[itemName]) {
            productObject[itemName] = 1
          } else {
            productObject[itemName] += 1
          }
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
      totalOrders.textContent = orderData.length
      totalStatus.textContent = totalStatusNum
      totalCounted.textContent = totalCountedNum.toString()
      if (orderData.length) {
        orderList.innerHTML = str
      } else {
        orderList.innerHTML = '<tr class="emptyOrder"><td></td><td  colspan="6">無訂單資料</td><td></td></tr>'
      }
      renderC3(productObject,totalCountedNum)
    })
}

function renderC3 (productObject,totalCountedNum) {
  const chartData = []
  Object.keys(productObject).forEach(item => {
    const ary = []
    ary.push(item)
    ary.push(productObject[item])
    chartData.push(ary)
  })

  const timeAry = ['x']
  const monthEarn = {0:'月營收'}
  const thisYear = new Date().getFullYear()
  const thisMonth = new Date().getMonth()
  for (let idx = 1; idx < 13; idx++) {
    let str = `${thisYear}-${idx}-1`
    timeAry.push(str)
    monthEarn[idx] = 0
  }
  monthEarn[thisMonth] = monthEarn[thisMonth]+ totalCountedNum


  c3.generate({
    bindto: '#productChart',
    size: {
      height: 400
    },
    tooltip: {
      show: false
    },
    data: {
      type: 'pie',
      columns: chartData,
    }
  })

  c3.generate({
    bindto: '#monthChart',
    data: {
        x: 'x',
        columns: [
          timeAry,
          Object.values(monthEarn),
        ],
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y/%m'
            }
        }
    }
});
}

orderList.addEventListener('click', (e) => {
  e.preventDefault()
  const targetClass = e.target.getAttribute('class')
  const id = e.target.getAttribute('data-id')
  if (targetClass === 'delSingleOrder-Btn js-orderDelete') {
    const loading = e.target.parentNode.querySelector('.loading')
    deleteOrderItem(id, loading)
    return
  }
  if (targetClass === 'toggle-switch') {
    const status = e.target.getAttribute('data-status')
    const checkBox = e.target.parentNode.querySelector('.orderPage-checkbox')
    const loading = e.target.parentNode.querySelector('.loading')
    changeOrderStatus(status, id, checkBox, loading)
  }
})

function changeOrderStatus (status, id, checkBox, loading) {
  loading.classList.remove('d-none')
  let newStatus
  adminInstance.put(`/${api_path}/orders`, {
    data: {
      id: id,
      paid: status === 'true' ? newStatus = false : newStatus = true
    }
  }, {
    headers: {
      Authorization: token
    }
  })
    .then(res => {
      loading.classList.add('d-none')
      checkBox.checked = !checkBox.checked
      getOrdList()
    })
}

function deleteOrderItem (id, loading) {
  loading.classList.remove('d-none')
  adminInstance.delete(`/${api_path}/orders/${id}`, {
    headers: {
      Authorization: token
    }
  })
    .then(res => {
      loading.classList.add('d-none')
      getOrdList()
    })
}

discardAllBtn.addEventListener('click', (e) => {
  adminInstance.delete(`/${api_path}/orders`, {
    headers: {
      Authorization: token
    }
  }).then(res => {
    getOrdList()
  }).catch(err => {
    const info = JSON.parse(err.request.response).message.split(' ')[0]
    Swal.fire(sweetAlertSet('info', info))
  })
})
