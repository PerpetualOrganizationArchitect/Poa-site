import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotificationContext = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Function to add a notification and return the notification id
    const addNotification = (message, status) => {
        console.log("notif", message, status);
        const id = Date.now();

        setNotifications(prev => [...prev, { id, message, status }]);

        return id; // Return the id of the notification so it can be referenced later
    };

    // Function to update the status of an existing notification (e.g., from loading to success/error)
    const updateNotification = (id, newMessage = null, newStatus) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, status: newStatus, message: newMessage || notif.message } : notif
            )
        );

        // Automatically remove success notifications after 6 seconds
        if (newStatus === 'success') {
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
        <NotificationContext.Provider value={{ notifications, addNotification, updateNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
