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

// Устанавливаем значения по умолчанию для пропсов
Button.defaultProps = {
    label: 'Кнопка',   // Текст по умолчанию
    onClick: () => {}, // Пустая функция по умолчанию
    style: {},         // Пустой объект для стилей
    className: '',     // Пустая строка для классов
    disabled: false    // Кнопка активна по умолчанию
};

export default Button;