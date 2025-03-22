import React, { useState, useEffect } from 'react';
import './ShareMessageButton.css';
import CustomButton from '../../components/Button/CustomButton';

const ShareMessageButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [messageId, setMessageId] = useState(null);

    // Получаем данные сообщения при монтировании компонента
    useEffect(() => {
        if (Telegram.WebApp.initDataUnsafe?.message) {
            setMessageId(Telegram.WebApp.initDataUnsafe.message.message_id);
        }
    }, []);

    const handleShareMessage = () => {
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        if (!messageId) {
            setError('Сообщение не найдено');
            setLoading(false);
            return;
        }

        try {
            Telegram.WebApp.shareMessage(
                messageId,
                (isSent) => {
                    if (isSent) {
                        setSuccessMessage('Сообщение успешно отправлено!');
                    } else {
                        setError('Отправка отменена');
                    }
                    setLoading(false);
                }
            );
        } catch (error) {
            setError('Ошибка при отправке: ' + error.message);
            setLoading(false);
        }
    };

    return (
        <div className="share-message-container">
            <div className="message-content">
                {/* Ваше содержимое сообщения бота */}

                <div className="share-button-wrapper">
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <CustomButton
                        label={loading ? 'Отправка...' : 'Переслать сообщение'}
                        onClick={handleShareMessage}
                        disabled={loading || !messageId}
                        icon="📨"
                        className="share-button"
                    />
                </div>
            </div>
        </div>
    );
};

export default ShareMessageButton;