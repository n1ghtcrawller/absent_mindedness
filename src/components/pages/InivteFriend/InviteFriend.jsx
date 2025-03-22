import React, { useState } from 'react';
import './InviteFriend.css';
import CustomButton from '../../components/Button/CustomButton';

const InviteFriend = () => {
    const [loading, setLoading] = useState(false);  // Состояние загрузки
    const [error, setError] = useState(null);  // Состояние ошибки
    const [successMessage, setSuccessMessage] = useState(null);  // Состояние успеха

    const handleShareMessage = () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const telegramLink = 'https://t.me/AbMindBot?start=share';

        try {
            window.open(telegramLink, '_blank');

            setSuccessMessage('Сообщение успешно отправлено!');
        } catch (err) {
            setError('Произошла ошибка при открытии Telegram.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="share-message-container">
            <div className="message-content">
                <div className="share-button-wrapper">
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <CustomButton
                        label={loading ? 'Отправка...' : 'Переслать сообщение'}
                        onClick={handleShareMessage}
                        disabled={loading}
                        icon="📨"
                        className="share-button"
                    />
                </div>
            </div>
        </div>
    );
};

export default InviteFriend;
