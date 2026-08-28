import { useEffect, useState } from "react";
import {
    FaPlus,
    FaTrash,
    FaBell,
    FaTimes,
    FaSearch
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import api from "../../services/api";

import "../../styles/Admin/Notifications.css";

function Notifications() {

    const initialNotification = {

        title: "",

        message: "",

        type: "General",

        date: new Date().toISOString().split("T")[0]

    };

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedNotification, setSelectedNotification] = useState(null);

    const [formData, setFormData] = useState(initialNotification);

    useEffect(() => {

        fetchNotifications();

    }, []);

    const fetchNotifications = async () => {

        try {

            const response = await api.get("/notifications");

            setNotifications(response.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    const filteredNotifications = notifications.filter(

        (notification) =>

            notification.title

                ?.toLowerCase()

                .includes(search.toLowerCase())

    );

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const openAddModal = () => {

        setFormData(initialNotification);

        setShowAddModal(true);

    };

    const closeAddModal = () => {

        setShowAddModal(false);

    };

    const handleAddNotification = async () => {

        if (!formData.title || !formData.message) {

            alert("Please fill all fields");

            return;

        }

        try {

            await api.post("/notifications", formData);

            closeAddModal();

            fetchNotifications();

        }

        catch (error) {

            console.log(error);

        }

    };

    const openDeleteModal = (notification) => {

        setSelectedNotification(notification);

        setShowDeleteModal(true);

    };

    const closeDeleteModal = () => {

        setSelectedNotification(null);

        setShowDeleteModal(false);

    };

    const deleteNotification = async () => {

        if (!selectedNotification) return;

        try {

            await api.delete(

                `/notifications/${selectedNotification.id}`

            );

            closeDeleteModal();

            fetchNotifications();

        }

        catch (error) {

            console.log(error);

        }

    };

    if (loading) {

        return (

            <h2 className="loading-text">

                Loading Notifications...

            </h2>

        );

    }

    return (

            <AdminLayout>

                <div className="admin-page">

                    <div className="page-header">

                        <div>

                            <h1>

                                Notifications

                            </h1>

                            <p>

                                Manage notifications for customers.

                            </p>

                        </div>

                        <button

                            className="add-btn"

                            onClick={openAddModal}

                        >

                            <FaPlus />

                            Send Notification

                        </button>

                    </div>

                    <div className="search-box">

                        <FaSearch />

                        <input

                            type="text"

                            placeholder="Search notification..."

                            value={search}

                            onChange={(e)=>setSearch(e.target.value)}

                        />

                    </div>

                    <div className="table-container">

                        <table className="notification-table">

                            <thead>

                                <tr>

                                    <th>Title</th>

                                    <th>Message</th>

                                    <th>Type</th>

                                    <th>Date</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    filteredNotifications.length===0

                                    ?

                                    (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="no-data"
                                            >

                                                No Notifications Found

                                            </td>

                                        </tr>

                                    )

                                    :

                                    (

                                        filteredNotifications.map((item)=>(

                                            <tr key={item.id}>

                                                <td>{item.title}</td>

                                                <td>{item.message}</td>

                                                <td>

                                                    <span className="type-badge">

                                                        <FaBell />

                                                        {item.type}

                                                    </span>

                                                </td>

                                                <td>{item.date}</td>

                                                <td>

                                                    <button

                                                        className="delete-btn"

                                                        onClick={()=>

                                                            openDeleteModal(item)

                                                        }

                                                    >

                                                        <FaTrash />

                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    )

                                }

                            </tbody>

                        </table>

                    </div>

                    {

                        showAddModal && (

                            <div className="modal-overlay">

                                <div className="notification-modal">

                                    <div className="modal-header">

                                        <h2>

                                            Send Notification

                                        </h2>

                                        <button

                                            className="close-btn"

                                            onClick={closeAddModal}

                                        >

                                            <FaTimes />

                                        </button>

                                    </div>

                                    <div className="modal-body">

                                        <input

                                            type="text"

                                            name="title"

                                            placeholder="Title"

                                            value={formData.title}

                                            onChange={handleChange}

                                        />

                                        <textarea

                                            rows="5"

                                            name="message"

                                            placeholder="Notification Message"

                                            value={formData.message}

                                            onChange={handleChange}

                                        />

                                        <select

                                            name="type"

                                            value={formData.type}

                                            onChange={handleChange}

                                        >

                                            <option>General</option>

                                            <option>Offer</option>

                                            <option>Order</option>

                                            <option>System</option>

                                        </select>

                                        <button

                                            className="save-btn"

                                            onClick={handleAddNotification}

                                        >

                                            Send Notification

                                        </button>

                                    </div>

                                </div>

                            </div>

                        )

                    }

                    {

                        showDeleteModal && (

                            <div className="modal-overlay">

                                <div className="delete-modal">

                                    <h2>

                                        Delete Notification

                                    </h2>

                                    <p>

                                        Are you sure you want to delete

                                        <strong>

                                            {" "}

                                            {selectedNotification?.title}

                                        </strong>

                                        ?

                                    </p>

                                    <div className="modal-actions">

                                        <button

                                            className="cancel-btn"

                                            onClick={closeDeleteModal}

                                        >

                                            Cancel

                                        </button>

                                        <button

                                            className="delete-btn"

                                            onClick={deleteNotification}

                                        >

                                            Delete

                                        </button>

                                    </div>

                                </div>

                            </div>

                        )

                    }

                </div>
            
            </AdminLayout>
    );

}

export default Notifications;