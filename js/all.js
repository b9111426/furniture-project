import config from './config.js'
import { createSwiper } from './createSwiper.js'
import { renderProduct } from './cart.js'

const productList = document.querySelector('.product-wrap')
const productSelect = document.querySelector('.product-select')
const cartList = document.querySelector('.shoppingCart-tableList')
const discardAllbBtn = document.querySelector('.discardAllBtn')
const orderInfoBtn = document.querySelector('.orderInfo-btn')
const form = document.querySelector('.orderInfo-form')
const inputs = document.querySelectorAll('input[type=text],input[type=email],input[type=tel]')
const customerName = document.querySelector('#customerName')
const customerPhone = document.querySelector('#customerPhone')
const customerEmail = document.querySelector('#customerEmail')
const customerAddress = document.querySelector('#customerAddress')
const tradeWay = document.querySelector('#tradeWay')

const instance = axios.create({ baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1/customer/' })

const data = {
  productData: [],
  cartData: []
}

const { api_path } = config

function getProductList () {
  instance.get(`/${api_path}/products`)
    .then(res => {
      data.productData = res.data.products
      renderProduct(data.productData, productList)
    })
    .catch(err => {
      console.log(err)
    })
}

function init () {
  createSwiper()
  getProductList()
  // getCartList()
}
init()
