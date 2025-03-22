import React, { useState } from 'react';
import './InviteFriend.css';
import CustomButton from '../../components/Button/CustomButton';

const ShareMessageButton = () => {
    const [loading, setLoading] = useState(false);  // Состояние загрузки
    const [error, setError] = useState(null);  // Состояние ошибки
    const [successMessage, setSuccessMessage] = useState(null);  // Состояние успеха
    const [logs, setLogs] = useState([]);  // Состояние для логов

    // Функция для открытия диалогового окна с контактами
    const handleShareMessage = () => {
        setLoading(true);  // Устанавливаем состояние загрузки
        setError(null); // Сбрасываем ошибку
        setSuccessMessage(null); // Сбрасываем сообщение успеха

        // Добавляем лог о начале процесса
        setLogs((prevLogs) => [...prevLogs, 'Начало отправки сообщения...']);

        try {
            if (window.Telegram && window.Telegram.WebApp) {
                // Открываем диалоговое окно с предложением поделиться сообщением
                window.Telegram.WebApp.shareMessage(
                    'https://t.me/AbMindBot?start=share', // Ссылка, которой хотим поделиться
                    (isSent) => {
                        if (isSent) {
                            setSuccessMessage('Сообщение успешно отправлено!');
                            setLogs((prevLogs) => [...prevLogs, 'Сообщение успешно отправлено!']); // Лог успеха
                        } else {
                            setError('Отправка отменена');
                            setLogs((prevLogs) => [...prevLogs, 'Отправка была отменена.']); // Лог отмены
                        }
                        setLoading(false);
                    }
                );
            } else {
                setError('WebApp не доступен');
                setLogs((prevLogs) => [...prevLogs, 'WebApp не доступен']); // Лог ошибки
                setLoading(false);
            }
        } catch (err) {
            setError('Произошла ошибка при отправке: ' + err.message);
            setLogs((prevLogs) => [...prevLogs, 'Ошибка: ' + err.message]); // Лог ошибки
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

                {/* Выводим логи на экран */}
                <div className="logs-container">
                    <h3>Логи:</h3>
                    <ul>
                        {logs.map((log, index) => (
                            <li key={index}>{log}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ShareMessageButton;
