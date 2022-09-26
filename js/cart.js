
import { toThousands } from './libs/util.js'

export const renderProduct = (data, productList) => {
  let str = ''
  data.forEach((item) => {
    str += /* html */`
        <li class="product-card">
        <h4 class="product-type">${item.category}</h4>
        <img class="product-image"  src=${item.images} alt="">
        <a class="product-btn"  href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
        <h3 class="product-title">${item.title}</h3>
        <del class="originPrice">NT$${toThousands(item.origin_price)}</del>
        <p class="nowPrice">NT$${toThousands(item.price)}</p>
        </li>
      `
  })
  productList.innerHTML = str
}
