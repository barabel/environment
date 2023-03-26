export const MEDIA_SIZES = {
	DESKTOP: 1280,
	TABLET: 768,
};

export const timeToResetForm = 4000;

/**
 * Функция для очистки пустых данных в фильтре
 * @param {Object} data - Объект с данными
 */
export const clearWasteData = (data) => {
	const values = {
		...data
	};
	const cleanData = {};
	const keys = Object.keys(values);
	keys.forEach((key) => {
		if (Array.isArray(values[key])) {
			if ((values[key][0] === "" || values[key][0] === undefined) && (values[key][1] === "" ||  values[key][1] === undefined)) {
				return
			}

			cleanData[key] = values[key];
		}

		if (typeof values[key] === 'object' && values[key] !== null) {
			if (values[key].value === '' || !values[key].type) {
				return
			}
			cleanData[key] = values[key]
		}

		if (values[key] === false) {
			cleanData[key] = values[key];
		}

		if (values[key]) {
			cleanData[key] = values[key];
		}
	});

	return cleanData
}

/**
 * Функция для проверки внешней ссылки
 * @param {string} url - Адрес
 */
export const isExternalUrl = (url) => new URL(url, location.origin).origin !== location.origin;

/**
 * Функция возвращает true, если размер вьюпорта равен desktop
 */
export const IS_DESKTOP = () => {
	return window.innerWidth >= MEDIA_SIZES.DESKTOP;
}

/**
 * Функция возвращает true, если размер вьюпорта mobile
 */
export const IS_MOBILE = () => {
	return window.innerWidth < MEDIA_SIZES.TABLET;
}
