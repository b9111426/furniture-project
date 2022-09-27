import { createSwiper } from './createSwiper.js'
import {getProductList} from './cart/getProductList.js'
import { getCartList} from './cart/getCartList.js'




const orderInfoBtn = document.querySelector('.orderInfo-btn')
const form = document.querySelector('.orderInfo-form')
const inputs = document.querySelectorAll('input[type=text],input[type=email],input[type=tel]')
const customerName = document.querySelector('#customerName')
const customerPhone = document.querySelector('#customerPhone')
const customerEmail = document.querySelector('#customerEmail')
const customerAddress = document.querySelector('#customerAddress')
const tradeWay = document.querySelector('#tradeWay')



document.addEventListener("DOMContentLoaded", function(){
  createSwiper()
  getProductList()
  getCartList()
});