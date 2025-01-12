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
                if (typeof option === 'string') {
                    return option.toLowerCase().includes(input.toLowerCase());
                } else if (typeof option === 'object' && option.first_name && option.last_name && option.username) {
                    return `${option.first_name} ${option.last_name} (${option.username})`;
                }
                return false;
            })
        );
        onChange(input);
    };


    const handleOptionClick = (option) => {
        setInputValue(option);
        onChange(option);
        setIsOpen(false);
    };

    return (
        <span className="dropdown-container">
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
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </span>
    );
};

export default CustomDropdownInput;