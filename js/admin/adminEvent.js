import config from '../asset/config.js'
import { sweetAlertSet } from '../libs/sweetAlertSet.js'
import { getOrdList } from '../admin.js'

const { api_path, token, adminInstance } = config
const discardAllBtn = document.querySelector('.discardAllBtn')

export default{
changeOrderStatus (status, id, checkBox, loading) {
    loading.classList.remove('d-none')
    let newStatus
    adminInstance.put(`/${api_path}/orders`, {
      data: {
        id: id,
        paid: status === 'true' ? newStatus = false : newStatus = true
      }
    }, {
      headers: {
        Authorization: token
      }
    })
      .then(res => {
        loading.classList.add('d-none')
        checkBox.checked = !checkBox.checked
        getOrdList()
      })
  },

deleteOrderItem (id, loading) {
    loading.classList.remove('d-none')
    adminInstance.delete(`/${api_path}/orders/${id}`, {
      headers: {
        Authorization: token
      }
    })
      .then(res => {
        loading.classList.add('d-none')
        getOrdList()
      })
},


deleteAllOrder(){
  discardAllBtn.addEventListener('click', (e) => {
    adminInstance.delete(`/${api_path}/orders`, {
      headers: {
        Authorization: token
      }
    }).then(res => {
      getOrdList()
    }).catch(err => {
      const info = JSON.parse(err.request.response).message.split(' ')[0]
      Swal.fire(sweetAlertSet('info', info))
    })
  })
},

init(orderList){
    //在範圍設定事件
    orderList.addEventListener('click', (e) => {
      e.preventDefault()
      const targetClass = e.target.getAttribute('class')
      const id = e.target.getAttribute('data-id')
      if (targetClass === 'delSingleOrder-Btn js-orderDelete') {
        const loading = e.target.parentNode.querySelector('.loading')
        this.deleteOrderItem(id, loading)
        return
      }
      if (targetClass === 'toggle-switch') {
        const status = e.target.getAttribute('data-status')
        const checkBox = e.target.parentNode.querySelector('.orderPage-checkbox')
        const loading = e.target.parentNode.querySelector('.loading')
        this.changeOrderStatus(status, id, checkBox, loading)
      }
    })

    this.deleteAllOrder()
  }
} 