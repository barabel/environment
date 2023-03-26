import React, { useState, useEffect } from "react";
import { clearAllBodyScrollLocks } from 'body-scroll-lock';
import api from "../../../../assets/scripts/api";
import { emitEvent } from "../../../../assets/scripts/emitEvent";
import PopupContainer from "./popup-container";
import "./popup.scss";

const popups = {
	thankYou: React.lazy(() => import("./thank-you/popup-thank-you"))
};

/**
 * Функция Popup это функционал попапа, который вызывает открытие скелета попапа (PopupContainer)
 * по кастомному событию modalOpen
 * так же закрывает попап через клику на крестик в правом углу, клику вне попапа,нажатием Esc,вызовом события modalClose, очищая заблокированный скрол
 */
const Popup = () => {
	const [popupList, setPopupList] = useState([]);

	useEffect(() => {
		const listenerOpen = (event) => {
			if (event.detail) {
				openPopup(event.detail);
			}
		}

		window.addEventListener('click', handleClickOpen);
		window.addEventListener('modalOpen', listenerOpen);

		return () => {
			window.removeEventListener('click', handleClickOpen);
			window.removeEventListener('modalOpen', listenerOpen);
		}
	}, []);

	useEffect(() => {
		const listenerClose = () => {
			emitEvent('closePopup', {
				index: popupList.length - 1
			});
		}

		const closeOnEscape = (event) => {
			if (event.keyCode === 27) {
				listenerClose();
			}
		}

		window.addEventListener('keydown', closeOnEscape);
		window.addEventListener('modalClose', listenerClose);

		return () => {
			window.removeEventListener('keydown', closeOnEscape);
			window.removeEventListener('modalClose', listenerClose);
		}
	}, [popupList]);

	const closePopup = () => {
		setPopupList((popupList) => {
			const slicedPopupList = popupList.slice(0, -1)
			if (slicedPopupList.length === 0) {
				clearAllBodyScrollLocks();
			}
			return slicedPopupList;
		});
	}

	const closeAllPopups = () => {
		setPopupList(() => {
			clearAllBodyScrollLocks();
			return [];
		});
	}

	const openPopup = (data) => {
		setPopupList((popupList) => {
			return [...popupList, {
				PopupC: popups[data.type],
				popupData: data
			}]
		});
	}

	const handleClickOpen = (event) => {
		const target = event.target.closest('[data-popup]');

		if (target) {
			const popupApi =  target.dataset?.popup;

			if (popupApi) {
				api.get(`${popupApi}`).then(res => {
					if (!res.data) return;
					openPopup(res.data);
				}).catch(err => console.error(err));
			}
		}
	}

	return (
		popupList.map((popup, index) => {
			return (
				<PopupContainer
					key={`popup-${index}`}
					popupData={popup.popupData}
					PopupC={popup.PopupC}
					close={closePopup}
					closeAll={closeAllPopups}
					isCloseAll={popup.popupData?.isCloseAll}
					index={index}
				/>
			)
		})
	);
}

export default Popup;
