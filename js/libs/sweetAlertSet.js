export const sweetAlertSet = (type, info) => {
  return {
    icon: type,
    iconColor: 'red',
    title: info,
    showCloseButton: true,
    popup: 'swal2-show',
    backdrop: 'swal2-backdrop-show'
  }
}
