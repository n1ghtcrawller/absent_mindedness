import React, { useEffect, useRef, useContext } from 'react';
import { ReminderContext } from '../../components/ReminderContext/ReminderContext';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomDropdownInput from '../../components/CustomDropDownInput/CustomDropDownInput';
import './FriendReminder.css';
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";

const reminderOptions = ['5 минут', '10 минут', '15 минут', '30 минут', '1 час', '2 часа', '3 часа'];

const FriendReminder = () => {
    const { reminderData, setReminderData } = useContext(ReminderContext);
    const navigate = useNavigate();

    const {
        user, // текущий пользователь
        selectedFriend, // друг, которому создается напоминание
        reminderText,
        reminderDate,
        reminderTime,
        repeatCount,
        reminderBefore,
        comment,
        friendsList
    } = reminderData;

    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);

    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const webAppUser = window.Telegram.WebApp.initDataUnsafe?.user;
            // Устанавливаем текущего пользователя
            setReminderData(prev => ({ ...prev, user: webAppUser }));
        }
    }, [setReminderData]);

    useEffect(() => {
        const cachedFriends = JSON.parse(localStorage.getItem('friendsList')) || [];
        setReminderData(prev => ({ ...prev, friendsList: cachedFriends }));
    }, [setReminderData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Здесь вы можете добавить логику, если хотите сохранить выбранного друга
        if (selectedFriend && !friendsList.includes(selectedFriend)) {
            const updatedFriendsList = [...friendsList, selectedFriend];
            setReminderData(prev => ({ ...prev, friendsList: updatedFriendsList }));
            localStorage.setItem('friendsList', JSON.stringify(updatedFriendsList));
        }

        // Подготовка данных для отправки
        const reminderDetails = {
            creator: `${user?.first_name} ${user?.last_name || ''}`, // Полное имя создателя
            friend: selectedFriend,
            reminderText,
            reminderDate,
            reminderTime,
            repeatCount,
            reminderBefore,
            comment
        };

        setReminderData(prev => ({ ...prev, ...reminderDetails }));
        navigate('/confirm'); // Переход на страницу подтверждения
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
        <div className="friend-reminder-container">
            <BackButton />
            <h2>Создать напоминание для друга</h2>
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
                    <label>Выберите друга</label>
                    <CustomDropdownInput
                        options={friendsList}
                        value={selectedFriend}
                        onChange={(value) => setReminderData(prev => ({...prev, selectedFriend: value}))}
                        placeholder="Введите Имя или @user_id"
                    />
                </div>

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

export default FriendReminder;
