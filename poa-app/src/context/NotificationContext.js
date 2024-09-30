// NotificationContext.js
import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotificationContext = () => {
    return useContext(NotificationContext);
}

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, status) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, status }]);

        // Remove notification after 6 seconds if successful
        if (status === 'success') {
            setTimeout(() => {
                setNotifications(prev => prev.filter(notif => notif.id !== id));
            }, 6000);
        }
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}
