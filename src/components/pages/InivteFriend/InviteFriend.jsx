import React, { useState } from 'react';
import './InviteFriend.css';
import Button from "../../components/Button/Button";
import axios from 'axios';

const InviteFriend = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSendInvite = async () => {
        setError(null);
        setStatus(useState(false))

        try {
            const messageId = 'your_prepared_message_id';

            import React, { useState } from 'react';
            import './InviteFriend.css';
            import Button from "../../components/Button/Button";

            const InviteFriend = () => {
                const [loading, setLoading] = useState(false);
                const [error, setError] = useState(null);

                const handleSendInvite = () => {
                    setLoading(true);
                    setError(null);

                    try {
                        const messageId = 'your_prepared_message_id';  // ID подготовленного сообщения

                        // Вызов метода shareMessage из Telegram Web App SDK
                        Telegram.WebApp.shareMessage(
                            messageId,
                            (isSent) => {
                                if (isSent) {
                                    console.log('Message shared successfully!');
                                    alert('Приглашение отправлено!');
                                } else {
                                    throw new Error('Ошибка отправки приглашения');
                                }
                            }
                        );
                    } catch (error) {
                        setError(error.message);
                        console.error('Error sending invite:', error);
                        alert('Произошла ошибка при отправке приглашения');
                    } finally {
                        setLoading(false);
                    }
                };

                return (
                    <div className="invite-friend-container">
                        {error && <div className="error-message">{error}</div>}
                        <Button
                            label={loading ? 'Отправка...' : 'Пригласить'}
                            onClick={handleSendInvite}
                            disabled={loading}
                        />
                    </div>
                );
            };

            export default InviteFriend;


        } catch (error) {
            setError(error.message);
            console.error('Error sending invite:', error);
            alert('Произошла ошибка при отправке приглашения');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="invite-friend-container">
            {error && <div className="error-message">{error}</div>}
            <Button
                label={loading ? 'Отправка...' : 'Пригласить'}
                onClick={handleSendInvite}
                disabled={loading}
            />
        </div>
    );
};

export default InviteFriend;
