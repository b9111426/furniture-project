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
    format: {
      pattern: '^(09[0-9]{8}|0[1-9][0-9]{7,8})$',
      flags: 'g',
      message: '格式不正確'
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
