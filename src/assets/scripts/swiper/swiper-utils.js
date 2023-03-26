// вызывается из event'ов свайпера
const getSlidesPerView = (swiper) => {
  // !swiper?.currentBreakpoint - breakpoints не переданы в параметры при создании свайпера
  // swiper.currentBreakpoint === 'max' - breakpoints переданы, но разрешение экрана меньше минимального
  return (!swiper?.currentBreakpoint || swiper.currentBreakpoint === 'max')
    ? swiper.params.slidesPerView // ставит дефолтное значение из полученных параметров или самого свайпера
    : swiper.passedParams.breakpoints[swiper.currentBreakpoint].slidesPerView;
};

export { getSlidesPerView };
