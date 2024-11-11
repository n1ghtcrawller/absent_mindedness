import React, { useEffect, useContext, useRef } from 'react';
import { ReminderContext } from '../../components/ReminderContext/ReminderContext';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomDropdownInput from '../../components/CustomDropDownInput/CustomDropDownInput';
import { useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import './SelfReminder.css';
import BackButton from "../../components/BackButton/BackButton";

const reminderOptions = ['5 минут', '10 минут', '15 минут', '30 минут', '1 час', '2 часа', '3 часа'];

const SelfReminder = () => {
    const { reminderData, setReminderData } = useContext(ReminderContext);
    const navigate = useNavigate();

    const {
        user,
        reminderText,
        reminderDate,
        reminderTime,
        repeatCount,
        reminderBefore,
        comment,
    } = reminderData;

    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);

    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const webAppUser = window.Telegram.WebApp.initDataUnsafe?.user;
            console.log("User photo URL:", webAppUser?.photo_url);
            // Set user information and selectedFriend
            setReminderData(prev => ({
                ...prev,
                user: webAppUser || null, // Set user info or null
                selectedFriend: webAppUser ? webAppUser.username : null, // Set selectedFriend to username or null
            }));
        }
    }, [setReminderData]);

    // Обработка отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        const reminderDetails = {
            creator: `${user?.first_name} ${user?.last_name || ''}`, // Полное имя создателя
            friend: `${user?.first_name} ${user?.last_name || ''}`,
            reminderText,
            reminderDate,
            reminderTime,
            repeatCount,
            reminderBefore,
            comment
        };

        setReminderData(prev => ({ ...prev, ...reminderDetails }));
        navigate('/confirm');
    };

    const handleDateChange = (e) => {
        console.log("Выбор даты:", e.target.value);
        setReminderData(prev => ({ ...prev, reminderDate: e.target.value }));
    };

    const handleTimeChange = (e) => {
        console.log("Выбор времени:", e.target.value);
        setReminderData(prev => ({ ...prev, reminderTime: e.target.value }));
    };

    const handleDateClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.focus();
        }
    };

    const handleTimeClick = () => {
        if (timeInputRef.current) {
            timeInputRef.current.focus();
        }
    };

    return (
        <div className="self-reminder-container">
            <BackButton />
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
                        onChange={(e) => setReminderData(prev => ({...prev, reminderText: e.target.value}))}
                        placeholder="Введите описание напоминания"
                        className="custom-input"
                        required
                    />
                </div>

                <div className="custom-date-container">
                    <span className={'date-div'}>
                        <label>Когда событие?</label>
                        <CustomInput
                            ref={dateInputRef}
                            type="date"
                            value={reminderDate}
                            onChange={handleDateChange}
                            className="custom-date"
                            required
                            placeholder={"Выберите дату"}
                            onClick={handleDateClick}
                        />
                    </span>
                    <span className={'time-div'}>
                        <label>Во сколько?</label>
                        <CustomInput
                            ref={timeInputRef}
                            type="time"
                            value={reminderTime}
                            onChange={handleTimeChange}
                            className="custom-time"
                            required
                            placeholder={"Выберите время"}
                            onClick={handleTimeClick}
                        />
                    </span>
                </div>

                <div className={'custom-date-container'}>
                    <span className={'custom-count-container'}>
                        <label>За сколько напомнить?</label>
                        <CustomDropdownInput
                            options={reminderOptions}
                            value={reminderBefore}
                            onChange={(value) => setReminderData(prev => ({...prev, reminderBefore: value}))}
                            placeholder="Выберите время"
                            className="custom-date"
                            isDisabled={true}

                        />
                    </span>

                    <span className={'custom-count-container'}>
                        <label>Сколько раз напомнить?</label>
                        <CustomInput
                            type="number"
                            value={repeatCount}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                setReminderData(prev => ({...prev, repeatCount: Math.max(0, inputValue)}));
                            }}
                            min="0"
                            className="custom-input"
                            required
                            isDisabled={true}
                        />
                    </span>
                </div>
                <p className="development-note" style={{fontSize: 'small', color: '#888'}}>
                    Функция ещё в разработке. Бот по умолчанию отправляет три напоминания за 3 часа, за 1 час и за 30
                    минут.
                </p>
                <div>
                    <label>Комментарий</label>
                    <CustomInput
                        type="textarea"
                        value={comment}
                        onChange={(e) => setReminderData(prev => ({...prev, comment: e.target.value}))}
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
