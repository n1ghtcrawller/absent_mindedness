import React, { useState } from 'react';
import './CustomDropDownInput.css';

const CustomDropdownInput = ({ options, value, onChange, placeholder, isDisabled = false }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (e) => {
        const input = e.target.value;
        setInputValue(input);
        setIsOpen(true);
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
        <span className="dropdown-container">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                onClick={() => !isDisabled && setIsOpen(!isOpen)} // Закрываем/открываем только если не отключен
                className="dropdown-input"
                disabled={isDisabled} // Устанавливаем атрибут disabled
                style={{
                    backgroundColor: isDisabled ? '#f0f0f0' : 'white',
                    color: isDisabled ? '#a0a0a0' : 'black',
                    cursor: isDisabled ? 'not-allowed' : 'auto'
                }}
            />
            {isOpen && filteredOptions.length > 0 && !isDisabled && ( // Показываем список только если не отключен
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
        </span>
    );
};

export default CustomDropdownInput;
