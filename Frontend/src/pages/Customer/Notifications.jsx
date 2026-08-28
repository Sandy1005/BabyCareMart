import { useEffect, useState } from "react";

import {
    FaBell,
    FaCheckCircle,
    FaTrash,
    FaInbox
} from "react-icons/fa";

import { toast } from "react-toastify";

import api from "../../services/api";

import "../../styles/Customer/Notifications.css";

function Notifications() {

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadNotifications();

    }, []);

    const loadNotifications = async () => {

        try {

            const response = await api.get("/notifications");

            const userNotifications = response.data.filter(

                notification =>

                    notification.userId === currentUser?.id

            );

            userNotifications.sort(

                (a, b) => b.id - a.id

            );

            setNotifications(userNotifications);

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Unable to load notifications."

            );

        }

        finally {

            setLoading(false);

        }

    };

    const markAsRead = async (notification) => {

        try {

            await api.patch(

                `/notifications/${notification.id}`,

                {

                    read: true

                }

            );

            loadNotifications();

        }

        catch (error) {

            console.log(error);

        }

    };

    const deleteNotification = async (id) => {

        try {

            await api.delete(

                `/notifications/${id}`

            );

            toast.success(

                "Notification deleted."

            );

            loadNotifications();

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Unable to delete notification."

            );

        }

    };

    const clearAllNotifications = async () => {

        if (

            !window.confirm(

                "Delete all notifications?"

            )

        ) {

            return;

        }

        try {

            for (const item of notifications) {

                await api.delete(

                    `/notifications/${item.id}`

                );

            }

            toast.success(

                "All notifications cleared."

            );

            loadNotifications();

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Unable to clear notifications."

            );

        }

    };

    const markAllAsRead = async () => {

        try {

            for (const item of notifications) {

                if (!item.read) {

                    await api.patch(

                        `/notifications/${item.id}`,

                        {

                            read: true

                        }

                    );

                }

            }

            loadNotifications();

        }

        catch (error) {

            console.log(error);

        }

    };

    if (loading) {

        return (

            <div className="notifications-page">

                <h2>

                    Loading Notifications...

                </h2>

            </div>

        );

    }

    return (

        <div className="notifications-page">

            <div className="notifications-header">

                <div>

                    <h2>

                        Notifications

                    </h2>

                    <p>

                        Stay updated with your orders and account activities.

                    </p>

                </div>

                <div className="notification-actions">

                    <button

                        className="mark-all-btn"

                        onClick={markAllAsRead}

                    >

                        <FaCheckCircle />

                        Mark All Read

                    </button>

                    <button

                        className="clear-all-btn"

                        onClick={clearAllNotifications}

                    >

                        <FaTrash />

                        Clear All

                    </button>

                </div>

            </div>
                        {

                notifications.length === 0 ? (

                    <div className="empty-notifications">

                        <FaInbox />

                        <h3>

                            No Notifications

                        </h3>

                        <p>

                            You're all caught up! New notifications will appear here.

                        </p>

                    </div>

                ) : (

                    <div className="notification-list">

                        {

                            notifications.map((notification) => (

                                <div

                                    key={notification.id}

                                    className={`notification-card ${notification.read ? "read" : "unread"}`}

                                >

                                    <div className="notification-left">

                                        <div className="notification-icon">

                                            <FaBell />

                                        </div>

                                        <div className="notification-content">

                                            <div className="notification-title">

                                                <h4>

                                                    {notification.title}

                                                </h4>

                                                {

                                                    !notification.read && (

                                                        <span className="unread-badge">

                                                            New

                                                        </span>

                                                    )

                                                }

                                            </div>

                                            <p>

                                                {notification.message}

                                            </p>

                                            <span className="notification-time">

                                                {notification.time}

                                            </span>

                                        </div>

                                    </div>

                                    <div className="notification-right">

                                        {

                                            !notification.read && (

                                                <button

                                                    className="read-btn"

                                                    onClick={() =>

                                                        markAsRead(notification)

                                                    }

                                                >

                                                    <FaCheckCircle />

                                                    Mark Read

                                                </button>

                                            )

                                        }

                                        <button

                                            className="delete-btn"

                                            onClick={() =>

                                                deleteNotification(notification.id)

                                            }

                                        >

                                            <FaTrash />

                                            Delete

                                        </button>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }
        </div>

    );

}

export default Notifications;