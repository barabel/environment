
/**
 * Функция, которая «откладывает» вызов другой функции до того момента, когда с последнего вызова пройдёт определённое количество времени.
 *
 * @param {(any) => void} fn Функция коллбак
 * @param {number} ms Время
 * @returns
 */
export function debounce(fn, ms) {
  let timer;

  return function() {
    const fnCall = () => {
      fn.apply(this, arguments);
    };

    clearTimeout(timer)

    timer = setTimeout(fnCall, ms)
  };
}
