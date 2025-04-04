import React from 'react';
import CustomButton from '../../components/Button/CustomButton';
import './MainPage.css';
import {useNavigate} from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
const MainPage = () => {
    const navigate = useNavigate();
    const handleRemindSelf = () => {
        navigate('/self_reminder');
    };

    const handleRemindOthers = () => {
        navigate('/friend_reminder');
    };
    const handleMyReminders = () => {
        navigate('/my_reminders');
    }

    return (
        <div className="main-page-container">
            <BackButton />
            <div className="main-title">
                <h1>Выберите шаблон напоминания</h1>
            </div>
            <div className="description">
                Выберите, кому вы хотите создать напоминание — себе или другому пользователю в Telegram.
            </div>

            <div className="button-group">
                <CustomButton
                    label="Напомнить себе"
                    onClick={handleRemindSelf}
                    className="remind-button"
                    style={{ margin: '10px' }}
                />
            </div>
            <div className="button-group">
                <CustomButton
                    label="Напомнить другу"
                    onClick={handleRemindOthers}
                    className="remind-button"
                    style={{ margin: '10px' }}
                />
            </div>
            <div className="button-group">
                <CustomButton
                    label="Мои напоминания"
                    onClick={handleMyReminders}
                    className="remind-button"
                    style={{ margin: '10px' }}
                />
            </div>
        </div>
    );
};

export default MainPage;
