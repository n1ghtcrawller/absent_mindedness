import React from 'react';
import './Button.css'
// Создаём функциональный компонент кнопки с передачей пропсов
const Button = ({ label, onClick, style, className, disabled }) => {
    return (
        <button
            onClick={onClick}
            style={style}
            className={className}
            disabled={disabled}
        >
            {label}
        </button>
    );
};


export default Button;
