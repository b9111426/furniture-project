import { toThousands } from '../libs/util.js'
import config from '../config.js'
import { sweetAlertSet } from '../libs/sweetAlertSet.js'
import cartEvent from './cartEvent.js'

const productList = document.querySelector('.product-wrap')
const cartList = document.querySelector('.shoppingCart-tableList')
const orderInfoBtn = document.querySelector('.orderInfo-btn')
const form = document.querySelector('.orderInfo-form')
const inputs = document.querySelectorAll('input[type=text],input[type=email],input[type=tel]')
const customerName = document.querySelector('#customerName')
const customerPhone = document.querySelector('#customerPhone')
const customerEmail = document.querySelector('#customerEmail')
const customerAddress = document.querySelector('#customerAddress')
const tradeWay = document.querySelector('#tradeWay')

const { api_path ,instance} = config

const data = {
  cartData: [],
  numCheck: 1
}

export const getCartList = () => {
  instance.get(`/${api_path}/carts`)
    .then(res => {
      document.querySelector('.js-total').textContent = res.data.finalTotal
      data.cartData = res.data.carts
      let str = ''
      if (res.data.carts === 0) {
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
      })
      cartList.innerHTML = str
    })
}

// 添加產品
productList.addEventListener('click', function (e) {
  e.preventDefault()
  const addCartClass = e.target.getAttribute('class')
  if (addCartClass !== 'product-btn') {
    return
  }
  const productId = e.target.getAttribute('data-id')
  data.cartData.forEach(function (item) {
    if (item.product.id === productId) {
      data.numCheck = item.quantity += 1
    };
  })

  instance.post(`/${api_path}/carts`, {
    data: {
      productId: productId,
      quantity: data.numCheck
    }
  }).then(res => {
    getCartList()
  })
})

cartEvent.init()


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
