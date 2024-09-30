// Импортируем React и компонент Button
import React from 'react';
import Button from '../../components/Button/Button';
import './StartPage.css';


const StartPage = () => {
    // Функция, которая будет срабатывать при клике на кнопку
    const handleButtonClick = () => {
        alert('Кнопка нажата!');
    };

    return (
        <div className={"StartPage"}>
            <div className="AbMind">AbMind</div>
            <div className="AdMindDescription"
                 style={{ marginTop: '20px', padding: '10px 20px' }} // Пример инлайн стиля
            >
                Сервис для управления вниманием и напоминаниями, который позволяет вам не только создавать индивидуализированные уведомления для себя и друзей, но и настраивать их по гибкой системе периодичности. Интуитивно понятный интерфейс и интеллектуальные алгоритмы помогут вам легко организовать свои задачи, а также оставаться на связи с близкими, чтобы никто не забыл о важном.
            </div>

            <Button
                label="Начать использовать"
                onClick={handleButtonClick}
                className="start-button" // Добавляем класс для стилизации кнопки
                style={{ marginTop: '20px', padding: '10px 20px' }} // Пример инлайн стиля
            />
        </div>
    );
};

export default StartPage;
