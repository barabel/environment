import React from "react";
import {createRoot} from 'react-dom/client';
import Popup from '../../../views/partials/organisms/popup/popup';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

document.addEventListener('lazybeforeunveil', (e) => {
  if (e.target.lazyInit) {
    e.target.lazyInit();
  }
});

/**
 * Для рендеринга popup, DOM-элемент передается в ReactDOM.createRoot()(метод создания корня для рендеринга)
 */
const popups = document.getElementById('popups');
let popups_root;

if (popups) {
  popups.innerHTML = '';
  popups_root = createRoot(popups);
  popups_root.render(<Popup/>)
}
