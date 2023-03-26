import React from "react";
import ReactButton from "../../../atoms/react/button/react-button";
import "./popup-thank-you.scss";

/**
 *
 * @param {Object} props - Пропсы
 * @param {string=} props.className - Дополнительные классы
 * @param {function=} props.close - пропс-коллбек закрытия попап
 * @param {function=} props.close - пропс-коллбек закрытия всех попапов
 * @param {string=} props.title - заголовок для формы
 */
const PopupThankYou = ({
  className,
  closeAll,
  title,
  description
}) => {
  return (
    <div
      className={[
        "popup-thank-you",
        className ? className : "",
      ].join(" ")}
    >
      <button onClick={() => closeAll()} className="popup-thank-you__close"></button>
      {(title || description) && (
        <div className="popup-thank-you__text">
          {title && (
            <div className={"popup-thank-you__title h4"}>{title}</div>
          )}
          {description && (
            <div className="popup-thank-you__description t1">{description}</div>
          )}
        </div>
      )}
      <ReactButton
        className="react-button--bordered-white popup-thank-you__btn"
        title="Вернуться к сайту"
        onClick={() => closeAll()}
      />
    </div>
  );
};

export default PopupThankYou;
