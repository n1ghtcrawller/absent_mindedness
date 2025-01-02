import React, { useState } from 'react';
import './InviteFriend.css';
import Button from "../../components/Button/Button";
import CustomInput from "../../components/CustomInput/CustomInput"; // Стили для компонента

const InviteFriend = () => {
    const [username, setUsername] = useState('');
    const [invitationSent, setInvitationSent] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');


    const handleInputChange = (e) => {
        setUsername(e.target.value);
        setError('');
    };

    const handleSendInvite = async () => {
        if (window.Telegram && window.Telegram.WebApp && Telegram.WebApp.shareMessage) {
            Telegram.WebApp.shareMessage(messageId, (success) => {
                if (success) {
                    setStatus("Сообщение успешно отправлено!");
                } else {
                    setStatus("Отправка сообщения была отменена пользователем.");
                }
            });
        } else {
            console.error("Функция shareMessage не поддерживается.");
            setStatus("Функция shareMessage недоступна.");
        }

    };

    return (
        <div className="invite-friend-container">
            <h2>Пригласить друга</h2>
            {invitationSent && (
                <p className="success-message">Приглашение отправлено!</p>
            )}
            {error && <p className="error-message">{error}</p>}
            <Button
                label="Пригласить"
                onClick={handleSendInvite}
            >
            </Button>
        </div>
    );
};

export default InviteFriend;
