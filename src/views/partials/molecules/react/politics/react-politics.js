import React from "react";
import cn from "classnames";
import "./react-politics.scss";

/**
 * Комопнент политики персональных данных
 * @param {Object} props - Пропсы
 * @param {string=} props.className - Дополнительные классы
 * @param {string=} props.text - Текст не ссылки
 */
const ReactPolitics = ({
  className,
  text,
  ...props
}) => {
  return (
    <div className={cn("react-politics t3", className)} {...props}>
      <span className="react-politics__text">{text ? text : 'Нажимая на кнопку «отправить заявку», я соглашаюсь ' }</span>
      <a
        className="react-politics__link"
        href='/politics.pdf'
        target="_blank"
        rel="noreferrer noopener"
      >
        с политикой конфиденциальности
      </a>
    </div>
  );
}

export default ReactPolitics;
