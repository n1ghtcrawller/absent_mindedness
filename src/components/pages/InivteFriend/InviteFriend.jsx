import React, { useState } from 'react';
import './InviteFriend.css';
import CustomButton from '../../components/Button/CustomButton';

const ShareMessageButton = () => {
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [error, setError] = useState(null); // Состояние ошибки
    const [successMessage, setSuccessMessage] = useState(null); // Состояние успеха

    // Функция для открытия диалогового окна с контактами
    const handleShareMessage = () => {
        setLoading(true);  // Устанавливаем состояние загрузки
        setError(null); // Сбрасываем ошибку
        setSuccessMessage(null); // Сбрасываем сообщение успеха

        try {
            if (window.Telegram && window.Telegram.WebApp) {
                // Открываем диалоговое окно с предложением поделиться сообщением
                window.Telegram.WebApp.shareMessage(
                    'https://t.me/AbMindBot?start=share', // Ссылка, которой хотим поделиться
                    (isSent) => {
                        if (isSent) {
                            setSuccessMessage('Сообщение успешно отправлено!');
                        } else {
                            setError('Отправка отменена');
                        }
                        setLoading(false);
                    }
                );
            } else {
                setError('WebApp не доступен');
                setLoading(false);
            }
        } catch (err) {
            setError('Произошла ошибка при отправке: ' + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="share-message-container">
            <div className="message-content">
                <div className="share-button-wrapper">
                    {error && <div className="error-message">{error}</div>} {/* Отображение ошибки */}
                    {successMessage && <div className="success-message">{successMessage}</div>} {/* Отображение успеха */}

                    <CustomButton
                        label={loading ? 'Отправка...' : 'Переслать сообщение'}
                        onClick={handleShareMessage}
                        disabled={loading}  // Блокируем кнопку на время загрузки
                        icon="📨"
                        className="share-button"
                    />
                </div>
            </div>
        </div>
    );
};

export default ShareMessageButton;
