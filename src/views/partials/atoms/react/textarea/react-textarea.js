import React, { useEffect, useRef } from "react";
import { OverlayScrollbars } from 'overlayscrollbars';
import cn from "classnames";
import "./react-textarea.scss";

/**
 * @param {Object} props - Пропсы
 * @param {string} props.name - name инпута
 * @param {string} props.value - value инпута
 * @param {(Event) => void} props.onChange - функция, вызывающаяся на onChange
 * @param {string} props.placeholder - placeholder инпута
 * @param {string} props.errorMsg - сообщение об ошибке
 * @param {string=} props.className - опциональный класс корневого элемента
 * @param {string=} props.fontClass - класс шрифтов для инпута
 * @param {object=} props.attributes - дополнительные атрибуты инпута
 * @param {string=} props.type - стиль текстареа
 */
const ReactTextarea = ({ name, value, onChange, placeholder, className, fontClass, attributes }) =>{
  const scrollRef = useRef();
  const textAreaRef = useRef(null);

  useEffect(() => {
    OverlayScrollbars(scrollRef.current, {
      overflow: {
        x: 'hidden',
        y: 'scroll',
      },
      scrollbars: {
        theme: 'react-textarea__scrollbar'
      },
    });
    if (textAreaRef?.current) {
      autoheight({target: textAreaRef.current});
    }
  }, []);

  const autoheight = (event) => { // растягивает textarea под высоту введённого текста
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight + 'px';
  };

  return (
    <label className={cn('react-textarea', className)}>
      <div className="react-textarea__body" ref={scrollRef}>
        <textarea
          ref={textAreaRef}
          name={name}
          value={value}
          onChange={event => {
            autoheight(event);
            onChange(event);
          }}
          placeholder={placeholder}
          className={cn("react-textarea__input", (fontClass || "h5"))}
          rows="4"
          {...attributes}
        />
      </div>
    </label>
  )
};

export default ReactTextarea;
