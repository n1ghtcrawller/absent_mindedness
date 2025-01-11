import React, {useEffect, useRef, useContext, useState} from 'react';
import { ReminderContext } from '../../components/ReminderContext/ReminderContext';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomDropdownInput from '../../components/CustomDropDownInput/CustomDropDownInput';
import './FriendReminder.css';
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";

const reminderOptions = ['5 минут', '10 минут', '15 минут', '30 минут', '1 час', '2 часа', '3 часа'];
const reminderCritical = ["Незначительный", "Низкий", "Средний", "Высокий", "Высший"]

const FriendReminder = () => {
    const { reminderData, setReminderData } = useContext(ReminderContext);
    const navigate = useNavigate();
    const handleInviteClick = () => {
        navigate('/invite_friend');
    };

    const {
        user,
        selectedFriend,
        reminderText,
        reminderDate,
        critically,
        reminderTime,
        repeatCount,
        reminderBefore,
        comment,
        friendsList
    } = reminderData;

    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const checkFormValidity = () => {
        if (
            reminderText &&
            reminderDate &&
            reminderTime &&
            critically &&
            repeatCount > 0
        ) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    };


    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const webAppUser = window.Telegram.WebApp.initDataUnsafe?.user;
            setReminderData(prev => ({ ...prev, user: webAppUser }));
        }
    }, [setReminderData]);

    useEffect(() => {
        const cachedFriends = JSON.parse(localStorage.getItem('friendsList')) || [];
        setReminderData(prev => ({ ...prev, friendsList: cachedFriends }));
    }, [setReminderData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedFriend && !friendsList.includes(selectedFriend)) {
            const updatedFriendsList = [...friendsList, selectedFriend];
            setReminderData(prev => ({ ...prev, friendsList: updatedFriendsList }));
            localStorage.setItem('friendsList', JSON.stringify(updatedFriendsList));
        }
        const reminderDetails = {
            creator: `${user?.first_name} ${user?.last_name || ''}`, // Полное имя создателя
            friend: selectedFriend,
            reminderText,
            reminderDate,
            reminderTime,
            critically,
            repeatCount,
            reminderBefore,
            comment
        };

        setReminderData(prev => ({ ...prev, ...reminderDetails }));
        navigate('/confirm');
    };

    const handleDateChange = (e) => {
        setReminderData(prev => ({ ...prev, reminderDate: e.target.value }));
        checkFormValidity();
    };

    const handleTimeChange = (e) => {
        setReminderData(prev => ({ ...prev, reminderTime: e.target.value }));
        checkFormValidity();
    };

    const handleReminderTextChange = (e) => {
        setReminderData(prev => ({ ...prev, reminderText: e.target.value }));
        checkFormValidity();
    };

    const handleCriticalChange = (e) => {
        setReminderData(prev => ({ ...prev, critically: e}));
        checkFormValidity();
    };

    const handleRepeatCountChange = (e) => {
        const inputValue = e.target.value;
        setReminderData(prev => ({ ...prev, repeatCount: Math.max(0, inputValue) }));
        checkFormValidity();
    };

    const handleCommentChange = (e) => {
        setReminderData(prev => ({ ...prev, comment: e.target.value }));
        checkFormValidity();
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
                        required
                    />
                    <p className="development-note" style={{fontSize: 'small', color: '#888'}}>
                        Если вашего друга нет в списке,{' '}
                        <span
                            onClick={handleInviteClick}
                            style={{color: '#007bff', textDecoration: 'underline', cursor: 'pointer'}}
                        >
                пригласите его!
            </span>
                    </p>
                </div>

                <div>
                    <label>О чём напомнить?</label>
                    <CustomInput
                        type="text"
                        value={reminderText}
                        onChange={handleReminderTextChange}
                        placeholder="Введите описание напоминания"
                        className="custom-input"
                        required
                    />
                </div>
                <div className={'critically'}>
                    <label>Критичность</label>
                    <CustomDropdownInput
                        options={reminderCritical}
                        value={critically}
                        onChange={handleCriticalChange}
                        placeholder="Насколько критично"
                        className="custom-date"
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
                            onChange={handleRepeatCountChange}
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
                        onChange={handleCommentChange}
                        placeholder="Введите комментарий (необязательно)"
                        className="custom-input-textarea"
                    />
                </div>

                <button type="submit" disabled={!isFormValid}>Создать напоминание</button>
            </form>
        </div>
    );
};

export default FriendReminder;
