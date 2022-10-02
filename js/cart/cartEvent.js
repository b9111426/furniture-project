import config from '../asset/config.js'
import { sweetAlertSet } from '../libs/sweetAlertSet.js'
import { getCartList, renderCartList } from './getCartList.js'
import { constraints } from './validate.js'
import { orderInputStatus } from './orderInputStatus.js'

const { api_path, instance } = config

const productList = document.querySelector('.product-wrap')
const cartTableList = document.querySelector('.shopping-tableList')
const discardAllBtn = document.querySelector('.discardAllBtn')
const orderInfoBtn = document.querySelector('.orderInfo-btn')
const form = document.querySelector('.orderInfo-form')

const customerName = document.querySelector('#customerName')
const customerPhone = document.querySelector('#customerPhone')
const customerEmail = document.querySelector('#customerEmail')
const customerAddress = document.querySelector('#customerAddress')
const tradeWay = document.querySelector('#tradeWay')

export default {
  numCheck: 1,
  cartData: [],
  getData (data) {
    this.cartData = data
  },
  resetTotal () {
    document.querySelector('.js-total').innerHTML = '<img class="loading" src="./asset/load.gif" alt="">計算中'
  },

  // 添加產品
  addCartEvent () {
    const eventObj = this
    productList.addEventListener('click', function (e) {
      eventObj.resetTotal()
      e.preventDefault()
      const addCartClass = e.target.getAttribute('class')
      if (addCartClass !== 'product-btn') {
        return
      }
      const productId = e.target.getAttribute('data-id')
      console.log(eventObj.cartData)
      eventObj.cartData.forEach(item => {
        if (item.product.id === productId) {
          eventObj.numCheck = item.quantity + 1
        }
      })

      instance.post(`/${api_path}/carts`, {
        data: {
          productId: productId,
          quantity: eventObj.numCheck
        }
      }).then(res => {
        getCartList().then(res => {
          eventObj.getData(res.data.carts)
          renderCartList(res.data)
          eventObj.numCheck = 1
        })
      })
    })
  },

  // 刪除購物車
  deleteCartEvent () {
    const eventObj = this

    cartTableList.addEventListener('click', function (e) {
      eventObj.resetTotal()
      e.preventDefault()
      const cartId = e.target.getAttribute('data-id')
      if (cartId === null) {
        return
      }
      instance.delete(`/${api_path}/carts/${cartId}`)
        .then(res => {
          getCartList().then(res => {
            eventObj.getData(res.data.carts)
            renderCartList(res.data)
          })
        })
    })

    // 刪除全部購物車
    discardAllBtn.addEventListener('click', function (e) {
      if (eventObj.cartData.length) { eventObj.resetTotal() }
      e.preventDefault()
      instance.delete(`/${api_path}/carts`)
        .then(res => {
          getCartList().then(res => {
            eventObj.getData(res.data.carts)
            renderCartList(res.data)
          })
        })
        .catch(err => {
          const { message } = JSON.parse(err.request.responseText)
          const info = message.split(' ')[0]
          Swal.fire(sweetAlertSet('info', info))
        })
    })
  },
  // 送出訂單
  submitOder () {
    const eventObj = this
    orderInfoBtn.addEventListener('click', function (e) {
      e.preventDefault()

      // 判斷購物車是否為空
      if (eventObj.cartData.length === 0) {
        const info = '購物車為空的'
        Swal.fire(sweetAlertSet('info', info))
        return
      }

      // validate表單驗證
      const errors = validate(form, constraints)

      // 表單errors效果
      orderInputStatus(errors, customerName, customerPhone, customerEmail, customerAddress, tradeWay)

      // post資料
      instance.post(`/${api_path}/orders`, {
        data: {
          user: {
            name: customerName.value,
            tel: customerPhone.value,
            email: customerEmail.value,
            address: customerAddress.value,
            payment: tradeWay.value
          }
        }
      })
        .then(res => {
          const info = '訂單建立成功'
          Swal.fire(sweetAlertSet('success', info))
          document.querySelector('.orderInfo-form').reset()
          getCartList().then(res => {
            eventObj.getData(res.data.carts)
            renderCartList(res.data)
          })
        })
    })
  },

  init () {
    this.addCartEvent()
    this.deleteCartEvent()
    this.submitOder()
  }
}
