import config from '../config.js'
import { sweetAlertSet } from '../libs/sweetAlertSet.js'
import { getCartList, renderCartList } from './getCartList.js'

const { api_path, instance } = config

const productList = document.querySelector('.product-wrap')
const cartTableList = document.querySelector('.shopping-tableList')
const discardAllBtn = document.querySelector('.discardAllBtn')
const orderInfoBtn = document.querySelector('.orderInfo-btn')
const form = document.querySelector('.orderInfo-form')
const inputs = document.querySelectorAll('input[type=text],input[type=email],input[type=tel]')
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
          eventObj.getData(res.data.carts)
          getCartList().then(res => renderCartList(res.data))
        })
    })

    // 刪除全部購物車
    discardAllBtn.addEventListener('click', function (e) {
      if (eventObj.cartData.length) { eventObj.resetTotal() }
      e.preventDefault()
      instance.delete(`/${api_path}/carts`)
        .then(res => {
          eventObj.getData(res.data.carts)
          getCartList().then(res => renderCartList(res.data))
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
      // 驗證條件
      const constraints = {
        姓名: {
          presence: {
            message: '是必填欄位'
          }
        },
        電話: {
          presence: {
            message: '是必填欄位'
          },
          length: {
            minimum: 10,
            maximum: 11,
            message: '長度不正確'
          },
          format: {
            pattern: '[0-9-]+',
            message: '只能輸入數字'
          }
        },
        Email: {
          presence: {
            message: '是必填欄位'
          },
          email: {
            message: '不是有效信箱'
          }
        },
        寄送地址: {
          presence: {
            message: '是必填欄位'
          }
        },
        交易方式: {
          presence: {
            message: '是必填欄位'
          }
        }
      }

      const errors = validate(form, constraints)

      // 表單errors效果
      orderInputStatus(errors)

      if (errors) {
        Object.keys(errors).forEach(function (item) {
          // 判斷是否有兩個錯誤以上
          if (errors[item].length > 1) {
            document.querySelector(`.${item}`).innerHTML = `<p class="errMessages ${item}">${errors[item].join('<br>')}</p>`
          } else {
            document.querySelector(`.${item}`).innerHTML = `<p class="errMessages ${item}">${errors[item]}</p>`
          }
        })
        return
      }

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
          alert('訂單建立成功')
          document.querySelector('.orderInfo-form').reset()
          getCartList()
        })
    })

    // 表單errors效果
    function orderInputStatus (errors) {
      inputs.forEach(function (item) {
        item.addEventListener('input', function () {
          item.nextElementSibling.textContent = ''
          item.classList.remove('formWarning')
        })
      })
      tradeWay.addEventListener('change', function () {
        tradeWay.nextElementSibling.textContent = ''
        tradeWay.classList.remove('formWarning')
      })
      // 欄位紅框效果
      if (errors) {
        errors['交易方式'] && tradeWay.classList.add('formWarning')
        errors['姓名'] && customerName.classList.add('formWarning')
        errors['電話'] && customerPhone.classList.add('formWarning')
        errors.Email && customerEmail.classList.add('formWarning')
        errors['寄送地址'] && customerAddress.classList.add('formWarning')
      }
    }
  },

  init () {
    this.addCartEvent()
    this.deleteCartEvent()
    this.submitOder()
  }
}
