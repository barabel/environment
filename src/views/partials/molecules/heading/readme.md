# компонент heading

![heading](./heading.jpg?raw=true "Скриншот компонента heading")

## Модификаторы:
- heading--with-padding - добавляется автоматически, если в данных есть кнопка для перехода на деталку
- heading--left - модификатор для выравшивания текста по левому краю начиная с планшета

## CSS-Переменные:
--titleColor - можно задать в компоненте, если нужен другой цвет заголовка

--descriptionColor - можно задать в компоненте, если нужен другой цвет описания

## Пропсы:
- class: опциональный класс
- title: string, название блока
- description: string, описание блока
- link: object, ссылка для перехода на детальную страницу

## Пример данных:
```
"heading": {
  "title": "лучшие яхты недели",
  "description": "Эксперты MARINEPOINT помогут выбрать яхту вашей мечты, определиться с верфью и техническим оснащением"
  "link": {
    "url": "#"
  }
}
```
