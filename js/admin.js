import config from './asset/config.js'
const { api_path, token, adminInstance } = config

let orderData = []
const orderList = document.querySelector('.js-orderList')
const checkbox = document.querySelectorAll('input[type=checkbox]')
console.log(checkbox)
function init () {
  getOrdList()
};
init()
function getOrdList () {
  adminInstance.get(`/${api_path}/orders`, {
    headers: {
      Authorization: token
    }
  })
    .then(res => {
      console.log(res.data.orders)
      orderData = res.data.orders
      let str = ''
      orderData.forEach(item => {
        // 組時間字串
        const timeStamp = new Date(item.createdAt * 1000)
        const orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth() + 1}/${timeStamp.getDate()}`
        // 組訂單字串
        let productStr = ''
        item.products.forEach(productItem => {
          if (productItem) { productStr += `<p>${productItem.title}x${productItem.quantity}</p>` }
        })

        // 組產品字串
        str += /* html */`
          <tr>
            <td class="orderNum">${item.id}</td>
            <td>
              <p>${item.user.name}</p>
              <p>0${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
                ${productStr}
            </td>
            <td>${orderTime}</td>
            <td >
              <div class="orderPage-toggleBtn">
                <img class='loading' src="./asset/load.gif" alt="">
                <input type="checkbox" class="orderPage-checkbox" ${item.paid ? 'checked' : ''}>
                <span class="toggle-switch" data-status="${item.paid}" data-id="${item.id}">
                    <span class="undo">未處理</span>
                    <span class="done">已處理</span>
                </span>
              </div>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
            </td>
          </tr>`
      })

      orderList.innerHTML = str
      renderC3()
    })
}

function renderC3 () {
  // 物件資料收集
  const total = {}
  const chartData = []
  orderData.forEach(function (item) {
    item.products.forEach(function (productItem) {
      if (total[productItem.title] == undefined) {
        total[productItem.title] = productItem.price * productItem.quantity
      } else {
        total[productItem.title] += productItem.price * productItem.quantity
      }
    })
  })
  const ary = Object.keys(total)
  ary.forEach(function (item) {
    const newAry = []
    newAry.push(item)
    newAry.push(total[item])
    chartData.push(newAry)
  })
  chartData.sort(function (a, b) {
    return b[1] - a[1]
  })

  if (chartData.length > 3) {
    let otherTotal = 0
    chartData.forEach(function (item, index) {
      if (index > 2) {
        otherTotal += chartData[index][1]
      }
    })
    chartData.splice(3)
    chartData.push(['其他', otherTotal])
  }

  // C3.js
  const chart = c3.generate({
    bindto: '#chart',
    data: {
      type: 'pie',
      columns: chartData
    },
    color: {
      pattern: ['#F2E26D', '#FCB172', '#E67497', '#A372FC']
    }
  })
}

orderList.addEventListener('click', (e) => {
  e.preventDefault()
  const targetClass = e.target.getAttribute('class')
  const id = e.target.getAttribute('data-id')
  if (targetClass === 'delSingleOrder-Btn js-orderDelete') {
    // deleteOrderItem(id)
    return
  }
  if (targetClass === 'toggle-switch') {
    const status = e.target.getAttribute('data-status')
    const checkBox = e.target.parentNode.querySelector('.orderPage-checkbox')
    changeOrderStatus(status, id, checkBox)
  }
})

function changeOrderStatus (status, id, checkBox) {
  let newStatus
  if (status === 'true') {
    newStatus = false
  } else {
    newStatus = true
  }
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
    data: {
      id: id,
      paid: newStatus
    }
  }, {
    headers: {
      Authorization: token
    }
  })
    .then(function (response) {
      checkBox.checked = !checkBox.checked
    })
}

function deleteOrderItem (id) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`, {
    headers: {
      Authorization: token
    }
  })
    .then(function (response) {
      getOrdList()
    })
}
