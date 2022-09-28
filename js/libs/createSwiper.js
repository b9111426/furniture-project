export const createSwiper = () => {
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    breakpoints: {

    },

    // 分頁按鈕
    pagination: {
      el: '.swiper-pagination'
    },

    // 前後頁按鈕
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },

    scrollbar: {
      el: '.swiper-scrollbar'
    },
    effect: 'slide', // slide的樣式
    autoplay: { // 是否要自動撥放
      delay: 2500
    }
  })
}
