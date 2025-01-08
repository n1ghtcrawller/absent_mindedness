import React, { useState, useEffect } from 'react';
import './MyReminders.css';

const MyReminders = () => {
    const [reminders, setReminders] = useState([]);
    const webAppUser = window.Telegram.WebApp.initDataUnsafe?.user;

    useEffect(() => {
        if (webAppUser) {
            const fetchReminders = async () => {
                try {
                    const response = await fetch(`https://ab-mind.ru/api/get_reminders/${webAppUser.id}`, {
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setReminders(data);
                    } else {
                        console.error('Failed to fetch reminders:', response.status);
                    }
                } catch (error) {
                    console.error('Error fetching reminders:', error);
                }
            };

            fetchReminders();
        }
    }, [webAppUser]);

    const getRowClass = (critically) => {
        switch (critically) {
            case 'Незначительный':
                return 'minor-row';
            case 'Низкий':
                return 'low-row';
            case 'Средний':
                return 'medium-row';
            case 'Высокий':
                return 'high-row';
            case 'Высший':
                return 'critical-row';
            default:
                return '';
        }
    };

    return (
        <div className="reminders-container">
            <h1 className="reminders-title">Мои Напоминания</h1>
            {reminders.length > 0 ? (
                <table className="reminders-table">
                    <thead>
                        <tr>
                            <th>Текст</th>
                            <th>Дата</th>
                            <th>Время</th>
                            <th>Комментарий</th>
                            <th>Критичность</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reminders.map(reminder => (
                            <tr key={reminder.id} className={getRowClass(reminder.critically)}>
                                <td>{reminder.reminderText}</td>
                                <td>{reminder.reminderDate}</td>
                                <td>{reminder.reminderTime}</td>
                                <td>{reminder.comment}</td>
                                <td>{reminder.critically}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-reminders">Напоминаний пока нет.</p>
            )}
        </div>
    );
};

export default MyReminders;