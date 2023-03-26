import React from "react";
import cn from "classnames";
import { isExternalUrl } from "../../../../../assets/scripts/global";
import "./react-button.scss";

/**
 * Компонент кнопки
 * @param {Object} props - Пропсы
 * @param {string=} props.className - Дополнительные классы
 * @param {string=} props.title - Текст кнопки
 * @param {string=} props.url - Адресс ссылки
 * @param {string=} props.popup - Адрес апи для попапа
 */
const ReactButton = ({
  className,
  title,
  url,
  popup,
  ...props
}) => {
  const Tag = url ? "a" : "button";

  return (
    <Tag
      type={!url ? 'button' : null}
      {...props}
      className={cn('react-button h6', className)}
      href={url}
      target={isExternalUrl(url) ? '_blank' : null}
      rel={isExternalUrl(url) ? 'noreferrer noopener' : null}
      data-popup={typeof popup === 'string' ? popup : null}
    >
      {typeof title === 'string' && (
        title
      )}
    </Tag>
  );
}

export default ReactButton;
