import React from 'react';
import Button from '../../components/Button/Button'; // Импортируем компонент Button
import './MainPage.css'; // Подключение CSS для стилизации (создайте файл при необходимости)
import {useNavigate} from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
const MainPage = () => {
    const navigate = useNavigate();
    // Функция, которая сработает при выборе "Напомнить себе"
    const handleRemindSelf = () => {
        navigate('/self_reminder');
        // Здесь можно добавить логику для перехода на страницу создания напоминания для себя
    };

    // Функция, которая сработает при выборе "Напомнить другому"
    const handleRemindOthers = () => {
        // Здесь можно добавить логику для перехода на страницу создания напоминания для другого пользователя
        navigate('/friend_reminder');
    };
    const handleMyReminders = () => {
        navigate('/my_reminders');
    }

    return (
        <div className="main-page-container">
            <BackButton />
            <div className="main-title">
                <h1>Выберите шаблон напоминания</h1>
            </div>
            <div className="description">
                Выберите, кому вы хотите создать напоминание — себе или другому пользователю в Telegram.
            </div>

            <div className="button-group">
                <Button
                    label="Напомнить себе"
                    onClick={handleRemindSelf}
                    className="remind-button"
                    style={{ margin: '10px' }}
                />
            </div>
            <div className="button-group">
                <Button
                    label="Напомнить другу"
                    onClick={handleRemindOthers}
                    className="remind-button"
                    style={{ margin: '10px' }}
                />
            </div>
            <div className="button-group">
                <Button
                    label="Мои напоминания"
                    onClick={handleMyReminders}
                    className="remind-button"
                    style={{ margin: '10px' }}
                />
            </div>
        </div>
    );
};

export default MainPage;
