
import { toThousands } from '../libs/util.js'
import config from '../asset/config.js'

const productList = document.querySelector('.product-wrap')
const productSelect = document.querySelector('.product-select')
const productSort = document.querySelector('.product-sort')
const { api_path, instance } = config
const data = {
  productData:[],
  newAry:[]
}


export const getProductList = () => {
  instance.get(`/${api_path}/products`)
    .then(res => {
      data.productData = res.data.products
      renderProduct(data.productData)
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
    <a class="product-btn"  href="javascript:;" class="addCardBtn" data-id="${item.id}">
    <img class="loading d-none" src="./asset/load.gif" alt="">
    加入購物車</a>
    <div>
      <select name="quantity" class="product-quantity">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
      <span>數量</span>
    </div>


    <h3 class="product-title">${item.title}</h3>
    <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
    <p class="nowPrice">NT$${toThousands(item.price)}</p>
  </li>
`
}
const renderProduct = (ary) => {
  let str = ''
  ary.forEach((item) => {
    str += combineProductHTMLItem(item)
  })
  productList.innerHTML = str
}

// 產品下拉選單
productSelect.addEventListener('change', function (e) {
  const category = e.target.value
  if (category === '全部') {
    data.newAry = data.productData
    renderProduct(data.newAry)
    return
  }
  let str = ''
  data.newAry = data.productData.filter((i)=>{
    return i.category === category
  })
  renderProduct(data.newAry)
})

//產品排序
productSort.addEventListener('click',function(e){
  e.target.innerHTML==='價錢由低至高'? e.target.innerHTML='價錢由高至低': e.target.innerHTML='價錢由低至高'
  if(productSort.innerHTML==='價錢由低至高'){
    data.newAry.sort((a,b)=>{
      return a.price-b.price
    })
    renderProduct(data.newAry)
  }else{
    data.newAry.sort((a,b)=>{
      return b.price-a.price
    })
    renderProduct(data.newAry)
  }
})