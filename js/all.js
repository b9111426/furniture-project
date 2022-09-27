import { createSwiper } from './createSwiper.js'
import { getProductList } from './cart/getProductList.js'
import { getCartList } from './cart/getCartList.js'



document.addEventListener('DOMContentLoaded', function () {
  createSwiper()
  getProductList()
  getCartList()
})
