import React, { useContext } from 'react';
import { ReminderContext } from '../../components/ReminderContext/ReminderContext';
import './Confirm.css'; // Импортируем стили
import Button from '../../components/Button/Button'; // Импортируем компонент кнопки

const Confirm = () => {
    const { reminderData } = useContext(ReminderContext); // Получаем данные из контекста

    const {
        reminderText,
        reminderDate,
        reminderTime,
        repeatCount,
        reminderBefore,
        comment,
        selectedFriend
    } = reminderData; // Достаем данные из reminderData

    const handleSubmit = () => {
        // Логика отправки напоминания
        alert('Напоминание отправлено!');
    };

    return (
        <div className="confirm-container">
            <h2>Подтверждение напоминания</h2>
            <p><strong>Напоминание:</strong> {reminderText}</p>
            <p><strong>Дата:</strong> {reminderDate}</p>
            <p><strong>Время:</strong> {reminderTime}</p>
            <p><strong>Повторить:</strong> {repeatCount} раз</p>
            <p><strong>Напомнить за:</strong> {reminderBefore}</p>
            <p><strong>Комментарий:</strong> {comment || 'Нет'}</p>
            {selectedFriend && <p><strong>Друг:</strong> {selectedFriend}</p>}

            <Button label="Отправить" onClick={handleSubmit} />
        </div>
    );
};

export default Confirm;
