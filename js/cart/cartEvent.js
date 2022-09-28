import config from '../config.js'
import { sweetAlertSet } from '../libs/sweetAlertSet.js'
import { getCartList, renderCartList } from './getCartList.js'

const { api_path, instance } = config

const productList = document.querySelector('.product-wrap')
const cartList = document.querySelector('.shoppingCart-tableList')
const discardAllBtn = document.querySelector('.discardAllBtn')

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
        const cartList = getCartList()
        cartList.then(res => {
          eventObj.getData(res.data.carts)
          renderCartList(res.data)
          eventObj.numCheck = 1
        })
      })
    })
  },
  deleteCartEvent () {
    const eventObj = this
    // 刪除購物車
    cartList.addEventListener('click', function (e) {
      eventObj.resetTotal()
      e.preventDefault()
      const cartId = e.target.getAttribute('data-id')
      if (cartId === null) {
        return
      }
      instance.delete(`/${api_path}/carts/${cartId}`)
        .then(res => {
          eventObj.getData(res.data.carts)
          const cartList = getCartList()
          cartList.then(res => renderCartList(res.data))
        })
    })

    // 刪除全部購物車
    discardAllBtn.addEventListener('click', function (e) {
      if (eventObj.cartData.length) { eventObj.resetTotal() }
      e.preventDefault()
      instance.delete(`/${api_path}/carts`)
        .then(res => {
          eventObj.getData(res.data.carts)
          const cartList = getCartList()
          cartList.then(res => renderCartList(res.data))
        })
        .catch(err => {
          const { message } = JSON.parse(err.request.responseText)
          const info = message.split(' ')[0]
          Swal.fire(sweetAlertSet('info', info))
        })
    })
  },
  init () {
    this.addCartEvent()
    this.deleteCartEvent()
  }
}
