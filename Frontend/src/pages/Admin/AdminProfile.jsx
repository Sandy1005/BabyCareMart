import { useEffect, useMemo, useState } from "react";

import {
    FaUserCircle,
    FaEnvelope,
    FaPhone,
    FaUserShield,
    FaEdit,
    FaSave,
    FaEye,
    FaEyeSlash,
    FaBoxOpen,
    FaShoppingCart,
    FaUsers,
    FaRupeeSign,
    FaLock
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import api from "../../services/api";

import "../../styles/Admin/AdminProfile.css";

function AdminProfile() {

    /* ==========================================
                    STATES
    ========================================== */

    const [admin, setAdmin] = useState(null);

    const [products, setProducts] = useState([]);

    const [orders, setOrders] = useState([]);

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({

        name: "",

        email: "",

        phone: "",

        password: "",

        confirmPassword: ""

    });

    /* ==========================================
                    LOAD PROFILE
    ========================================== */

    useEffect(() => {

        fetchProfile();

    }, []);

    const fetchProfile = async () => {

        try {

            const [

                usersRes,

                productsRes,

                ordersRes

            ] = await Promise.all([

                api.get("/users"),

                api.get("/products"),

                api.get("/orders")

            ]);

            const adminUser = usersRes.data.find(

                user => user.role === "admin"

            );

            setAdmin(adminUser);

            setUsers(usersRes.data);

            setProducts(productsRes.data);

            setOrders(ordersRes.data);

            if (adminUser) {

                setFormData({

                    name: adminUser.name || "",

                    email: adminUser.email || "",

                    phone: adminUser.phone || "",

                    password: "",

                    confirmPassword: ""

                });

            }

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    /* ==========================================
                    STATISTICS
    ========================================== */

    const totalProducts = products.length;

    const totalOrders = orders.length;

    const totalCustomers = users.filter(

        user => user.role === "user"

    ).length;

    const totalRevenue = useMemo(() => {

        return orders.reduce(

            (sum, order) =>

                sum + Number(order.total || 0),

            0

        );

    }, [orders]);

    /* ==========================================
                    FORM
    ========================================== */

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    /* ==========================================
                    SAVE PROFILE
    ========================================== */

    const saveProfile = async () => {

        if (

            formData.password !== "" &&

            formData.password !== formData.confirmPassword

        ) {

            alert("Passwords do not match.");

            return;

        }

        try {

            const updatedAdmin = {

                ...admin,

                name: formData.name,

                email: formData.email,

                phone: formData.phone

            };

            if (formData.password !== "") {

                updatedAdmin.password = formData.password;

            }

            await api.put(

                `/users/${admin.id}`,

                updatedAdmin

            );

            alert("Profile Updated Successfully");

            setEditing(false);

            fetchProfile();

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

            <div className="admin-loading">

                Loading Profile...

            </div>

        );

    }

    /* ==========================================
                    PAGE START
    ========================================== */

    return (

            <AdminLayout>

                <div className="admin-profile-page">

                    <div className="profile-header">

                        <div>

                            <h1>

                                Administrator Profile

                            </h1>

                            <p>

                                Manage your profile and account settings.

                            </p>

                        </div>

                        {

                            editing ?

                            (

                                <button

                                    className="save-profile-btn"

                                    onClick={saveProfile}

                                >

                                    <FaSave />

                                    Save Changes

                                </button>

                            )

                            :

                            (

                                <button

                                    className="edit-profile-btn"

                                    onClick={() =>

                                        setEditing(true)

                                    }

                                >

                                    <FaEdit />

                                    Edit Profile

                                </button>

                            )

                        }

                    </div>

                    {/* ==========================================
                            DASHBOARD STATS
                    ========================================== */}

                    <div className="profile-stats">

                        <div className="stat-card">

                            <FaBoxOpen />

                            <div>

                                <h2>{totalProducts}</h2>

                                <p>Products</p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaShoppingCart />

                            <div>

                                <h2>{totalOrders}</h2>

                                <p>Orders</p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaUsers />

                            <div>

                                <h2>{totalCustomers}</h2>

                                <p>Customers</p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaRupeeSign />

                            <div>

                                <h2>

                                    ₹{totalRevenue.toLocaleString()}

                                </h2>

                                <p>Total Revenue</p>

                            </div>

                        </div>

                    </div>
                                        {/* ==========================================
                            PROFILE CONTENT
                    ========================================== */}

                    <div className="profile-content">

                        {/* ======================================
                                PROFILE CARD
                        ====================================== */}

                        <div className="profile-card">

                            <div className="profile-avatar">

                                <FaUserCircle />

                            </div>

                            <h2>

                                {admin?.name}

                            </h2>

                            <span className="role-badge">

                                Administrator

                            </span>

                            <div className="profile-status">

                                <span className="status-indicator"></span>

                                Active Account

                            </div>

                        </div>

                        {/* ======================================
                                PROFILE FORM
                        ====================================== */}

                        <div className="profile-form-card">

                            <h2>

                                Personal Information

                            </h2>

                            <div className="profile-form">

                                {/* NAME */}

                                <div className="form-group">

                                    <label>

                                        <FaUserCircle />

                                        Full Name

                                    </label>

                                    <input

                                        type="text"

                                        name="name"

                                        value={formData.name}

                                        onChange={handleChange}

                                        disabled={!editing}

                                    />

                                </div>

                                {/* EMAIL */}

                                <div className="form-group">

                                    <label>

                                        <FaEnvelope />

                                        Email Address

                                    </label>

                                    <input

                                        type="email"

                                        name="email"

                                        value={formData.email}

                                        onChange={handleChange}

                                        disabled={!editing}

                                    />

                                </div>

                                {/* PHONE */}

                                <div className="form-group">

                                    <label>

                                        <FaPhone />

                                        Phone Number

                                    </label>

                                    <input

                                        type="text"

                                        name="phone"

                                        value={formData.phone}

                                        onChange={handleChange}

                                        disabled={!editing}

                                    />

                                </div>

                                {/* ROLE */}

                                <div className="form-group">

                                    <label>

                                        <FaUserShield />

                                        Role

                                    </label>

                                    <input

                                        type="text"

                                        value="Administrator"

                                        disabled

                                    />

                                </div>

                            </div>

                            {/* ======================================
                                    SECURITY
                            ====================================== */}

                            <h2 className="section-title">

                                Security

                            </h2>

                            <div className="profile-form">

                                {/* PASSWORD */}

                                <div className="form-group">

                                    <label>

                                        <FaLock />

                                        New Password

                                    </label>

                                    <div className="password-box">

                                        <input

                                            type={

                                                showPassword

                                                    ? "text"

                                                    : "password"

                                            }

                                            name="password"

                                            value={formData.password}

                                            onChange={handleChange}

                                            disabled={!editing}

                                            placeholder="Enter New Password"

                                        />

                                        {

                                            editing && (

                                                <button

                                                    type="button"

                                                    className="password-toggle"

                                                    onClick={() =>

                                                        setShowPassword(

                                                            !showPassword

                                                        )

                                                    }

                                                >

                                                    {

                                                        showPassword

                                                            ?

                                                            <FaEyeSlash />

                                                            :

                                                            <FaEye />

                                                    }

                                                </button>

                                            )

                                        }

                                    </div>

                                </div>

                                {/* CONFIRM PASSWORD */}

                                <div className="form-group">

                                    <label>

                                        <FaLock />

                                        Confirm Password

                                    </label>

                                    <div className="password-box">

                                        <input

                                            type={

                                                showConfirmPassword

                                                    ? "text"

                                                    : "password"

                                            }

                                            name="confirmPassword"

                                            value={formData.confirmPassword}

                                            onChange={handleChange}

                                            disabled={!editing}

                                            placeholder="Confirm Password"

                                        />

                                        {

                                            editing && (

                                                <button

                                                    type="button"

                                                    className="password-toggle"

                                                    onClick={() =>

                                                        setShowConfirmPassword(

                                                            !showConfirmPassword

                                                        )

                                                    }

                                                >

                                                    {

                                                        showConfirmPassword

                                                            ?

                                                            <FaEyeSlash />

                                                            :

                                                            <FaEye />

                                                    }

                                                </button>

                                            )

                                        }

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                                        {/* ==========================================
                            ACCOUNT SUMMARY
                    ========================================== */}

                    <div className="account-summary">

                        <div className="summary-card">

                            <h3>

                                Account Information

                            </h3>

                            <div className="summary-item">

                                <span>User ID</span>

                                <strong>{admin?.id}</strong>

                            </div>

                            <div className="summary-item">

                                <span>Role</span>

                                <strong>Administrator</strong>

                            </div>

                            <div className="summary-item">

                                <span>Email</span>

                                <strong>{admin?.email}</strong>

                            </div>

                            <div className="summary-item">

                                <span>Phone</span>

                                <strong>{admin?.phone}</strong>

                            </div>

                            <div className="summary-item">

                                <span>Status</span>

                                <strong className="active-text">

                                    Active

                                </strong>

                            </div>

                        </div>

                        <div className="summary-card">

                            <h3>

                                Dashboard Summary

                            </h3>

                            <div className="summary-item">

                                <span>Total Products</span>

                                <strong>{totalProducts}</strong>

                            </div>

                            <div className="summary-item">

                                <span>Total Orders</span>

                                <strong>{totalOrders}</strong>

                            </div>

                            <div className="summary-item">

                                <span>Total Customers</span>

                                <strong>{totalCustomers}</strong>

                            </div>

                            <div className="summary-item">

                                <span>Total Revenue</span>

                                <strong>

                                    ₹{totalRevenue.toLocaleString()}

                                </strong>

                            </div>

                        </div>

                    </div>

                    {/* ==========================================
                            QUICK ACTIONS
                    ========================================== */}

                    <div className="quick-actions">

                        <button

                            className="action-btn"

                            onClick={() => setEditing(true)}

                        >

                            <FaEdit />

                            Edit Profile

                        </button>

                        <button

                            className="action-btn"

                            onClick={fetchProfile}

                        >

                            Refresh Profile

                        </button>

                    </div>

                </div>
        </AdminLayout>
    );

}

export default AdminProfile;