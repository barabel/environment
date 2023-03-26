import React, { useState, useLayoutEffect } from "react";
import { MEDIA_SIZES } from "../global";

const mediaQueries = {
  isDesktop: window.matchMedia(`(min-width: ${MEDIA_SIZES.DESKTOP}px)`),
  isTablet: window.matchMedia(`(min-width: ${MEDIA_SIZES.TABLET}px) and (max-width: ${MEDIA_SIZES.DESKTOP - 1}px)`),
  isMobile: window.matchMedia(`(max-width: ${MEDIA_SIZES.TABLET - 1}px)`)
}

const mediaQueriesKeys = Object.keys(mediaQueries);

/**
 * Хук определяет размер экрана, и возвращает объект со свойствами, равные true или false на определенный размер.
 */
const useMatchMedia = () => {
  const [values, setValues] = useState(mediaQueriesKeys.map(key => mediaQueries[key].matches));

  useLayoutEffect(() => {
    const handler = () => setValues(mediaQueriesKeys.map(key => mediaQueries[key].matches));

    mediaQueriesKeys.forEach((key) => {
      if (mediaQueries[key]?.addEventListener) {
        mediaQueries[key].addEventListener('change', handler);
      } else {
        mediaQueries[key].addListener(handler);
      }
    });

    return () => {
      mediaQueriesKeys.forEach((key) => {
        if (mediaQueries[key]?.addEventListener) {
          mediaQueries[key].removeEventListener('change', handler);
        } else {
          mediaQueries[key].removeListener(handler);
        }
      });
    }
  }, []);

  return mediaQueriesKeys.reduce(
    (acc, screen, index) => ({
      ...acc,
      [screen]: values[index],
    }),
    {}
  );
};

export default useMatchMedia;
