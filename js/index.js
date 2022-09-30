import { createSwiper } from './libs/createSwiper.js'
import { getProductList } from './cart/getProductList.js'
import { getCartList, renderCartList } from './cart/getCartList.js'
import cartEvent from './cart/cartEvent.js'
import { menuToggle } from './asset/menuToggle.js'

document.addEventListener('DOMContentLoaded', () => {
  menuToggle()
  createSwiper()
  cartEvent.init()
})
function init () {
  getProductList()
  getCartList().then(res => {
    renderCartList(res.data)
    cartEvent.getData(res.data.carts)
  })
}
init()
