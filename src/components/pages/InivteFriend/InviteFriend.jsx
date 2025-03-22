import React, { useState } from 'react';
import './InviteFriend.css';
import CustomButton from '../../components/Button/CustomButton';
import BackButton from '../../components/BackButton/BackButton';

const InviteFriend = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const generateInviteLink = () => {
        // Добавьте свою логику генерации ссылки
        // Например, можно использовать Telegram.WebApp.initData для получения данных пользователя
        return 'https://t.me/your_bot?start=ref_12345';
    };

    const handleSendInvite = async () => {
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            const inviteLink = generateInviteLink();
            const messageText = `Присоединяйся к крутому боту! 🚀 ${inviteLink}`;

            // Используем встроенный метод Telegram для отправки сообщения
            Telegram.WebApp.shareMessage(
                messageText,
                (isSent) => {
                    if (isSent) {
                        setSuccessMessage('Приглашение успешно отправлено! 🎉');
                    } else {
                        setError('Отправка отменена или произошла ошибка 😕');
                    }
                    setLoading(false);
                }
            );

        } catch (error) {
            setError('Ошибка: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <div className="invite-friend-container">
            <BackButton />

            <div className="invite-content">
                <h1>Пригласи друга 👋</h1>
                <p>Получай бонусы за каждого друга, который присоединится по твоей ссылке!</p>

                <div className="invite-illustration">
                    <div className="animated-icon">🚀</div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <CustomButton
                    label={loading ? 'Отправка...' : 'Пригласить друзей'}
                    onClick={handleSendInvite}
                    disabled={loading}
                    icon="💌"
                    className="pulse-button"
                />
            </div>
        </div>
    );
};

export default InviteFriend;