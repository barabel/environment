import React, { useEffect } from "react";

/**
 * Хук, вызывающий колбак при клике вне прокинутого элемента
 * @param {Object} ref - Реф элемента
 * @param {(any) => void} callback - Колбак, выполняемый при клике вне элемента
 */
const OutsideClick = (ref, callback) => {
  useEffect(() => {
    const clickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [callback, ref]);
};

export default OutsideClick;
