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
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setIsDuckVisible(true);

        const dataToSend = {
            user: reminderData.user,
            selectedFriend: reminderData.selectedFriend,
            reminderText: reminderData.reminderText,
            reminderDate: reminderData.reminderDate,
            reminderTime: reminderData.reminderTime,
            comment: reminderData.comment,
            critically: reminderData.critically,
        };

        try {
            const response = await axios.post('keybasicsneutral.ru/api/create_reminder', dataToSend);
            console.log("Reminder created successfully:", response.data);
        } catch (error) {
            console.error("Error creating reminder:", error);
        }
    };

    const {
        creator,
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
                <>
                    <p>Подтверждение напоминания</p>
                    <p><strong>Кто:</strong> {creator}</p>
                    <p><strong>Напоминание:</strong> {reminderText}</p>
                    <p><strong>Критичность:</strong> {critically}</p>
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
