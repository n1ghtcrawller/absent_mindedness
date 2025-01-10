// context/ReminderContext.js
import React, { createContext, useState } from 'react';

export const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
    const [reminderData, setReminderData] = useState({
        user: null,
        selectedFriend: null,
        reminderText: '',
        reminderDate: '',
        reminderTime: '',
        repeatCount: 3,
        reminderBefore: '30 минут',
        comment: '',
    });

    return (
        <ReminderContext.Provider value={{ reminderData, setReminderData }}>
            {children}
        </ReminderContext.Provider>
    );
};
