import * as Yup from 'yup';
import { regexEmailValidation, regexPhoneValidation } from './form-validators';

/**
 * создает yup-схему
 * @param {Object[]} fields - массив с данными для инпутов {placeholder, type, name, validators, error_message}
 */

export const createYupSchema = (fields) => {
  const schema = {};

  const isRequired = (field) => field.validators?.includes('required') || false;

  const strReq = () => Yup.string().trim().required('Обязательное поле');

  fields.forEach((field) => {
    let result;

    switch(field.type) {
      case 'text':
      case 'textarea':
        result = isRequired(field) ? strReq() : Yup.string();
        break;

      case 'phone':
        result = strReq().matches(regexPhoneValidation, { message: 'Проверьте введёный номер' });
        break;

      case 'email':
        result = strReq().matches(regexEmailValidation, { message: 'Проверьте введёный E-mail' });
        break;

      case 'checkbox':
        if (isRequired(field)) result = strReq();
        break;

      case 'checkboxgroup':
        result = isRequired(field)
          ? Yup.array().of(strReq()).min(1, 'Выберите мимнимум один вариант')
          : Yup.array().of(strReq());
        break;

      case 'file':
        result = Yup.mixed()
          .test('accept', 'Некорректный тип файл', (file) => {
            return !field.accept?.length || field.accept?.includes(file.name?.match(/\.([^\.]+)$/)[0]);
          })
          .test('maxSize', `Размер файла не должен превышать ${field.maxSize}Мб`, (file) => {
            return !field?.maxSize || Math.round(field.maxSize * 1024 * 1024) > file.size;
          })
          .test('required', 'Прикрепите пожалуйста ваш файл', (file) => {
            return (isRequired(field) && !file.name) ? false : true;
          });
        break;
    }

    if (result) schema[field.name] = result;
  });

  return Yup.object(schema);
};
