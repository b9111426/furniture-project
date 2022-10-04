import config from '../asset/config.js'
import { sweetAlertSet, fadeAlertSet } from '../libs/sweetAlertSet.js'
import { getCartList, renderCartList } from './getCartList.js'
import { constraints } from './validate.js'
import { orderInputStatus } from './orderInputStatus.js'

const { api_path, instance } = config

const productList = document.querySelector('.product-wrap')
const cartTableList = document.querySelector('.shopping-tableList')
const discardAllBtn = document.querySelector('.discardAllBtn')
const orderInfoBtn = document.querySelector('.orderInfo-btn')
const form = document.querySelector('.orderInfo-form')

const customerName = document.querySelector('#customerName')
const customerPhone = document.querySelector('#customerPhone')
const customerEmail = document.querySelector('#customerEmail')
const customerAddress = document.querySelector('#customerAddress')
const tradeWay = document.querySelector('#tradeWay')

export default {
  numCheck: 1,
  cartData: [],
  getData (data) {
    this.cartData = data
  },
  resetTotal () {
    document.querySelector('.js-total').innerHTML = '<img class="loading" src="./asset/load.gif" alt="">計算中'
  },

  // 添加產品
  addProduct (e,thsObj) {
    const title = e.target.parentNode.querySelector('.product-title')
    const productId = e.target.getAttribute('data-id')
    const selectNum = e.target.parentNode.querySelector('.product-quantity')
    const quantity = parseInt(selectNum.value)

    const addCartClass = e.target.getAttribute('class')
    if (addCartClass !== 'product-btn') {
      return
    }

    thsObj.resetTotal()
    thsObj.numCheck = quantity
    // 查看cartData是否已有此選項
    thsObj.cartData.forEach(item => {
      if (item.product.id === productId) {
        thsObj.numCheck = item.quantity + quantity
      }
    })

    instance.post(`/${api_path}/carts`, {
      data: {
        productId: productId,
        quantity: thsObj.numCheck
      }
    }).then(res => {
      const info = `${title.innerHTML}`
      const text = '已經加入到購物車'
      Swal.fire(fadeAlertSet(true, info, text))
      getCartList().then(res => {
        thsObj.getData(res.data.carts)
        renderCartList(res.data)
        selectNum.value = 1
        thsObj.numCheck = 1
      })
    })
  },
  deleteSingle(e,thsObj){
    const title = e.target.parentNode.parentNode.querySelector('.cardItem-title>p').innerHTML
    thsObj.resetTotal()
    const cartId = e.target.getAttribute('data-id')
    if (cartId === null) {
      return
    }
    instance.delete(`/${api_path}/carts/${cartId}`)
      .then(res => {
        const info = `${title}`
        const text = '已從購物車刪除'
        Swal.fire(fadeAlertSet(false, info, text))
        getCartList().then(res => {
          thsObj.getData(res.data.carts)
          renderCartList(res.data)
        })
      })
  },
  // 刪除購物車
  deleteAll (e,thsObj) {
    if (thsObj.cartData.length) { thsObj.resetTotal() }
    instance.delete(`/${api_path}/carts`)
      .then(res => {
        getCartList().then(res => {
          thsObj.getData(res.data.carts)
          renderCartList(res.data)
        })
      })
      .catch(err => {
        const { message } = JSON.parse(err.request.responseText)
        const info = message.split(' ')[0]
        Swal.fire(sweetAlertSet('info', info))
      })
  },
  // 送出訂單
  submitOder (e,thsObj) {
      // 判斷購物車是否為空
      if (thsObj.cartData.length === 0) {
        const info = '購物車為空的'
        Swal.fire(sweetAlertSet('info', info))
        return
      }

      // validate表單驗證
      const errors = validate(form, constraints)

      // 表單errors效果
      orderInputStatus(errors, customerName, customerPhone, customerEmail, customerAddress, tradeWay)
      // post資料
      if (!errors) {
        instance.post(`/${api_path}/orders`, {
          data: {
            user: {
              name: customerName.value.trim(),
              tel: customerPhone.value.substr(1),
              email: customerEmail.value.trim(),
              address: customerAddress.value.trim(),
              payment: tradeWay.value
            }
          }
        })
          .then(res => {
            const info = '訂單建立成功'
            Swal.fire(sweetAlertSet('success', info))
            document.querySelector('.orderInfo-form').reset()
            getCartList().then(res => {
              thsObj.getData(res.data.carts)
              renderCartList(res.data)
            })
          })
      }
    
  },

  init () {
    const thsObj = this

    function debounce(func,delay){
      let timer
      return function(e){
        e.preventDefault()
        const loading = e.target.parentNode.querySelector('.loading')
        if(loading){loading.classList.remove('d-none')}
        
        clearTimeout(timer)
        timer = setTimeout(function(){
          if(loading){loading.classList.add('d-none')}
          func(e,thsObj)
        },delay)
      }
    }

    productList.addEventListener('click', debounce(thsObj.addProduct,500))
    cartTableList.addEventListener('click', debounce(thsObj.deleteSingle,500))
    discardAllBtn.addEventListener('click', debounce(thsObj.deleteAll,500))
    orderInfoBtn.addEventListener('click', debounce(thsObj.submitOder,500))
  }
}
