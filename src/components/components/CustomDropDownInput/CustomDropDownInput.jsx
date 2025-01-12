import React, { useState } from 'react';
import './CustomDropDownInput.css';

const CustomDropdownInput = ({ options = [], value, onChange, placeholder, isDisabled = false }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (e) => {
        const input = e.target.value;
        setInputValue(input);
        setIsOpen(true);
        setFilteredOptions(
            options.filter((option) => {
                // Предполагаем, что option — это объект с полем displayName
                if (typeof option === 'object' && option.displayName) {
                    return option.displayName.toLowerCase().includes(input.toLowerCase());
                }
                return false; // Если не строка и нет поля displayName, не включаем в результаты
            })
        );
        onChange(input); // Обновление значения в основном компоненте
    };

    const handleOptionClick = (option) => {
        setInputValue(option.displayName); // Используем displayName для отображения
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
                onClick={() => !isDisabled && setIsOpen(!isDisabled)} // Закрываем/открываем только если не отключен
                className="dropdown-input"
                disabled={isDisabled} // Устанавливаем атрибут disabled
                style={{
                    backgroundColor: isDisabled ? '#f0f0f0' : 'white',
                    color: isDisabled ? '#a0a0a0' : 'black',
                    cursor: isDisabled ? 'not-allowed' : 'auto',
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
                            {option.displayName} {/* Отображаем displayName */}
                        </li>
                    ))}
                </ul>
            )}
        </span>
    );
};

export default CustomDropdownInput;