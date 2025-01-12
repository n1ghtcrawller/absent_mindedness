import React, { useEffect, useRef, useContext, useState } from 'react';
import { ReminderContext } from '../../components/ReminderContext/ReminderContext';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomDropdownInput from '../../components/CustomDropDownInput/CustomDropDownInput';
import './FriendReminder.css';
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";

const reminderOptions = ['5 минут', '10 минут', '15 минут', '30 минут', '1 час', '2 часа', '3 часа'];
const reminderCritical = ["Незначительный", "Низкий", "Средний", "Высокий", "Высший"];

const FriendReminder = () => {
    const { reminderData, setReminderData } = useContext(ReminderContext);
    const navigate = useNavigate();

    const [isFormValid, setIsFormValid] = useState(false);
    const dateInputRef = useRef(null);
    const timeInputRef = useRef(null);

    const {
        user,
        selectedFriend,
        reminderText,
        reminderDate,
        reminderTime,
        critically,
        repeatCount,
        reminderBefore,
        comment,
        friendsList = [], // Убедитесь, что friendsList инициализирован
    } = reminderData;

    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://ab-mind.ru/api/get_users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            const formattedData = data.map(user => ({
                id: user.user_id,
                displayName: `${user.first_name} ${user.last_name} (@${user.username})`, // Исправлено на правильный синтаксис
                username: user.username,
            }));

            // Обновляем friendsList в reminderData
            setReminderData(prev => ({ ...prev, friendsList: formattedData }));
            localStorage.setItem('friendsList', JSON.stringify(formattedData));
            setIsLoading(false);
            console.log("Загруженный список друзей:", formattedData); // Логируем загруженный список
        } catch (error) {
            console.error("Ошибка при получении пользователей:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(); // Вызываем fetchUsers при монтировании компонента
    }, []); // Пустой массив зависимостей, чтобы запустить только один раз

    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const webAppUser = window.Telegram.WebApp.initDataUnsafe?.user;
            setReminderData((prev) => ({ ...prev, user: webAppUser }));
        }
    }, [setReminderData]);

    useEffect(() => {
        setIsFormValid(
            !!reminderText &&
            !!reminderDate &&
            !!reminderTime &&
            !!critically &&
            repeatCount > 0
        );
    }, [reminderText, reminderDate, reminderTime, critically, repeatCount]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedFriend && !friendsList.some(friend => friend.id === selectedFriend.id)) { // Проверяем по id
            const updatedFriendsList = [...friendsList, selectedFriend];
            setReminderData((prev) => ({ ...prev, friendsList: updatedFriendsList }));
            localStorage.setItem('friendsList', JSON.stringify(updatedFriendsList));
        }

        const reminderDetails = {
            creator:` ${user?.first_name} ${user?.last_name || ''}`,
            friend: selectedFriend,
            reminderText,
            reminderDate,
            reminderTime,
            critically,
            repeatCount,
            reminderBefore,
            comment,
        };

        setReminderData((prev) => ({ ...prev, ...reminderDetails }));
        navigate('/confirm');
    };

    const handleInputChange = (field) => (value) => {
        setReminderData((prev) => ({ ...prev, [field]: value }));
    };

    const handleInviteClick = () => {
        navigate('/invite_friend');
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
                            <div>@{user.username}</div>
                        </div>
                    </div>
                )}

                <div>
                    <label>Выберите друга</label>
                    <CustomDropdownInput
                    options={friendsList}
                    onChange={(e) => handleInputChange('selectedFriend')(e)}
                    placeholder="Выберите друга"
                    />
                    <p className="development-note" style={{ fontSize: 'small', color: '#888' }}>
                        Если вашего друга нет в списке,{' '}
                        <span
                            onClick={handleInviteClick}
                            style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
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
                        onChange={(e) => handleInputChange('reminderText')(e.target.value)}
                        placeholder="Введите описание напоминания"
                        className="custom-input"
                        required
                    />
                </div>

                <div className="critically">
                    <label>Критичность</label>
                    <CustomDropdownInput
                        options={reminderCritical}
                        value={critically}
                        onChange={(value) => handleInputChange('critically')(value)}
                        placeholder="Насколько критично"
                        className="custom-date"
                    />
                </div>

                <div className="custom-date-container">
                    <span className="date-div">
                        <label>Когда событие?</label>
                        <CustomInput
                            ref={dateInputRef}
                            type="date"
                            value={reminderDate}
                            onChange={(e) => handleInputChange('reminderDate')(e.target.value)}
                            className="custom-date"
                            required
                        />
                    </span>
                    <span className="time-div">
                        <label>Во сколько?</label>
                        <CustomInput
                            ref={timeInputRef}
                            type="time"
                            value={reminderTime}
                            onChange={(e) => handleInputChange('reminderTime')(e.target.value)}
                            className="custom-time"
                            required
                        />
                    </span>
                </div>

                <div className="custom-date-container">
                    <span className="custom-count-container">
                        <label>За сколько напомнить?</label>
                        <CustomDropdownInput
                            options={reminderOptions}
                            value={reminderBefore}
                            placeholder="Выберите время"
                            className="custom-date"
                            isDisabled={true}
                        />
                    </span>

                    <span className="custom-count-container">
                        <label>Сколько раз напомнить?</label>
                        <CustomInput
                            type="number"
                            value={repeatCount}
                            onChange={(e) => handleInputChange('repeatCount')(Math.max(0, e.target.value))}
                            min="0"
                            className="custom-input"
                            required
                            isDisabled={true}
                        />
                    </span>
                </div>

                <p className="development-note" style={{ fontSize: 'small', color: '#888' }}>
                    Функция ещё в разработке. Бот по умолчанию отправляет три напоминания за 3 часа, за 1 час и за 30 минут.
                </p>

                <div>
                    <label>Комментарий</label>
                    <CustomInput
                        type="textarea"
                        value={comment}
                        onChange={(e) => handleInputChange('comment')(e.target.value)}
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
