import { createSwiper } from './libs/createSwiper.js'
import { getProductList } from './cart/getProductList.js'
import { getCartList, renderCartList } from './cart/getCartList.js'
import cartEvent from './cart/cartEvent.js'
import { menuToggle } from './menuToggle.js'

document.addEventListener('DOMContentLoaded', () => {
  menuToggle()
  createSwiper()
})
function init () {
  getProductList()
  getCartList().then(res => {
    renderCartList(res.data)
    cartEvent.getData(res.data.carts)
    cartEvent.init()
  })
}
init()
