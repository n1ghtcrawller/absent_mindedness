import React, { forwardRef } from 'react';

const CustomInput = forwardRef(({ type, value, onChange, placeholder, className, isDisabled = false }, ref) => {
    return (
        <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            disabled={isDisabled} // Устанавливаем состояние доступности
            style={{
                backgroundColor: isDisabled ? '#f0f0f0' : 'white', // Серый цвет, если недоступен
                color: isDisabled ? '#a0a0a0' : 'black', // Серый цвет текста, если недоступен
                cursor: isDisabled ? 'not-allowed' : 'auto' // Изменение курсора
            }}
        />
    );
});

export default CustomInput;
