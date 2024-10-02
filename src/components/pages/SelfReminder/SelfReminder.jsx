import React, { useEffect, useState } from 'react';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomDropdownInput from '../../components/CustomDropDownInput/CustomDropDownInput'
import './SelfReminder.css';

const reminderOptions = ['5 минут', '10 минут', '15 минут', '30 минут', '1 час', '2 часа', '3 часа'];

const SelfReminder = () => {
    const [user, setUser] = useState(null);
    const [reminderText, setReminderText] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [repeatCount, setRepeatCount] = useState(1);
    const [reminderBefore, setReminderBefore] = useState('5 минут');
    const [comment, setComment] = useState('');

    // Получение данных пользователя
    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const webAppUser = window.Telegram.WebApp.initDataUnsafe?.user;
            setUser(webAppUser);
        }
    }, []);

    // Обработка отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            reminderText,
            eventDate,
            reminderTime,
            repeatCount,
            reminderBefore,
            comment
        });
    };

    return (
        <div className="self-reminder-container">
            {/* Контейнер пользователя */}
            <h2>Создать напоминание себе</h2>
            <form onSubmit={handleSubmit}>
                {user && (
                    <div className="user-info-container">
                        <img
                            src={user.photo_url || 'default-avatar.png'}
                            alt="User Avatar"
                            className="user-avatar"
                        />
                        <div className="user-details">
                            <h3>{user.first_name} {user.last_name || ''}</h3>
                            <div>
                                @{user.username}
                            </div>
                        </div>
                    </div>
                )}
                <div>
                    <label>О чём напомнить?</label>
                    <CustomInput
                        type="text"
                        value={reminderText}
                        onChange={(e) => setReminderText(e.target.value)}
                        placeholder="Введите описание напоминания"
                        className="custom-input"
                        required
                    />
                </div>

                <div>
                    <label>Когда событие?</label>
                    <CustomInput
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="custom-input"
                        required
                    />
                </div>

                <div>
                    <label>Во сколько напомнить?</label>
                    <CustomInput
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="custom-input"
                        required
                    />
                </div>

                <div>
                    <label>За сколько напомнить?</label>
                    <CustomDropdownInput
                        options={reminderOptions}
                        value={reminderBefore}
                        onChange={(value) => setReminderBefore(value)}
                        placeholder="Введите или выберите время"
                    />
                </div>

                <div>
                    <label>Сколько раз напомнить?</label>
                    <CustomInput
                        type="number"
                        value={repeatCount}
                        onChange={(e) => setRepeatCount(e.target.value)}
                        min="1"
                        className="custom-input"
                        required
                    />
                </div>

                <div>
                    <label>Комментарий</label>
                    <CustomInput
                        type="textarea"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Введите комментарий (необязательно)"
                        className="custom-input-textarea"
                    />
                </div>

                <button type="submit">Создать напоминание</button>
            </form>
        </div>
    );
};

export default SelfReminder;
