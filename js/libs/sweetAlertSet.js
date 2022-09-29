export const sweetAlertSet = (type, info) => {
  return {
    icon: type,
    iconColor: type === 'info' ? '#e6484d' : '#aed265',
    title: info,
    showCloseButton: true
  }
}
