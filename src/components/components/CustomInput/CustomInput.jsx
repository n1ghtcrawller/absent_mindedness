import React, { forwardRef } from 'react';

const CustomInput = forwardRef(({ type, value, onChange, placeholder, className }, ref) => {
    return (
        <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
        />
    );
});

export default CustomInput;
