import { NavLink, useNavigate } from "react-router-dom";

import {
    FaTachometerAlt,
    FaBoxOpen,
    FaThLarge,
    FaTags,
    FaShoppingBag,
    FaUsers,
    FaChartBar,
    FaSignOutAlt
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        navigate("/login", { replace: true });
    };

    const menuItems = [

        {
            title: "Dashboard",
            path: "/admin/dashboard",
            icon: <FaTachometerAlt />
        },

        {
            title: "Products",
            path: "/admin/products",
            icon: <FaBoxOpen />
        },

        {
            title: "Categories",
            path: "/admin/categories",
            icon: <FaThLarge />
        },

        {
            title: "Brands",
            path: "/admin/brands",
            icon: <FaTags />
        },

        {
            title: "Orders",
            path: "/admin/orders",
            icon: <FaShoppingBag />
        },

        {
            title: "Users",
            path: "/admin/users",
            icon: <FaUsers />
        },

        {
            title: "Analytics",
            path: "/admin/analytics",
            icon: <FaChartBar />
        }

    ];

    return (

        <aside className="admin-sidebar">

            <div className="sidebar-logo">

                <h2>

                    BabyCareMart

                </h2>

                <span>

                    Admin Panel

                </span>

            </div>

            <nav className="sidebar-menu">

                {

                    menuItems.map((item) => (

                        <NavLink

                            key={item.title}

                            to={item.path}

                            className={({ isActive }) =>

                                isActive

                                    ? "sidebar-link active"

                                    : "sidebar-link"

                            }

                        >

                            <span className="sidebar-icon">

                                {item.icon}

                            </span>

                            <span>

                                {item.title}

                            </span>

                        </NavLink>

                    ))

                }

            </nav>

            <div className="sidebar-footer">

                <button

                    className="logout-btn"

                    onClick={handleLogout}

                >

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>

        </aside>

    );

}

export default Sidebar;