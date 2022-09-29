const inputs = document.querySelectorAll('input[type=text],input[type=email],input[type=tel]')

// 驗證條件
export const constraints = {
  姓名: {
    presence: {
      message: '必須填寫'
    }
  },
  電話: {
    presence: {
      message: '必須填寫'
    },
    length: {
      minimum: 10,
      maximum: 11,
      message: '長度不正確'
    },
    numericality: {
      message: '只能輸入數字'
    }
  },
  Email: {
    presence: {
      message: '必須填寫'
    },
    email: {
      message: '不是有效信箱'
    }
  },
  寄送地址: {
    presence: {
      message: '必須填寫'
    }
  },
  交易方式: {
    presence: {
      message: '必須選取'
    }
  }
}
// 表單狀態
export const orderInputStatus = (errors, customerName, customerPhone, customerEmail, customerAddress, tradeWay) => {
  // 清除錯誤效果
  inputs.forEach(function (item) {
    item.addEventListener('input', () => {
      item.nextElementSibling.textContent = ''
      item.classList.remove('formWarning')
    })
  })
  tradeWay.addEventListener('change', () => {
    tradeWay.nextElementSibling.textContent = ''
    tradeWay.classList.remove('formWarning')
  })
  // 欄位紅框效果
  if (errors) {
    Object.keys(errors).forEach(item => {
      // 判斷是否有兩個錯誤以上
      if (errors[item].length > 1) {
        let str = errors[item][0]
        errors[item].forEach((item, idx) => {
          if (idx >= 1) {
            str += `、${item.split(' ')[1]}`
          }
        })
        document.querySelector(`.${item}`).textContent = str
      } else {
        document.querySelector(`.${item}`).textContent = `${errors[item]}`
      }
    })

    errors['交易方式'] && tradeWay.classList.add('formWarning')
    errors['姓名'] && customerName.classList.add('formWarning')
    errors['電話'] && customerPhone.classList.add('formWarning')
    errors.Email && customerEmail.classList.add('formWarning')
    errors['寄送地址'] && customerAddress.classList.add('formWarning')
  }
}
