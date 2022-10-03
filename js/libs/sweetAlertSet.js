export const sweetAlertSet = (type, info) => {
  return {
    icon: type,
    iconColor: type === 'info' ? '#e6484d' : '#aed265',
    title: info,
    showCloseButton: true
  }
}
export const fadeAlertSet = (icon, info, text) => {
  return {
    position: 'top-end',
    icon: icon ? 'success' : 'info',
    width: 300,
    showConfirmButton: false,
    timer: 1500,
    customClass: {
      icon: 'fadeAlertSet-icon',
      title: 'fadeAlertSet-title'
    },
    title: info,
    text: text,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }

  }
}
