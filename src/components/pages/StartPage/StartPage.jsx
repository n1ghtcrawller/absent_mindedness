import React, { useEffect } from 'react';
import Button from '../../components/Button/Button';
import './StartPage.css';
import { useNavigate } from "react-router-dom";
import phone from '../../assets/phone.svg';

const StartPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.Telegram.WebApp.BackButton.hide();
    }, []);

    const handleButtonClick = () => {
        navigate('main_page');
    };

    return (
        <div className={"StartPage"}>
            <img src={phone} alt="phone" />
            <div className="AbMind">AbMind</div>
            <div className="AdMindDescription"
                 style={{ marginTop: '20px', padding: '10px 20px' }}
            >
                Сервис для управления вниманием и напоминаниями, который позволяет вам не только создавать индивидуализированные уведомления для себя и друзей, но и настраивать их по гибкой системе периодичности. Интуитивно понятный интерфейс и интеллектуальные алгоритмы помогут вам легко организовать свои задачи, а также оставаться на связи с близкими, чтобы никто не забыл о важном.
            </div>

            <Button
                label="Начать использовать"
                onClick={handleButtonClick}
                className="start-button"
                style={{ marginTop: '20px', padding: '10px 20px' }}
            />
        </div>
    );
};

export default StartPage;