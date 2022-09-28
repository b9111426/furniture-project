import { toThousands } from '../libs/util.js'
import config from '../config.js'
import { createLottie } from '../libs/createLottie.js'

const cartList = document.querySelector('.shoppingCart-tableList')
const orderInfoBtn = document.querySelector('.orderInfo-btn')
const form = document.querySelector('.orderInfo-form')
const inputs = document.querySelectorAll('input[type=text],input[type=email],input[type=tel]')
const customerName = document.querySelector('#customerName')
const customerPhone = document.querySelector('#customerPhone')
const customerEmail = document.querySelector('#customerEmail')
const customerAddress = document.querySelector('#customerAddress')
const tradeWay = document.querySelector('#tradeWay')

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
    const anLottie = createLottie()
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

orderInfoBtn.addEventListener('click', function (e) {
  e.preventDefault()

  // 判斷購物車是否為空
  if (data.cartData.length === 0) {
    alert('購物車為空的')
    return
  }

  // validate表單驗證
  // 驗證條件
  const constraints = {
    姓名: {
      presence: {
        message: '是必填欄位'
      }
    },
    電話: {
      presence: {
        message: '是必填欄位'
      },
      length: {
        minimum: 10,
        maximum: 11,
        message: '長度不正確'
      },
      format: {
        pattern: '[0-9-]+',
        message: '只能輸入數字'
      }
    },
    Email: {
      presence: {
        message: '是必填欄位'
      },
      email: {
        message: '不是有效信箱'
      }
    },
    寄送地址: {
      presence: {
        message: '是必填欄位'
      }
    },
    交易方式: {
      presence: {
        message: '是必填欄位'
      }
    }
  }

  const errors = validate(form, constraints)

  // 表單errors效果
  orderInputStatus(errors)

  if (errors) {
    Object.keys(errors).forEach(function (item) {
      // 判斷是否有兩個錯誤以上
      if (errors[item].length > 1) {
        document.querySelector(`.${item}`).innerHTML = `<p class="messages ${item}">${errors[item].join('<br>')}</p>`
      } else {
        document.querySelector(`.${item}`).innerHTML = `<p class="messages ${item}">${errors[item]}</p>`
      }
    })
    return
  }

  // post資料
  instance.post(`/${api_path}/orders`, {
    data: {
      user: {
        name: customerName.value,
        tel: customerPhone.value,
        email: customerEmail.value,
        address: customerAddress.value,
        payment: tradeWay.value
      }
    }
  })
    .then(res => {
      alert('訂單建立成功')
      document.querySelector('.orderInfo-form').reset()
      getCartList()
    })
})

// 表單errors效果
function orderInputStatus (errors) {
  inputs.forEach(function (item) {
    item.addEventListener('input', function () {
      item.nextElementSibling.textContent = ''
      item.classList.remove('formWarning')
    })
  })
  tradeWay.addEventListener('change', function () {
    tradeWay.nextElementSibling.textContent = ''
    tradeWay.classList.remove('formWarning')
  })
  // 欄位紅框效果
  if (errors) {
    errors['交易方式'] && tradeWay.classList.add('formWarning')
    errors['姓名'] && customerName.classList.add('formWarning')
    errors['電話'] && customerPhone.classList.add('formWarning')
    errors.Email && customerEmail.classList.add('formWarning')
    errors['寄送地址'] && customerAddress.classList.add('formWarning')
  }
}
