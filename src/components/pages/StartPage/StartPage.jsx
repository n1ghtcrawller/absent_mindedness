import React, { useEffect, useState } from 'react';
import CustomButton from '../../components/Button/CustomButton';
import './StartPage.css';
import { useNavigate } from "react-router-dom";
import phone from '../../assets/phone.svg';

const StartPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        window.Telegram.WebApp.BackButton.hide();

        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            const userInfo = {
                first_name: user.first_name,
                last_name: user.last_name,
                user_id: user.id,
                username: user.username,
                photo_url: user.photo_url,
                balance: 0
            };
            setUserData(userInfo);

            (async () => {
                try {
                    const response = await fetch('https://ab-mind.ru/api/add_user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userInfo),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    console.log('Success:', data);
                } catch (error) {
                    console.error('Error:', error);
                }
            })();
        }
    }, []);

    const handleButtonClick = () => {
        // Навигация на главную страницу
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

            <CustomButton
                label="Начать использовать"
                onClick={handleButtonClick}
                className="start-button"
                style={{ marginTop: '20px', padding: '10px 20px' }}
            />
        </div>
    );
};

export default StartPage;
