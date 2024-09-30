// NotificationContext.js
import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotificationContext = () => {
    return useContext(NotificationContext);
}

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, status) => {
        console.log("notif", message, status);
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, status }]);

        // Remove notification after 6 seconds if successful or loading
        if (status === 'success' || status === 'loading') {
            setTimeout(() => {
                setNotifications(prev => prev.filter(notif => notif.id !== id));
            }, 6000);
        }
    };

    const removeNotification = (id) => {
        console.log("notif remove", id);
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}
