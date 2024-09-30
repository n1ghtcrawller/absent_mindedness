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
                Сервис, который помогает от рассеянности,<br/>
                здесь вы можете создавать напоминания своим друзьям,<br/>
                настраивать переодичность этих напоминаний и управлять ими
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
