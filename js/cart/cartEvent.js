import config from '../asset/config.js'
import { sweetAlertSet, fadeAlertSet } from '../libs/sweetAlertSet.js'
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
      e.preventDefault()
      const loading = e.target.querySelector('.loading')
      const title = e.target.parentNode.querySelector('.product-title').innerHTML
      const productId = e.target.getAttribute('data-id')
      const selectNum = e.target.parentNode.querySelector('.product-quantity')
      const quantity = parseInt(selectNum.value)

      loading.classList.remove('d-none')
      eventObj.resetTotal()
      const addCartClass = e.target.getAttribute('class')
      console.log(addCartClass);
      if (addCartClass !== 'product-btn') {
        return
      }
      eventObj.cartData.forEach(item => {
        if (item.product.id === productId) {
          eventObj.numCheck = item.quantity + quantity
        }
      })

      instance.post(`/${api_path}/carts`, {
        data: {
          productId: productId,
          quantity: eventObj.numCheck
        }
      }).then(res => {
        loading.classList.add('d-none')
        const info = `${title}`
        const text = '已經加入到購物車'
        Swal.fire(fadeAlertSet(true, info, text))
        getCartList().then(res => {
          eventObj.getData(res.data.carts)
          renderCartList(res.data)
          selectNum.value= 1
          eventObj.numCheck = 1
        })
      })
    })
  },

  // 刪除購物車
  deleteCartEvent () {
    const eventObj = this
    cartTableList.addEventListener('click', function (e) {
      const title = e.target.parentNode.parentNode.querySelector('.cardItem-title>p').innerHTML
      eventObj.resetTotal()
      e.preventDefault()
      const cartId = e.target.getAttribute('data-id')
      if (cartId === null) {
        return
      }
      instance.delete(`/${api_path}/carts/${cartId}`)
        .then(res => {
          const info = `${title}`
          const text = '已從購物車刪除'
          Swal.fire(fadeAlertSet(false, info, text))
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
      if(!errors){
        instance.post(`/${api_path}/orders`, {
          data: {
            user: {
              name: customerName.value.trim(),
              tel: customerPhone.value.substr(1),
              email: customerEmail.value.trim(),
              address: customerAddress.value.trim(),
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
      }
    })
  },

  init () {
    this.addCartEvent()
    this.deleteCartEvent()
    this.submitOder()
  }
}
