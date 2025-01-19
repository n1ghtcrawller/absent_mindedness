import React from 'react';
import './CustomButton.css'

const CustomButton = ({ label, onClick, style, className, disabled }) => {
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


export default CustomButton;
