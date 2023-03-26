# Компонент инпута на реакте

![ComponentScreenshot](./react-input-example.png?raw=true "Скриншот компонента инпута на реакте")

## Пропсы:
  - className: string, Дополнительные классы
  - inputTypography: string, Типографический класс шрифта. По-умолчанию t2.
  - autocomplete: string, Значение автокомплита(подсказок) инпута
  - placeholder: string, Плейсхолдер инпута
  - name: string, Имя инпута
  - type: string, Тип инпута
  - onlyDigits: boolean, Флаг, при true можно вводить только цифры
  - value: string, Значение инпута
  - error: string, Текст ошибки инпута
  - defaultValue: string, Дефолтное значение инпута
  - onChange, functuion, Колбак, вызываемый при изменении инпута
  - onBlur, function, Колбак, вызываемый при блуре инпута
  - onKeyUp, function, Колбак, вызываемый при нажатии клавиши у инпута
  - removeErrorMessage, boolean, Флаг, убирающий сообщение об ошибке снизу
