import axios from 'axios';
/**
 * функция serialize-преобразование обьектов в скроку для передачи в запросах
 * @param {obj} объект или массив для сериализации
 * @param {prefix} для описания конечного параметра запроса
 * @returns преобразованный обьект в скроку с соединением &
 */

export const serialize = (obj, prefix) => {
  const str = [];
  let p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + '[' + p + ']' : p,
        v = obj[p];
      str.push((v !== null && typeof v === 'object') ? serialize(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
  }
  return str.join('&');
}

/**
 *  перехват запросов или ответов до того, как они будут then или catch, для переобразования данных
 * @returns config преобразованный в скроку с соединением &
 */

axios.interceptors.request.use((config) => {
  config.paramsSerializer = (params) => serialize(params);
  return config;
});

/**
 * Класс декоратор для библиотеки axios, обрабатывающей запросы на сервер
 * @param {url} куда делается запрос, конечная точка api
 * @param {data} данные
 */
export default class api {
  static post(url, data = {}, config) {
    return axios.post(url, data, config);
  }

  static get(url, data = {}) {
    return axios.get(url, {
      params: data,
    });
  }

  static request(method = "get", url, data = {}) {
    if (method === "get") {
      return api.get(url, data);
    }

    return api.post(url, data);
  }
}
