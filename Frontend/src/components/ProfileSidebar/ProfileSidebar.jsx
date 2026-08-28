import {

    FaUser,

    FaBoxOpen,

    FaHeart,

    FaMapMarkerAlt,

    FaLock,

    FaBell,

    FaSignOutAlt

} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import "./ProfileSidebar.css";

function ProfileSidebar(){

    const menuItems=[

        {

            title:"My Profile",

            path:"/profile",

            icon:<FaUser />

        },

        {

            title:"My Orders",

            path:"/orders",

            icon:<FaBoxOpen />

        },

        {

            title:"Wishlist",

            path:"/wishlist",

            icon:<FaHeart />

        },

        {

            title:"Saved Addresses",

            path:"/addresses",

            icon:<FaMapMarkerAlt />

        },

        {

            title:"Change Password",

            path:"/change-password",

            icon:<FaLock />

        },

        {

            title:"Notifications",

            path:"/notifications",

            icon:<FaBell />

        }

    ];
        /*==========================================
                LOGOUT
    ==========================================*/

    const handleLogout=()=>{

        localStorage.removeItem("user");

        window.location.href="/login";

    };

    return(

        <aside className="profile-sidebar">

            <h2>

                My Account

            </h2>

            {/*======================================
                    SIDEBAR MENU
            ======================================*/}

            <nav className="sidebar-menu">

                {

                    menuItems.map((item,index)=>(

                        <NavLink

                            key={index}

                            to={item.path}

                            className={({isActive})=>

                                isActive

                                ?

                                "sidebar-link active"

                                :

                                "sidebar-link"

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

            {/*======================================
                    LOGOUT BUTTON
            ======================================*/}

            <button

                className="logout-btn"

                onClick={handleLogout}

            >

                <FaSignOutAlt />

                Logout

            </button>
        </aside>
    );
}
export default ProfileSidebar;