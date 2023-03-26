/**
 * Получение utm меток с ссылки текущей страницы и адрес текущей страницы. Возвращает объект с метками и свойством page, в котором записан адрес текущей страницы.
 */
const getUTMFromUrlWithCurrentPage = () => {
    const url = window.location.search.substring(1);
    const utm = {};
    const params = new URLSearchParams(url);
    for (const key of params.keys()) {
        if (key.startsWith('utm_') || key.startsWith('ip')) {
            utm[key] = params.get(key);
        }
    }

    const result = {
        ...utm,
        page: window.location.href
    }
    return result || {};
}

export default getUTMFromUrlWithCurrentPage;
