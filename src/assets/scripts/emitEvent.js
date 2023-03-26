/**
 * Функция создания кастомного события
 * Принимает параметры:
 * @param {name}  - тип события, строка
 * @param {detail} -  дополнительные данные для передачи их в событие
 *
 */
export const emitEvent = (name, detail) => {
  window.dispatchEvent(
    new CustomEvent(name, {
      bubbles: true,
      detail
    })
    )
}
