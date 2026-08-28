import { useEffect, useState } from "react";

import {
    FaEye,
    FaTrash,
    FaSearch,
    FaUserCheck,
    FaUserSlash
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import api from "../../services/api";

import "../../styles/Admin/Users.css";

function Users() {

    /* ==========================================
                STATES
    ========================================== */

    const [users, setUsers] = useState([]);

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [roleFilter, setRoleFilter] = useState("All");

    const [selectedUser, setSelectedUser] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /* ==========================================
                LOAD DATA
    ========================================== */

    useEffect(() => {

        fetchData();

    }, []);

    const fetchData = async () => {

        try {

            const [

                usersRes,

                ordersRes

            ] = await Promise.all([

                api.get("/users"),

                api.get("/orders")

            ]);

            setUsers(usersRes.data);

            setOrders(ordersRes.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    /* ==========================================
                SEARCH + FILTER
    ========================================== */

    const filteredUsers = users.filter((user) => {

        const matchesSearch =

            user.name

                ?.toLowerCase()

                .includes(search.toLowerCase())

            ||

            user.email

                ?.toLowerCase()

                .includes(search.toLowerCase());

        const matchesRole =

            roleFilter === "All"

                ?

                true

                :

                user.role === roleFilter;

        return matchesSearch && matchesRole;

    });

    /* ==========================================
            USER ORDER COUNT
    ========================================== */

    const getOrderCount = (user) => {

        return orders.filter(

            (order) =>

                order.email === user.email

        ).length;

    };

    /* ==========================================
            USER TOTAL SPENDING
    ========================================== */

    const getTotalSpent = (user) => {

        return orders

            .filter(

                (order) =>

                    order.email === user.email

            )

            .reduce(

                (sum, order) =>

                    sum + Number(order.total),

                0

            );

    };

    /* ==========================================
            BLOCK / UNBLOCK USER
    ========================================== */

    const toggleUserStatus = async (user) => {

        try {

            await api.put(

                `/users/${user.id}`,

                {

                    ...user,

                    isActive:

                        !user.isActive

                }

            );

            fetchData();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                VIEW USER
    ========================================== */

    const openViewModal = (user) => {

        setSelectedUser(user);

        setShowViewModal(true);

    };

    const closeViewModal = () => {

        setSelectedUser(null);

        setShowViewModal(false);

    };

    /* ==========================================
                DELETE USER
    ========================================== */

    const openDeleteModal = (user) => {

        setSelectedUser(user);

        setShowDeleteModal(true);

    };

    const closeDeleteModal = () => {

        setSelectedUser(null);

        setShowDeleteModal(false);

    };

    const deleteUser = async () => {

        if (!selectedUser) return;

        try {

            await api.delete(

                `/users/${selectedUser.id}`

            );

            closeDeleteModal();

            fetchData();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                    LOADING
    ========================================== */

    if (loading) {

        return (

            <h2 className="loading-text">

                Loading Users...

            </h2>

        );

    }
        /* ==========================================
                    RETURN UI
    ========================================== */

    return (

        <AdminLayout>

            {/* ==========================================
                    PAGE HEADER
            ========================================== */}

            <div className="page-header">

                <div>

                    <h1>

                        User Management

                    </h1>

                    <p>

                        Manage customers and administrators.

                    </p>

                </div>

            </div>

            {/* ==========================================
                    TOOLBAR
            ========================================== */}

            <div className="users-toolbar">

                <div className="search-box">

                    <FaSearch />

                    <input

                        type="text"

                        placeholder="Search users..."

                        value={search}

                        onChange={(e)=>setSearch(e.target.value)}

                    />

                </div>

                <select

                    className="role-filter"

                    value={roleFilter}

                    onChange={(e)=>setRoleFilter(e.target.value)}

                >

                    <option value="All">

                        All Roles

                    </option>

                    <option value="admin">

                        Admin

                    </option>

                    <option value="user">

                        User

                    </option>

                </select>

            </div>

            {/* ==========================================
                    USERS TABLE
            ========================================== */}

            <div className="table-container">

                <table className="users-table">

                    <thead>

                        <tr>

                            <th>

                                Name

                            </th>

                            <th>

                                Email

                            </th>

                            <th>

                                Phone

                            </th>

                            <th>

                                Role

                            </th>

                            <th>

                                Status

                            </th>

                            <th>

                                Orders

                            </th>

                            <th>

                                Total Spent

                            </th>

                            <th>

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredUsers.length===0

                            ?

                            (

                                <tr>

                                    <td

                                        colSpan="8"

                                        className="no-data"

                                    >

                                        No Users Found

                                    </td>

                                </tr>

                            )

                            :

                            (

                                filteredUsers.map((user)=>(

                                    <tr

                                        key={user.id}

                                    >

                                        <td>

                                            <div className="user-name">

                                                <h4>

                                                    {user.name}

                                                </h4>

                                            </div>

                                        </td>

                                        <td>

                                            {user.email}

                                        </td>

                                        <td>

                                            {user.phone}

                                        </td>

                                        <td>

                                            <span

                                                className={

                                                    user.role==="admin"

                                                    ?

                                                    "role-admin"

                                                    :

                                                    "role-user"

                                                }

                                            >

                                                {

                                                    user.role

                                                }

                                            </span>

                                        </td>

                                        <td>

                                            <span

                                                className={

                                                    user.isActive===false

                                                    ?

                                                    "blocked"

                                                    :

                                                    "active"

                                                }

                                            >

                                                {

                                                    user.isActive===false

                                                    ?

                                                    "Blocked"

                                                    :

                                                    "Active"

                                                }

                                            </span>

                                        </td>

                                        <td>

                                            {

                                                getOrderCount(user)

                                            }

                                        </td>

                                        <td>

                                            ₹

                                            {

                                                getTotalSpent(user)

                                                .toLocaleString()

                                            }

                                        </td>

                                        <td>

                                            <div

                                                className="action-buttons"

                                            >

                                                <button

                                                    className="view-btn"

                                                    onClick={()=>

                                                        openViewModal(user)

                                                    }

                                                >

                                                    <FaEye />

                                                </button>

                                                <button

                                                    className={

                                                        user.isActive===false

                                                        ?

                                                        "activate-btn"

                                                        :

                                                        "block-btn"

                                                    }

                                                    onClick={()=>

                                                        toggleUserStatus(user)

                                                    }

                                                >

                                                    {

                                                        user.isActive===false

                                                        ?

                                                        <FaUserCheck/>

                                                        :

                                                        <FaUserSlash/>

                                                    }

                                                </button>

                                                <button

                                                    className="delete-btn"

                                                    onClick={()=>

                                                        openDeleteModal(user)

                                                    }

                                                >

                                                    <FaTrash/>

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )

                        }

                    </tbody>

                </table>

            </div>
                        {/* ==========================================
                    VIEW USER MODAL
            ========================================== */}

            {

                showViewModal && selectedUser && (

                    <div className="modal-overlay">

                        <div className="user-modal">

                            <div className="modal-header">

                                <h2>

                                    User Details

                                </h2>

                                <button

                                    className="close-btn"

                                    onClick={closeViewModal}

                                >

                                    ✕

                                </button>

                            </div>

                            <div className="modal-body">

                                <div className="user-profile">

                                    <div className="user-avatar">

                                        {

                                            selectedUser.name

                                                ?.charAt(0)

                                                .toUpperCase()

                                        }

                                    </div>

                                    <h3>

                                        {selectedUser.name}

                                    </h3>

                                    <span>

                                        {

                                            selectedUser.role

                                        }

                                    </span>

                                </div>

                                <div className="user-info">

                                    <div className="info-item">

                                        <strong>

                                            User ID

                                        </strong>

                                        <p>

                                            {selectedUser.id}

                                        </p>

                                    </div>

                                    <div className="info-item">

                                        <strong>

                                            Email

                                        </strong>

                                        <p>

                                            {selectedUser.email}

                                        </p>

                                    </div>

                                    <div className="info-item">

                                        <strong>

                                            Phone

                                        </strong>

                                        <p>

                                            {selectedUser.phone}

                                        </p>

                                    </div>

                                    <div className="info-item">

                                        <strong>

                                            Role

                                        </strong>

                                        <p>

                                            {selectedUser.role}

                                        </p>

                                    </div>

                                    <div className="info-item">

                                        <strong>

                                            Status

                                        </strong>

                                        <p>

                                            {

                                                selectedUser.isActive === false

                                                    ?

                                                    "Blocked"

                                                    :

                                                    "Active"

                                            }

                                        </p>

                                    </div>

                                    <div className="info-item">

                                        <strong>

                                            Total Orders

                                        </strong>

                                        <p>

                                            {

                                                getOrderCount(selectedUser)

                                            }

                                        </p>

                                    </div>

                                    <div className="info-item">

                                        <strong>

                                            Total Spending

                                        </strong>

                                        <p>

                                            ₹

                                            {

                                                getTotalSpent(selectedUser)

                                                .toLocaleString()

                                            }

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                )

            }

            {/* ==========================================
                    DELETE USER MODAL
            ========================================== */}

            {

                showDeleteModal && (

                    <div className="modal-overlay">

                        <div className="delete-modal">

                            <h2>

                                Delete User

                            </h2>

                            <p>

                                Are you sure you want to delete

                                <strong>

                                    {" "}

                                    {selectedUser?.name}

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

                                    onClick={deleteUser}

                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    </div>

                )

            }

        </AdminLayout>

    );

}

export default Users;