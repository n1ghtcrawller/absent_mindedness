import React, { useState, useEffect } from 'react';
import './CustomDropDownInput.css';

const CustomDropdownInput = ({ 
    options = [], 
    value, 
    onChange, 
    placeholder = "", 
    isDisabled = false 
}) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (typeof value === 'string') {
            setInputValue(value);
        } else if (value && typeof value === 'object' && value.label) {
            setInputValue(value.label);
        }
    }, [value]);

    useEffect(() => {
        const formattedOptions = options.map((option) => {
            if (typeof option === 'string') {
                return { label: option, value: option };
            } else if (typeof option === 'object' && option.first_name && option.last_name && option.username) {
                return { 
                    label: `${option.first_name} ${option.last_name} (@${option.username})`, 
                    value: option 
                };
            }
            return null; // Игнорируем неподходящие элементы
        }).filter(Boolean);

        const filtered = formattedOptions.filter((opt) => 
            opt.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [options, inputValue]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setIsOpen(true);
    };

    const handleOptionClick = (option) => {
        setInputValue(option.label); // Отображаем label
        onChange(option.value); // Передаем value в родительский компонент
        setIsOpen(false);
    };

    return (
        <div className="dropdown-container">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                onClick={() => !isDisabled && setIsOpen(!isOpen)}
                className="dropdown-input"
                disabled={isDisabled}
                style={{
                    backgroundColor: isDisabled ? '#f0f0f0' : 'white',
                    color: isDisabled ? '#a0a0a0' : 'black',
                    cursor: isDisabled ? 'not-allowed' : 'auto',
                }}
            />
            {isOpen && filteredOptions.length > 0 && !isDisabled && (
                <ul className="dropdown-list">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="dropdown-item"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomDropdownInput;
