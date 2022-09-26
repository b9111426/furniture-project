import config from './config.js'
import { createSwiper } from './createSwiper.js'
import {renderProduct,combineProductHTMLItem}from './cart/renderProduct.js'
import { getCartList } from './cart/getCartList.js'

const productList = document.querySelector('.product-wrap')
const productSelect = document.querySelector('.product-select')
const cartList = document.querySelector('.shoppingCart-tableList')
const discardAllBtn = document.querySelector('.discardAllBtn')
const orderInfoBtn = document.querySelector('.orderInfo-btn')
const form = document.querySelector('.orderInfo-form')
const inputs = document.querySelectorAll('input[type=text],input[type=email],input[type=tel]')
const customerName = document.querySelector('#customerName')
const customerPhone = document.querySelector('#customerPhone')
const customerEmail = document.querySelector('#customerEmail')
const customerAddress = document.querySelector('#customerAddress')
const tradeWay = document.querySelector('#tradeWay')

const instance = axios.create({ baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1/customer/'})

const data = {
  productData: [],
  cartData: [],
  numCheck : 1,
}

const { api_path } = config

function getProductList () {
  instance.get(`/${api_path}/products`)
    .then(res => {
      data.productData = res.data.products
      renderProduct(res.data.products, productList)
    })
    .catch(err => {
      console.log(err)
    })
}

document.addEventListener("DOMContentLoaded", function(){
  createSwiper()
  getProductList()
  getCartList(instance,api_path,cartList)

  //產品下拉選單
  productSelect.addEventListener('change', function (e) {
    const category = e.target.value
    if (category === "全部") {
        getProductList();
        return;
    }
    let str = "";
    data.productData.forEach(function (item) {
        if (item.category === category) {
            str += combineProductHTMLItem(item);
        }
        productList.innerHTML = str;
    })
  })

  //點擊產品
//productList.addEventListener("click", function (e) {
//  e.preventDefault();
//  let addCartClass = e.target.getAttribute("class");
//  if (addCartClass !== "product-btn") {
//      return;
//  }
//  let productId = e.target.getAttribute("data-id");
//  data.cartData.forEach(function (item) {
//      if (item.product.id === productId) {
//          data.numCheck = item.quantity += 1;
//      };
//  });


//  instance.post(`/${api_path}/carts`,{
//    "data": {
//      "productId": productId,
//      "quantity": data.numCheck
//    }
//  }).then((res)=>{
//    getCartList();
//  })
//});

});