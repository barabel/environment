import { getSlidesPerView } from './swiper-utils';

/**
 * Класс для работы с контролами свайпера, используется в CustomSwiper
 * @param {HTMLElement} container - блок .swiper-controls в который вложены пагинация и прогресс-бар
 * @param {number} slidesCount - изначальное количество слайдов
 */

export default class SwiperControls {
  constructor({ container, slidesCount }) {
    try {
      if (!container) throw new Error('container не передан');

      this.elements = {
        nextBtn: container.querySelector('.button-slider--next'),
        prevBtn: container.querySelector('.button-slider--prev'),
        current: container.querySelector('.slider-controls-navigation__current'),
        total: container.querySelector('.slider-controls-navigation__total'),
        progressbar: container.querySelector('.slider-controls__pagination'),
      };

      if (!slidesCount || isNaN(+slidesCount)) throw new Error('не передан slidesCount');
      this.slidesCount = +slidesCount;
    }
    catch (err) {
      console.error('SliderControls ' + err.message);
      return null;
    }
  }

  init(swiper) {    
    swiper.on('slideChange', () => {
      this.setPaginationValues(swiper);
      this.toggleProgressbarMod(swiper);
    });
  }

  update(swiper, slidesCount) { // вызывается при добавлении/удалении слайдов
    this.slidesCount = slidesCount;
    this.setPaginationValues(swiper, true);
    this.toggleProgressbarMod(swiper);
  }

  setPaginationValues(swiper, reset) { // 2 параметр true - ставит 1 страницу в пагинации
    this.elements.current.textContent = reset ? 1 : (swiper.realIndex + 1);
    this.elements.total.textContent = this.slidesCount;
  }

  toggleProgressbarMod(swiper) {
    const currentSlide = swiper.realIndex + 1;
    let filled = false;

    if (swiper.params.loop) {
      if (currentSlide >= this.slidesCount) filled = true;
    }
    else {
      if (currentSlide > this.slidesCount - getSlidesPerView(swiper)) filled = true; // незацикленный свайпер дошёл до последнего слайда
    }

    if (filled) {
      this.elements.progressbar.classList.add("slider-controls__pagination--active");
    } else {
      this.elements.progressbar.classList.remove("slider-controls__pagination--active");
    }
  }
};
