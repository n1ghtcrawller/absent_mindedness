// context/ReminderContext.js
import React, { createContext, useState } from 'react';

export const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
    const [reminderData, setReminderData] = useState({
        user: '',
        selectedFriend: '',
        reminderText: '',
        reminderDate: '',
        reminderTime: '',
        repeatCount: 1,
        reminderBefore: '5 минут',
        comment: '',
        friendsList: []
    });

    return (
        <ReminderContext.Provider value={{ reminderData, setReminderData }}>
            {children}
        </ReminderContext.Provider>
    );
};
