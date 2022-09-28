// const svgContainer = document.querySelector('#svgContainer')
export const createLottie = () => {
  return lottie.loadAnimation({
    container: svgContainer,
    animType: 'svg',
    loop: true,
    path: 'https://assets2.lottiefiles.com/packages/lf20_cxc3ktlp.json'
  })
}
