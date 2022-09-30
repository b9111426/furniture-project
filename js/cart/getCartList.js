import { toThousands } from '../libs/util.js'
import config from '../asset/config.js'
import { emptyCartLottie } from '../libs/createLottie.js'

const cartList = document.querySelector('.shopping-tableList')

const { api_path, instance } = config

export const getCartList = () => {
  return instance.get(`/${api_path}/carts`)
}

export const renderCartList = (data) => {
  const cartData = data.carts
  document.querySelector('.js-total').textContent = `NT$ ${data.finalTotal}`
  let str = ''
  if (cartData.length === 0) {
    str = /* html */`
    <tr>
        <td colspan="5">
                <div id="svgContainer"></div>
                <p>購物車為空的</p>
        </td>
    </tr>`
    cartList.innerHTML = str
    const anLottie = emptyCartLottie()
    anLottie.setSpeed(1)
  } else {
    cartData.forEach(function (item) {
      str += /* html */`
      <tr>
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
            <a href="javascript:;" class="material-icons" data-id="${item.id}">
                clear
            </a>
        </td>
    </tr>`
    })
    cartList.innerHTML = str
  }
}
