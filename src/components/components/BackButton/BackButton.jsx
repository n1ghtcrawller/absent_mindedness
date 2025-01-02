// components/components/BackButton.js

import { useEffect } from 'react';

const BackButton = () => {
    useEffect(() => {
        // Проверяем, доступен ли объект Telegram
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.BackButton.show();

            // Обработчик события нажатия на кнопку "Назад"
            const handleBackClick = () => {
                window.history.back(); // Возвращает на предыдущую страницу
            };

            // Подписываемся на событие нажатия кнопки "Назад"
            window.Telegram.WebApp.onEvent('backButtonClicked', handleBackClick);

            // Чистим обработчик при размонтировании компонента
            return () => {
                window.Telegram.WebApp.offEvent('backButtonClicked', handleBackClick);
            };
        }
    }, []);

    return null; // Компонент ничего не рендерит, только управляет кнопкой
};

export default BackButton;
