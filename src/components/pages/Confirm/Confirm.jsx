import React, { useContext, useState } from 'react';
import { ReminderContext } from '../../components/ReminderContext/ReminderContext';
import './Confirm.css';
import duckGif from './duck.gif';
import BackButton from "../../components/BackButton/BackButton";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Confirm = () => {
    const { reminderData } = useContext(ReminderContext);
    const [isDuckVisible, setIsDuckVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [sentData, setSentData] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setIsDuckVisible(true);
        setErrorMessage('');
        setSentData(null);

        const dataToSend = {
            user: reminderData.user.id,
            selectedFriend: reminderData.selectedFriend.id,
            reminderText: reminderData.reminderText,
            reminderDate: reminderData.reminderDate,
            reminderTime: reminderData.reminderTime,
            comment: reminderData.comment,
            critically: reminderData.critically,
        };

        console.log("Preparing to send data:", dataToSend); // Проверка данных
        setSentData(dataToSend);
        console.log("Sent Data set:", dataToSend); // Проверка sentData

        try {
            const response = await axios.post('https://ab-mind.ru/api/create_reminder', dataToSend);
            console.log("Reminder created successfully:", response.data);
        } catch (error) {
            console.error("Error creating reminder:", error);
            setIsDuckVisible(false);
            setErrorMessage('Ошибка при создании напоминания. Попробуйте ещё раз.');
        }
    };

    console.log("Reminder Data from context:", reminderData); // Проверка reminderData

    const {
        user,
        reminderText,
        critically,
        reminderDate,
        reminderTime,
        comment,
        friend,
    } = reminderData;

    return (
        <div className="confirm-container">
            <BackButton />
            {!isDuckVisible && (
                <div>
                    <p>Подтверждение напоминания</p>
                    <p><strong>Кто:</strong> {typeof user}</p>
                    <p><strong>Напоминание:</strong> {typeof reminderText}</p>
                    <p><strong>Критичность:</strong> {typeof critically}</p>
                    <p><strong>Дата:</strong> {typeof reminderDate}</p>
                    <p><strong>Время:</strong> {typeof reminderTime}</p>
                    <p><strong>Комментарий:</strong> {typeof comment}</p>
                    <p><strong>Кому:</strong> {typeof friend}</p>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button onClick={handleSubmit}>Отправить</button>
                </div>
            )}

            {isDuckVisible && (
                <div className="duck-sent-container">
                    <img src={duckGif} alt="Telegram Duck" className="duck-gif" />
                    <p className="sent-message">Отправлено!</p>
                    <Button onClick={() => navigate('/main_page')} label="На главную" />
                </div>
            )}
            
            {/* Отображение типов данных */}
            <div className="request-body">
                <p><strong>Типы данных:</strong></p>
                <ul>
                    <li><strong>user:</strong> {typeof user}</li>
                    <li><strong>reminderText:</strong> {typeof reminderText}</li>
                    <li><strong>critically:</strong> {typeof critically}</li>
                    <li><strong>reminderDate:</strong> {typeof reminderDate}</li>
                    <li><strong>reminderTime:</strong> {typeof reminderTime}</li>
                    <li><strong>comment:</strong> {typeof comment}</li>
<li><strong>friend:</strong> {typeof friend}</li>
</ul>
</div>
</div>
);
};

export default Confirm;