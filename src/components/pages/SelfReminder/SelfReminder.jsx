import React, { useEffect, useState, useRef } from 'react';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomDropdownInput from '../../components/CustomDropDownInput/CustomDropDownInput';
import "react-datepicker/dist/react-datepicker.css";
import './SelfReminder.css';

const reminderOptions = ['5 минут', '10 минут', '15 минут', '30 минут', '1 час', '2 часа', '3 часа'];

const SelfReminder = () => {
    const [user, setUser] = useState('');
    const [reminderText, setReminderText] = useState('');
    const [reminderDate, setReminderDate] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [repeatCount, setRepeatCount] = useState(1);
    const [reminderBefore, setReminderBefore] = useState('5 минут');
    const [comment, setComment] = useState('');

    // Используем useRef для доступа к элементам даты и времени
    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);

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
            eventDate: reminderDate,
            reminderTime,
            repeatCount,
            reminderBefore,
            comment
        });
    };

    // Функции для фокусировки на полях ввода даты и времени
    const handleDateClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.focus(); // Фокусируемся на поле даты
        }
    };

    const handleTimeClick = () => {
        if (timeInputRef.current) {
            timeInputRef.current.focus(); // Фокусируемся на поле времени
        }
    };

    return (
        <div className="self-reminder-container">
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

                {/* Контейнер для даты */}
                <div onClick={handleDateClick} className="custom-date-container">
                    <label>Когда событие?</label>
                    <CustomInput
                        ref={dateInputRef} // Привязываем useRef к input даты
                        type="date"
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="custom-date"
                        required
                        placeholder={"Выберите дату"}
                    />
                </div>

                {/* Контейнер для времени */}
                <div onClick={handleTimeClick} className="custom-time-container">
                    <label>Во сколько напомнить?</label>
                    <CustomInput
                        ref={timeInputRef} // Привязываем useRef к input времени
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="custom-time"
                        required
                        placeholder={"Выберите время"}
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
                        onChange={(e) => {
                            const inputValue = e.target.value; // Получаем текущее значение ввода

                            // Если поле пустое, устанавливаем значение как пустую строку
                            if (inputValue === '') {
                                setRepeatCount('');
                            } else {
                                const newValue = Math.max(0, inputValue); // Убедитесь, что значение неотрицательное
                                setRepeatCount(newValue);
                            }
                        }}
                        min="0" // Убедитесь, что минимальное значение 0
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
