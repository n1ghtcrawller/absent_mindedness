import React, { useState } from 'react';
import './InviteFriend.css';
import CustomButton from '../../components/Button/CustomButton';
import BackButton from '../../components/BackButton/BackButton';

const InviteFriend = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const generateInviteLink = () => {
        // Ваша логика генерации ссылки (можно добавить параметры пользователя)
        return 'https://t.me/your_bot?start=ref_12345';
    };

    const handleSendInvite = async () => {
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            const inviteLink = generateInviteLink();
            const shareText = encodeURIComponent('Присоединяйся к крутому боту! 🚀');
            const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${shareText}`;

            Telegram.WebApp.openLink(shareUrl);
            setSuccessMessage('Диалог приглашения открыт! Поделитесь с друзьями 🤗');
        } catch (error) {
            setError('Ошибка: ' + error.message);
        } finally {
            setLoading(false);
        }
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
                    onClick={handleSendInvite}
                    disabled={loading}
                    icon="🎁"
                    className="invite-button"
                />
            </div>
        </div>
    );
};

export default InviteFriend;