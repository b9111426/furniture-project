
import { toThousands } from '../libs/util.js'
import config from '../config.js'

const productList = document.querySelector('.product-wrap')
const productSelect = document.querySelector('.product-select')
const instance = axios.create({ baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1/customer/' })
const { api_path } = config

let productData = []

export const getProductList = () => {
  instance.get(`/${api_path}/products`)
    .then(res => {
      productData = res.data.products
      renderProduct()
    })
    .catch(err => {
      console.log(err)
    })
}

const combineProductHTMLItem = (item) => {
  return /* html */`
  <li class="product-card">
  <h4 class="product-type">${item.category}</h4>
  <img class="product-image"  src=${item.images} alt="">
  <a class="product-btn"  href="javascript:;" class="addCardBtn" data-id="${item.id}">加入購物車</a>
  <h3 class="product-title">${item.title}</h3>
  <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
  <p class="nowPrice">NT$${toThousands(item.price)}</p>
  </li>
`
}
const renderProduct = () => {
  let str = ''
  productData.forEach((item) => {
    str += combineProductHTMLItem(item)
  })
  productList.innerHTML = str
}

// 產品下拉選單
productSelect.addEventListener('change', function (e) {
  const category = e.target.value
  if (category === '全部') {
    getProductList()
    return
  }
  let str = ''
  productData.forEach(function (item) {
    if (item.category === category) {
      str += combineProductHTMLItem(item)
    }
    productList.innerHTML = str
  })
})
