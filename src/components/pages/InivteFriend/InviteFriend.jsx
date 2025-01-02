import React, { useState } from 'react';
import './InviteFriend.css';
import Button from "../../components/Button/Button";
import axios from 'axios';

const InviteFriend = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSendInvite = async () => {
        setLoading(true);
        setError(null);

        try {
            const messageId = 'your_prepared_message_id';  // ID подготовленного сообщения

            Telegram.WebApp.shareMessage(messageId);



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
