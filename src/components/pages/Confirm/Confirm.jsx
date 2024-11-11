import React, { useContext, useState } from 'react';
import { ReminderContext } from '../../components/ReminderContext/ReminderContext';
import './Confirm.css';
import duckGif from './duck.gif';
import BackButton from "../../components/BackButton/BackButton";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const Confirm = () => {
    const { reminderData } = useContext(ReminderContext);
    const [isDuckVisible, setIsDuckVisible] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        setIsDuckVisible(true); // Показать утенка и скрыть текст
    };

    const {
        creator,
        reminderText,
        reminderDate,
        reminderTime,
        comment,
        friend
    } = reminderData;

    return (
        <div className="confirm-container">
            <BackButton />
            {!isDuckVisible && (
                <>
                    <p>Подтверждение напоминания</p>
                    <p><strong>Кто:</strong> {creator}</p>
                    <p><strong>Напоминание:</strong> {reminderText}</p>
                    <p><strong>Дата:</strong> {reminderDate}</p>
                    <p><strong>Время:</strong> {reminderTime}</p>
                    <p><strong>Комментарий:</strong> {comment || 'Нет'}</p>
                    <p><strong>Кому:</strong> {friend}</p>
                    <button onClick={handleSubmit}>Отправить</button>
                </>
            )}

            {isDuckVisible && (
                <div className="duck-sent-container">
                    <img src={duckGif} alt="Telegram Duck" className="duck-gif" />
                    <p className="sent-message">Отправлено!</p>
                    <Button onClick={() => navigate('/main_page')} label="На главную" />
                </div>
            )}
        </div>
    );
};

export default Confirm;