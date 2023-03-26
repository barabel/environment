import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import api from "../../../../assets/scripts/api";
import cn from "classnames";
import getUTMFromUrlWithCurrentPage from "../../../../assets/scripts/UTMFromUrlWithCurrentPage";
import useYupValidationResolver from "../../../../assets/scripts/hooks/useYupValidationResolver";
import { timeToResetForm } from "../../../../assets/scripts/global";
import { createYupSchema } from "../../../../assets/scripts/yupSchema";
import { clearWasteData } from "../../../../assets/scripts/global";
import { emitEvent } from "../../../../assets/scripts/emitEvent";
import ReactButton from "../../atoms/react/button/react-button";
import ReactInput from "../../atoms/react/input/react-input";
import ReactTextarea from "../../atoms/react/textarea/react-textarea";
import ReactPolitics from "../react/politics/react-politics";
import ReactSelect from "../../atoms/react/select/react-select";
import useMatchMedia from "../../../../assets/scripts/hooks/useMatchMedia";
import "./form.scss";

const formTypes = {
  horizontal: "form--horizontal",
  applications: "form--applications",
  mailing: "form--mailing"
}

/**
 * @param {Object} props - Пропсы
 * @param {string=} props.className - Дополнительные классы
 * @param {string=} props.action - api для формы
 * @param {string=} props.title - Заголовок формы
 * @param {string=} props.type - тип формы
 * @param {array=} props.fields - массив для инпутов с данными с сервера {placeholder, type, name, validators, error_message}
 * @param {object=} props.btn - данные для кнопки {title = текст кнопки}
 * @param {string=} props.method - метод формы
 * @param {Function} props.onRequestSended - Вызывается при успешном выполнении запроса
 * @param {Object=} props.store - Хранилище данных
 * @param {(any) => void} props.setStore - Метод отправки данных в хранилище
 * @param {(any) => Object} props.enrichData - Колбак, который должен возвращать объект, свойства которых будут передаваться при сабмите формы
 */
const Form = ({
  className,
  action,
  method,
  title,
  type,
  fields,
  btn,
  onRequestSended,
  store = {},
  setStore,
  enrichData,
}) => {
  const validationSchema = createYupSchema(fields);

  const resolver = useYupValidationResolver(validationSchema);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onBlur",
    resolver
  });

  useEffect(() => reset, [fields]); // очистка стейта react-hook-form при обновлении пропса с полями
  const [keyValue, setKeyValue] = useState(0);

  const [progressSending, setProgressSending] = useState(0);
  const { isMobile } = useMatchMedia();

  const [formState, setFormState] = useState('default');

  const SUBMIT_BTN_TEXT = {
    default: btn?.title ?? 'Отправить',
    sending: btn?.title ?? 'Отправить',
    success: 'Заявка отправлена',
    error: 'Ошибка отправки данных'
  };

  const handleSubmitForm = (data, doNotSend = false) => {
    if (action) {
      if (!doNotSend) setFormState('sending');

      const callbackData = typeof enrichData === 'function' ? enrichData() : {};
      const reqBody = {
        ...clearWasteData(data),
        ...getUTMFromUrlWithCurrentPage(),
        ...clearWasteData(callbackData)
      };

      const formData = new FormData();

      const checkboxGroupNames = fields
        .filter(field => field.type === 'multiselect')
        .map(field => field.name);

      Object.keys(callbackData).forEach((key) => {
        if (Array.isArray(callbackData[key])) {
          checkboxGroupNames.push(key);
        }
      });

      for (let key in reqBody) {
        if (checkboxGroupNames.includes(key)) {
          reqBody[key].forEach(value => formData.append(`${key}[]`, value));
          continue;
        }
        formData.append(key, reqBody[key]);
      }

      if (!doNotSend) {
        if (window.Comagic) {
          if (typeof window.Comagic.addOfflineRequest === 'function') {
            window.Comagic.addOfflineRequest({
              name: reqBody.name,
              email: reqBody.email,
              phone: reqBody.phone,
              message: reqBody.message
            });
          }
        }
        api.post(action, formData, {
            onUploadProgress: progressEvent => {
              setProgressSending(Math.round(progressEvent.loaded / progressEvent.total * 100));
            }
          })
          .then(({ data }) => {
            onRequestSended();
            if (data.type === 'thankYou') {
              emitEvent('modalOpen', {
                ...data,
              });
            }
            setProgressSending(0);
            setFormState('success');

            setTimeout(() => {
              setFormState('default');
              let defaultData = {};
              Object.keys(getValues()).forEach((key) => {
                defaultData = {
                  ...defaultData,
                  [key]: ""
                }
              })
              reset(defaultData);
              setKeyValue(value => value + 1);
            }, timeToResetForm);
          })
          .catch((err) => {
            console.error(err);
            setProgressSending(0);
            setFormState('error');

            setTimeout(() => {
              setFormState('default')
            }, timeToResetForm);
          });
      }
    }
  };

  const handleDefaultValues = (field) => {
    if (store[field.name]) {
      return store[field.name];
    }

    if (field.type === "text" || field.type === "phone" || field.type === "email" || field.type === "textarea") {
      return field.value;
    }

    if (field.type === "multiselect") {
      return field.options?.find((option) => option.selected)?.value;
    }

    if (field.type === 'checkboxgroup' || field.type === 'checkbox') {
      return field.options?.filter(item => item.selected)?.map(item => item.value);
    }

    return '';
  }

  return (
    <div className={cn(`form`, {[formTypes[type]]: type}, className)}>
      {typeof title === 'string' && (
        <div className="form__title h4">
          {title}
        </div>
      )}
      <form
        key={keyValue}
        onSubmit={handleSubmit((data) => handleSubmitForm(data))}
        action={action}
        method={method}
        className="form__form"
      >
        <div className="form__fields">
          {fields.map((field, index) => (
            <Controller
              key={'controller-' + index}
              name={field.name}
              control={control}
              defaultValue={handleDefaultValues(field)}
              render={({ field: { onChange, value }, fieldState: { error } }) => {
                const handleChange = (event) => {
                  onChange(event);
                  if (typeof setStore === 'function') {
                    setStore(getValues());
                  }
                }

                // если в данных поля нет сообщения об ошибке, выведет сообщение из схемы валидации
                const errorMsg = errors[field.name] ? (field.error_message ?? error.message) : "";

                return ((field.type === "text" || field.type === "phone" || field.type === "email")
                ?
                (
                  <ReactInput
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={value}
                    className="form__field"
                    onChange={handleChange}
                    error={errorMsg}
                  />
                )
                :
                (field.type === "textarea")
                ?
                (
                  <ReactTextarea
                    type={type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={value}
                    className="form__field"
                    onChange={handleChange}
                  />
                )
                :
                (field.type === "multiselect")
                ?
                (
                  <ReactSelect
                    className="form__field"
                    name={field.name}
                    placeholder={field.placeholder}
                    options={field.options}
                    isMulti={true}
                    onChange={handleChange}
                    error={errorMsg}
                  />
                )
                :
                null)
              }}
            />
          ))}
        </div>

        <ReactPolitics className={cn("form__politics", { "react-politics--mailing": type === 'mailing' })} text={type === 'mailing' ? 'Нажимая на кнопку «подписаться», я соглашаюсь ' : null} />
        <ReactButton
          type="submit"
          title={SUBMIT_BTN_TEXT[formState]}
          disabled={formState !== 'default'}
          className={cn("form__btn", { "react-button--blue": !isMobile && type === 'mailing' })}
        />
      </form>
    </div>
  );
};

Form.defaultProps = {
  onRequestSended: () => {},
}

export default Form;
