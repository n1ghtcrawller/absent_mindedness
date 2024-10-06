import React, { useContext, useState } from 'react';
import { ReminderContext } from '../../components/ReminderContext/ReminderContext';
import './Confirm.css';
import duckGif from './duck.gif';
import BackButton from "../../components/BackButton/BackButton"; // Импортируем ваш GIF-файл утенка

const Confirm = () => {
    const { reminderData } = useContext(ReminderContext);
    const [isDuckVisible, setIsDuckVisible] = useState(false);

    const handleSubmit = () => {
        setIsDuckVisible(true); // Показать утенка и скрыть текст
    };

    const {
        user,
        reminderText,
        reminderDate,
        reminderTime,
        comment,
        selectedFriend
    } = reminderData;

    return (
        <div className="confirm-container">
            <BackButton/>
            {!isDuckVisible && (
                <>
                    <h2>Подтверждение напоминания</h2>
                    <p><strong>Кто:</strong> {user}</p>
                    <p><strong>Напоминание:</strong> {reminderText}</p>
                    <p><strong>Дата:</strong> {reminderDate}</p>
                    <p><strong>Время:</strong> {reminderTime}</p>
                    <p><strong>Комментарий:</strong> {comment || 'Нет'}</p>
                    {selectedFriend && <p><strong>Друг:</strong> {selectedFriend}</p>}
                    <button onClick={handleSubmit}>Отправить</button>
                </>
            )}

            {isDuckVisible && (
                <div className="duck-sent-container">
                    <img src={duckGif} alt="Telegram Duck" className="duck-gif" />
                    <p className="sent-message">Отправлено!</p>
                </div>
            )}
        </div>
    );
};

export default Confirm;
