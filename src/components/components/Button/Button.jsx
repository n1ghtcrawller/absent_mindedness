import React from 'react';
import './Button.css'
// Создаём функциональный компонент кнопки с передачей пропсов
const Button = ({ label, onClick, style, className, disabled }) => {
    return (
        <button
            onClick={onClick} // Передаём функцию, которая будет срабатывать при клике
            style={style}      // Применяем стили, если они переданы
            className={className} // Класс для стилизации через CSS
            disabled={disabled}  // Возможность отключения кнопки
        >
            {label}
        </button>
    );
};


export default Button;
