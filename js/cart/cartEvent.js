import config from '../config.js'
import { sweetAlertSet } from '../libs/sweetAlertSet.js'
import { getCartList, renderCartList } from './getCartList.js'

const { api_path, instance } = config

const productList = document.querySelector('.product-wrap')
const cartList = document.querySelector('.shoppingCart-tableList')
const discardAllBtn = document.querySelector('.discardAllBtn')

export default {
  numCheck: 1,
  // 添加產品
  addCartEvent (cartData) {
    const eventObj = this
    productList.addEventListener('click', function (e) {
      e.preventDefault()
      const addCartClass = e.target.getAttribute('class')
      if (addCartClass !== 'product-btn') {
        return
      }
      const productId = e.target.getAttribute('data-id')

      cartData.forEach(item => {
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
        cartList.then(res => renderCartList(res.data))
      })
    })
  },
  deleteCartEvent () {
    // 刪除購物車
    cartList.addEventListener('click', function (e) {
      e.preventDefault()
      const cartId = e.target.getAttribute('data-id')
      if (cartId === null) {
        return
      }
      instance.delete(`/${api_path}/carts/${cartId}`)
        .then(res => {
          const cartList = getCartList()
          cartList.then(res => renderCartList(res.data))
        })
    })

    // 刪除全部購物車
    discardAllBtn.addEventListener('click', function (e) {
      e.preventDefault()
      instance.delete(`/${api_path}/carts`)
        .then(res => {
          const cartList = getCartList()
          cartList.then(res => renderCartList(res.data))
        })
        .catch(res => {
          const info = '購物車已刪除'
          Swal.fire(sweetAlertSet('info', info))
        })
    })
  },
  init (cartData) {
    this.addCartEvent(cartData)
    this.deleteCartEvent()
  }
}
