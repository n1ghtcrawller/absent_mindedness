import React, { useState } from 'react';
import './CustomDropDownInput.css'

const CustomDropdownInput = ({ options, value, onChange, placeholder }) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [isOpen, setIsOpen] = useState(false);

    // Обработка ввода в инпут
    const handleInputChange = (e) => {
        const input = e.target.value;
        setInputValue(input);
        setIsOpen(true);
        // Фильтрация вариантов на основе введенного текста
        setFilteredOptions(
            options.filter((option) =>
                option.toLowerCase().includes(input.toLowerCase())
            )
        );
        onChange(input); // Обновление значения в основном компоненте
    };

    // Обработка выбора элемента из выпадающего списка
    const handleOptionClick = (option) => {
        setInputValue(option);
        onChange(option); // Устанавливаем выбранное значение
        setIsOpen(false); // Закрываем список
    };

    return (
        <div className="dropdown-container">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                onClick={() => setIsOpen(!isOpen)}
                className="dropdown-input"
            />
            {isOpen && filteredOptions.length > 0 && (
                <ul className="dropdown-list">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="dropdown-item"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomDropdownInput;
