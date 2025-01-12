import React, { useState, useEffect } from 'react';
import './MyReminders.css';
import BackButton from '../../components/BackButton/BackButton';
import Button from '../../components/Button/Button';

const MyReminders = () => {
    const [reminders, setReminders] = useState([]);
    const [selectedReminder, setSelectedReminder] = useState(null);
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

    const handleDeleteReminder = async (reminderId) => {
        try {
            const response = await fetch('https://ab-mind.ru/api/delete_reminder', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: reminderId })
            });

            if (response.ok) {
                setReminders((prevReminders) => prevReminders.filter((reminder) => reminder.id !== reminderId));
            } else {
                console.error('Failed to delete reminder:', response.status);
            }
        } catch (error) {
            console.error('Error deleting reminder:', error);
        }
    };

    const toggleReminderDetails = (reminderId) => {
        setSelectedReminder((prevSelected) =>
            prevSelected === reminderId ? null : reminderId
        );
    };

    return (
        <div className="reminders-container">
            <BackButton />
            <h1 className="reminders-title">Мои Напоминания</h1>
            {reminders.length > 0 ? (
                <div className="reminders-list">
                    {reminders.map((reminder) => (
                        <div
                            key={reminder.id}
                            className={`reminder-block ${getRowClass(reminder.critically)}`}
                            onClick={() => toggleReminderDetails(reminder.id)}
                        >
                            <div className="reminder-summary">
                                <h3>{reminder.reminderText}</h3>
                                <p>{reminder.reminderDate} {reminder.reminderTime}</p>
                            </div>

                            {selectedReminder === reminder.id && (
                                <div className="reminder-details">
                                    <p><strong>Комментарий:</strong> {reminder.comment}</p>
                                    <p><strong>Критичность:</strong> {reminder.critically}</p>
                                    <Button
                                        label={"Выполнено"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteReminder(reminder.id);
                                        }}
                                    >
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-reminders">Напоминаний пока нет.</p>
            )}
        </div>
    );
};

export default MyReminders;