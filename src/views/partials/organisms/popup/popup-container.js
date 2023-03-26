import React, { useState, useEffect, useRef, Suspense } from "react";
import cn from "classnames";
import { disableBodyScroll } from 'body-scroll-lock';

/**
 * Функция PopupContainer это контейнер попапа с определенным типом, который приходит в пропсах PopupC, по типу определяется, какой попап будет внутри котейнера,так же блокирует скрол на странице и при нажатии на кнопку popup__close размонтирует компонент
 * @param {Object} props - Пропсы
 * @param {string=} props.className - Дополнительные классы
 * @param {Object=} props.popupData - Объект пропсов попапа
 * @param {Object=} props.PopupC - Компонент попапа
 * @param {() => any} props.close - Функция закрытия попапа
 * @param {() => any} props.closeAll - Функция закрытия всех попапов
 * @param {string=} props.index - Номер попапа
 * @param {boolean} props.isCloseAll - Флаг, показывающий, закрывает ли все попапы закрытия попапа
 */
const PopupContainer = ({
	className,
	popupData,
	PopupC,
	close,
	closeAll,
	index,
	isCloseAll
}) => {
	const popup = useRef(null);
	const wrapper = useRef(null);
	const [isAppearing, setAppearing] = useState(false);

	const durationClose = 200;

	useEffect(() => {
		if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
			document.body.style.overflow = "hidden"
		}

		const handleCloseEvent = (event) => {
			if (event.detail.index === index) {
				closePopup();
			}
		}

		window.addEventListener('closePopup', handleCloseEvent);

		disableBodyScroll(popup.current, {
			reserveScrollBarGap: true,
			allowTouchMove: el => {
				while (el && el !== document.body) {
					if (el.getAttribute('bodyscrolllockignore') !== null) {
						return true;
					}

					el = el.parentElement;
				}
			},
		});

		setAppearing(true);

		return () => {
			window.removeEventListener('closePopup', handleCloseEvent);
			document.body.style.overflow = "";
		}
	}, []);

	const closePopup = () => {
		setAppearing(false);

		setTimeout(() => {
			isCloseAll ? closeAll() : close();
		}, durationClose);
	}

	const closeByOverlayClick = (event) => {
		if (event.target === wrapper.current) {
			closePopup();
		}
	}

	return (
		<div ref={popup} className={cn('popup', className, { "popup--appearing": isAppearing })}>
			<div className='popup__container'>
				{!popupData.withoutClose && <button className="popup__close" onClick={closePopup}>
					<svg title="close">
						<use xlinkHref="/assets/svg/sprite.svg#close"></use>
					</svg>
				</button>}
				<div ref={wrapper} className="popup__wrapper" onClick={closeByOverlayClick}>
					<Suspense fallback={<div></div>}>
						{PopupC && <PopupC close={closePopup} closeAll={closeAll} {...popupData} />}
					</Suspense>
				</div>
			</div>
		</div>
	);
}

export default PopupContainer;
