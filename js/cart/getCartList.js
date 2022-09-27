import { toThousands } from '../libs/util.js'
import config from '../config.js'
import { sweetAlertSet } from '../libs/sweetAlertSet.js'

const cartList = document.querySelector('.shoppingCart-tableList')
const productList = document.querySelector('.product-wrap')
const discardAllBtn = document.querySelector('.discardAllBtn')
const instance = axios.create({ baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1/customer/'})
const { api_path } = config

const data = {
  cartData: [],
  numCheck : 1,
}

export const getCartList = () => {
    instance.get(`/${api_path}/carts`)
      .then( res => {
          document.querySelector(".js-total").textContent = res.data.finalTotal;
          data.cartData = res.data.carts;
          let str = "";
          if (res.data.carts == 0) {
              str = `<tr>
                  <td colspan="5">
                              <span class="material-icons empty-icon">production_quantity_limits</span>
                          </td>
                  </tr>`
          };
          data.cartData.forEach(function (item) {
              str += `<tr>
          <td>
              <div class="cardItem-title">
                  <img src="${item.product.images}" alt="">
                  <p>${item.product.title}</p>
              </div>
          </td>
          <td>NT$${toThousands(item.product.price)}</td>
          <td>${item.quantity}</td>
          <td>NT$${toThousands(item.product.price * item.quantity)}</td>
          <td class="discardBtn">
              <a href="#" class="material-icons" data-id="${item.id}">
                  clear
              </a>
          </td>
      </tr>`
          });
          cartList.innerHTML = str;
      })
}

  //添加產品
  productList.addEventListener("click", function (e) {
      e.preventDefault();
      let addCartClass = e.target.getAttribute("class");
      if (addCartClass !== "product-btn") {
          return;
      }
      let productId = e.target.getAttribute("data-id");
      data.cartData.forEach(function (item) {
          if (item.product.id === productId) {
              data.numCheck = item.quantity += 1;
          };
      });
    
    
      instance.post(`/${api_path}/carts`,{
        "data": {
          "productId": productId,
          "quantity": data.numCheck
        }
      }).then((res)=>{
        console.log('yes');
        getCartList();
      })
  });

//刪除購物車
cartList.addEventListener('click', function (e) {
  e.preventDefault();
  const cartId = e.target.getAttribute("data-id");
  if (cartId == null) {
      return;
  }
  instance.delete(`/${api_path}/carts/${cartId}`)
      .then(res => {
          getCartList();
      })
})


//刪除全部購物車
discardAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  instance.delete(`/${api_path}/carts`)
      .then(res => getCartList())
      .catch(res =>{
        const info = '購物車已刪除'
        Swal.fire(sweetAlertSet('info',info))
      })
})