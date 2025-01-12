import React, { useState } from 'react';
import './InviteFriend.css';
import Button from "../../components/Button/Button";
import BackButton from '../../components/BackButton/BackButton';

const InviteFriend = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSendInvite = async () => {
        setError(null); // Сброс ошибки перед новой попыткой
        setSuccessMessage(null); // Сброс успешного сообщения перед новой попыткой
        setLoading(true); // Включение индикатора загрузки

        try {
            const messageId = 'your_prepared_message_id'; // Укажите реальный ID сообщения

            // Вызов метода shareMessage
            Telegram.WebApp.shareMessage(
                messageId,
                (isSent) => {
                    if (isSent) {
                        setSuccessMessage('Сообщение успешно отправлено!'); // Успешное уведомление
                    } else {
                        setError('Не удалось отправить сообщение. Попробуйте еще раз.'); // Сообщение об ошибке
                    }
                }
            );
        } catch (error) {
            setError('Произошла ошибка: ' + error.message); // Отображение ошибки
        } finally {
            setLoading(false); // Выключение индикатора загрузки
        }
    };

    return (
        <div className="invite-friend-container">
            <BackButton/>
            {error && <div className="error-message">{error}</div>} {/* Блок отображения ошибок */}
            {successMessage && <div className="success-message">{successMessage}</div>} {/* Блок успешного сообщения */}
            <Button
                label={loading ? 'Отправка...' : 'Пригласить'}
                onClick={handleSendInvite}
                disabled={loading}
            />
        </div>
    );
};

export default InviteFriend;
