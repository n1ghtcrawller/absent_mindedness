import React from 'react';
import './MyReminderButton.css'

const MyReminderButton = ({ label, onClick, style, className, disabled }) => {
    return (
        <button
            // type={type}
            onClick={onClick}
            style={style}
            className={className}
            disabled={disabled}
        >
            {label}
        </button>
    );
};


export default MyReminderButton;
