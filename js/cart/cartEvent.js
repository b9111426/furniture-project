import { getCartList } from './getCartList.js'
import config from '../config.js'
const { api_path ,instance} = config

export default{


  deleteCart(){
    const cartList = document.querySelector('.shoppingCart-tableList')
    const discardAllBtn = document.querySelector('.discardAllBtn')
    // 刪除購物車
    cartList.addEventListener('click', function (e) {
      e.preventDefault()
      const cartId = e.target.getAttribute('data-id')
      if (cartId === null) {
        return
      }
      instance.delete(`/${api_path}/carts/${cartId}`)
        .then(res => {
          getCartList()
        })
    })


    // 刪除全部購物車
    discardAllBtn.addEventListener('click', function (e) {
      e.preventDefault()
      instance.delete(`/${api_path}/carts`)
        .then(res => getCartList())
        .catch(res => {
          const info = '購物車已刪除'
          Swal.fire(sweetAlertSet('info', info))
        })
    })
  },
  init(){
    this.deleteCart()
  }
}