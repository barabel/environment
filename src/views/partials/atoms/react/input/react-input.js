import React, { useEffect, useState, useRef } from "react";
import cn from "classnames";
import Inputmask from 'inputmask';
import "./react-input.scss";

/**
 * Компонент инпута
 * @param {Object} props - Пропсы
 * @param {string=} props.className - Дополнительные классы
 * @param {string=} props.inputTypography - Типографический класс шрифта. По-умолчанию t2.
 * @param {string=} props.placeholder - Плейсхолдер инпута
 * @param {string} props.type - Тип инпута
 * @param {boolean=} props.onlyDigits - Флаг, при true можно вводить только цифры
 * @param {string} props.name - Имя инпута
 * @param {string=} props.value - Значение инпута
 * @param {string=} props.defaultValue - Дефолтное значение инпута
 * @param {string=} props.error - Текст ошибки инпута
 * @param {string=} props.autocomplete - Флаг автокомплита(подсказок) инпута
 * @param {(any) => void} props.onChange - Колбак, вызываемый при изменении инпута
 * @param {(any) => void} props.onBlur - Колбак, вызываемый при блуре инпута
 * @param {(any) => void} props.onKeyUp - Колбак, вызываемый при нажатии клавиши у инпута
 * @param {boolean=} props.removeErrorMessage - Флаг, убирающий сообщение об ошибке снизу
 */
const ReactInput = ({
  className,
  inputTypography,
  placeholder,
  type,
  onlyDigits,
  name,
  value,
  defaultValue,
  error,
  autocomplete,
  onChange,
  onBlur,
  onKeyUp,
  removeErrorMessage,
  ...props
}) => {
  const [controlledValueDigits, setControlledValueDigits] = useState(('' + (value ?? '')).replace(/\D/g, ''));
  const [controlledValue, setControlledValue] = useState(value);
  const [keyUpTimer, setKeyUpTimer] = useState();
  const [errorShow, setErrorShow] = useState(false);
  const phone_ref = useRef(null);

  useEffect(() => {
      if (!phone_ref.current) return;
      const inputmaskPhone = new Inputmask('+7 (999) 999-99-99');
      inputmaskPhone.mask(phone_ref.current);
  }, []);

  useEffect(() => {
    if (onlyDigits) {
      setControlledValueDigits(('' + (value ?? '')).replace(/\D/g, ''));
    } else {
      setControlledValue(value);
    }
  }, [value]);

  const handleChange = (event) => {
    const result = event.target.value.replace(/\D/g, '');
    if (onlyDigits) {
      setControlledValueDigits(result);
    } else {
      setControlledValue(event.target.value);
    }

    if (typeof onChange === 'function') {
      onChange(event, result);
    }
  }

  const handleKeyUp = (event) => {
    clearTimeout(keyUpTimer);
    setKeyUpTimer(setTimeout(() => {
      const result = event.target.value.replace(/\D/g, '');
      if (onlyDigits) {
        setControlledValueDigits(result);
      } else {
        setControlledValue(event.target.value);
      }

      if (typeof onKeyUp === 'function') {
        onKeyUp(event, result);
      }
      setKeyUpTimer('');
    }, 2000));
  }

  const handleBlur = (event) => {
    if (keyUpTimer) {
      clearTimeout(keyUpTimer);
      setKeyUpTimer('');

      const result = event.target.value.replace(/\D/g, '');
      if (onlyDigits) {
        setControlledValueDigits(result);
      } else {
        setControlledValue(event.target.value);
      }

      if (typeof onBlur === 'function') {
        onBlur(event, result);
      }
    }
  }

  return (
    <div className={cn("react-input", className, {"react-input--only-digits": onlyDigits, "react-input--error": error})} {...props}>
      <input
        ref={type === 'phone' ? phone_ref : null}
        type="text"
        className={cn("react-input__input", inputTypography || "h5")}
        placeholder={placeholder}
        name={name}
        value={onlyDigits && type !== 'phone' ? controlledValueDigits : controlledValue}
        defaultValue={defaultValue}
        onChange={(event) => handleChange(event)}
        onBlur={(event) => handleBlur(event)}
        onKeyUp={(event) => {
          if (event.key === 'Enter' || event.key === 'NumpadEnter' || event.key === 'Tab') {
            handleBlur(event);
          } else {
            handleKeyUp(event);
          }
        }}
        autoComplete={autocomplete}
      />
      {typeof error === "string" && !removeErrorMessage && error && (
        <div className="react-input__error">
          <svg className="react-input__error-icon" onClick={() => setErrorShow(!errorShow)}>
            <use href={`/assets/svg/sprite.svg#info`}></use>
          </svg>
          <div className={cn("react-input__error-text h5", { "react-input__error-text--show": errorShow })}>
            {error}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReactInput;
