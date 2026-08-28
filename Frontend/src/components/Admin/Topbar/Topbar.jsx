import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";

function Topbar() {

    const admin = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    

    return (

        <header className="admin-topbar">

            <div className="topbar-left">

                <h2>

                    Welcome,

                    {" "}

                    {admin?.name || "Admin"}

                    👋

                </h2>

                <p>

                    {today}

                </p>

            </div>

            <div className="topbar-center">

                <div className="search-box">

                    <FaSearch />

                    <input

                        type="text"

                        placeholder="Search products, orders, users..."

                    />

                </div>

            </div>

            <div className="topbar-right">

            <button
                    className="notification-btn"
                    onClick={() => navigate("/admin/notifications")}
                >

                    <FaBell />

                    <span className="notification-badge">

                        3

                    </span>

                </button>

                <div
                    className="admin-profile"
                    onClick={() => navigate("/admin/profile")}
                    style={{ cursor: "pointer" }}
                >

                    <FaUserCircle />

                    <div>

                        <h4>

                            {admin?.name || "Admin"}

                        </h4>

                        <span>

                            Administrator

                        </span>

                    </div>

                </div>

            </div>

        </header>

    );

}

export default Topbar;