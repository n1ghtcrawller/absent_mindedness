import React, { useState } from 'react';
import './InviteFriend.css';
import CustomButton from '../../components/Button/CustomButton';
import BackButton from '../../components/BackButton/BackButton';

const InviteFriend = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const generateInviteLink = () => {
        const inviteLink = 'https://t.me/share/url?url=https://t.me/AbMindBot&text=Присоединяйся к крутому боту! 🚀';

        // Открываем ссылку в новой вкладке
        window.open(inviteLink, '_blank');

        // Обновляем сообщения для пользователя
        setLoading(false);
        setSuccessMessage('Ссылка для приглашения скопирована и готова для отправки!');
    };

    const handleInviteClick = () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Генерация ссылки и выполнение действия
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
                    label={loading ? 'Загрузка...' : 'Пригласить друзей'}
                    onClick={handleInviteClick}
                    disabled={loading}
                    icon="🎁"
                    className="invite-button"
                />
            </div>
        </div>
    );
};

export default InviteFriend;
