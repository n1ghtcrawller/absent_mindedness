import React, { useState } from 'react';
import './InviteFriend.css';
import CustomButton from '../../components/Button/CustomButton';
import BackButton from '../../components/BackButton/BackButton';
import {useNavigate} from "react-router-dom";

const InviteFriend = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();
    const handleGoSpin = () => {
        navigate('/game');
    };
    

    const generateInviteLink = () => {
        const inviteLink = 'https://t.me/share/url?url=https://t.me/AbMindBot&text=Приглащаю тебя воспользоваться ботом управления внимания! 🚀';

        // Открываем ссылку в новой вкладке
        window.open(inviteLink);

        // Обновляем сообщения для пользователя
        setLoading(false);
        setSuccessMessage('Ссылка для приглашения скопирована и готова для отправки!');
    };

    const handleInviteClick = () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        generateInviteLink();
    };

    return (
        <div className="invite-friend-container">
            <BackButton />

            <div className="invite-content">
                <h1>Пригласи друга 👋</h1>
                <p>Поделись ботом с друзьями и получай бонусы за каждого приглашенного!</p>

                <div className="invite-illustration">
                    <div className="users-icon">👥</div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <CustomButton
                    label={loading ? 'Загрузка...' : 'Поделиться'}
                    onClick={handleInviteClick}
                    disabled={loading}
                    icon="🎁"
                    className="invite-button"
                />
                <CustomButton
                    label={'Крутить спины!'}
                    onClick={handleGoSpin}
                    disabled={loading}
                    icon="🎁"
                    className="spins"
                />
            </div>
        </div>
    );
};

export default InviteFriend;
