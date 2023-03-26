import Swiper, { Navigation, Pagination, Manipulation } from 'swiper';
import SwiperControls from './swiper-controls';
import { getSlidesPerView } from './swiper-utils';

/**
 * Создаёт свайпер с прогресс-баром и пагинацией. Контролы и сам свайпер отключаются если слайдов недостаточно.
 * Слайдам нужно задать "align-self: stretch; height: auto;" чтобы они растягивались на всю высоту
 * И max-width на случай если недостаточно слайдов и свайпер отключён
 * На 2 слайдах ширина каждого: calc(50% - .spaceBetween / 2)
 * На трёх: calc((100% - .spaceBetween * 2) / 3)
 * На четырёх: calc((100% - .spaceBetween * 3) / 4)
 * 
 * @param {HTMLElement} swiperContainer - блок .swiper в который вложен .swiper-wrapper
 * @param {HTMLElement} controlsContainer - блок .swiper-controls в который вложены пагинация и прогресс-бар
 * @param {string} slideSelector - query-selector слайдов свайпера (.swiper-slide)
 * @param {Object} config - параметры самого swiper'а
 */

export default class CustomSwiper {
  constructor ({ swiperContainer, controlsContainer, slideSelector, config }) {
    try {
      if (!swiperContainer) throw new Error('не передан swiperContainer (блок .swiper)');
      if (!controlsContainer) throw new Error('не передан controlsContainer (блок .slider-controls)');
      if (!slideSelector) throw new Error('не передан slideSelector');

      this.swiperContainer = swiperContainer;
      this.controlsContainer = controlsContainer;
      this.slideSelector = slideSelector.trim();
      this.config = config;

      this.slidesCount = this.countSlides();
      if (!this.slidesCount) throw new Error('слайды не найдены');

      this.controls = new SwiperControls({
        container: this.controlsContainer,
        slidesCount: this.slidesCount,
      });

      if (!this.controls) throw new Error('ошибка при создании SwiperControls');

      this.create(); // создание свайпера
    }
    catch (err) {
      console.error('CustomSwiper ' + err.message);
      return null;
    }
  }

  get defaultConfig() {
    return {
      modules: [Navigation, Pagination, Manipulation],
      pagination: {
        el: this.controls.elements.progressbar,
        type: "progressbar",
      },
      navigation: {
        prevEl: this.controls.elements.prevBtn,
        nextEl: this.controls.elements.nextBtn,
      },
    }
  }

  countSlides() {
    return this.swiperContainer.querySelectorAll(this.slideSelector + ':not(.swiper-slide-duplicate)')?.length || 0;
  }

  create(params = {}) {
    this.swiper = new Swiper(this.swiperContainer, {
      ...this.defaultConfig,
      ...this.config,
      ...params,
    });

    this.checkSlidesLack(this.swiper);

    if (!this.swiper.eventsListeners.breakpoint?.length) {
      this.swiper.on('breakpoint', () => this.checkSlidesLack(this.swiper));
    }

    this.controls.init(this.swiper);
  }

  checkSlidesLack(swiper) { // отключает свайпер и скрывает пагинацию если слайдов недостаточно
    const slidesPerView = getSlidesPerView(swiper);

    if (slidesPerView >= this.slidesCount) { // если слайдов недостаточно
      if (swiper.params?.loop) { // а слайдер зацикленный, пересоздаёт на незацикленный
        swiper.destroy(false, false);
        this.create({ loop: false });
      }
      this.controlsContainer.style.display = "none"; // убирает контролы
    }
    else {
      if (this.config.loop === true && swiper.params?.loop === false) {
        swiper.destroy(false, false); // пересоздаёт незацикленный обратно в зацикленный
        this.create();
      }
      this.controlsContainer.style.display = "";
    }

    swiper.slideTo(swiper.params?.loop ? swiper.loopedSlides : 0, 0); // отматывает до первого слайда
  }

  replaceAllSlides(htmlString) {
    this.swiper.removeAllSlides();

    this.swiper.appendSlide(htmlString); // вставляет разметку с новыми слайдами

    this.slidesCount = this.countSlides(); // пересчитывает слайды

    this.swiper.destroy();

    this.create(); // пересоздаёт свайпер

    this.controls.update(this.swiper, this.slidesCount);
  }
};
