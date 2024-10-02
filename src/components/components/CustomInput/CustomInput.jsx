import React from 'react';

// Компонент CustomInput, который принимает различные пропсы для настройки
const CustomInput = ({ type, value, onChange, placeholder, className, style, disabled }) => {
    return (
        <div className={`custom-input`}>
            <input
                type={type}            // Тип инпута (например, text, number, email и т.д.)
                value={value}          // Значение инпута
                onChange={onChange}    // Функция, которая срабатывает при изменении значения
                placeholder={placeholder} // Текст подсказки внутри инпута
                className={className}  // Классы для стилизации
                style={style}          // Инлайн стили
                disabled={disabled}    // Возможность отключения инпута
            />
        </div>
    );
};

// Устанавливаем значения по умолчанию для пропсов
CustomInput.defaultProps = {
    type: 'text',              // По умолчанию тип инпута — текст
    value: '',                 // Пустое значение по умолчанию
    placeholder: 'Введите текст', // Подсказка по умолчанию
    onChange: () => {},        // Пустая функция изменения по умолчанию
    className: '',             // Пустая строка для классов по умолчанию
    style: {},                 // Пустой объект для инлайн стилей
    disabled: false            // Инпут активен по умолчанию
};

export default CustomInput;
