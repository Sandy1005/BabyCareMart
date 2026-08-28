import { Link } from "react-router-dom";

import {

    FaUser,

    FaEnvelope,

    FaPhone,

    FaVenusMars,

    FaCalendarAlt,

    FaEdit,

    FaLock

} from "react-icons/fa";

import "./ProfileCard.css";

function ProfileCard({

    user

}){

    return(

        <div className="profile-card">

            {/*==========================================
                    PROFILE HEADER
            ==========================================*/}

            <div className="profile-card-header">

                <div className="profile-avatar-large">

                    {

                        user.name

                        ?

                        user.name.charAt(0).toUpperCase()

                        :

                        "U"

                    }

                </div>

                <div className="profile-user-info">

                    <h2>

                        {user.name}

                    </h2>

                    <p>

                        Welcome back to BabyCareMart

                    </p>

                </div>

            </div>

            {/*==========================================
                    PROFILE DETAILS
            ==========================================*/}

            <div className="profile-details">

                <div className="profile-detail">

                    <FaUser />

                    <div>

                        <span>

                            Full Name

                        </span>

                        <strong>

                            {user.name}

                        </strong>

                    </div>

                </div>

                <div className="profile-detail">

                    <FaEnvelope />

                    <div>

                        <span>

                            Email Address

                        </span>

                        <strong>

                            {user.email}

                        </strong>

                    </div>

                </div>

                <div className="profile-detail">

                    <FaPhone />

                    <div>

                        <span>

                            Phone Number

                        </span>

                        <strong>

                            {user.phone || "Not Added"}

                        </strong>

                    </div>

                </div>
                                <div className="profile-detail">

                    <FaVenusMars />

                    <div>

                        <span>

                            Gender

                        </span>

                        <strong>

                            {user.gender || "Not Specified"}

                        </strong>

                    </div>

                </div>

                <div className="profile-detail">

                    <FaCalendarAlt />

                    <div>

                        <span>

                            Date Of Birth

                        </span>

                        <strong>

                            {user.dateOfBirth || "Not Added"}

                        </strong>

                    </div>

                </div>

                <div className="profile-detail">

                    <FaCalendarAlt />

                    <div>

                        <span>

                            Member Since

                        </span>

                        <strong>

                            {

                                user.createdAt

                                ?

                                new Date(

                                    user.createdAt

                                ).toLocaleDateString()

                                :

                                "Recently Joined"

                            }

                        </strong>

                    </div>

                </div>

            </div>

            {/*==========================================
                    ACCOUNT STATUS
            ==========================================*/}

            <div className="account-status">

                <div className="status-card">

                    <h3>

                        Account Status

                    </h3>

                    <span className="status-badge active">

                        Active

                    </span>

                </div>

                <div className="status-card">

                    <h3>

                        Profile Completion

                    </h3>

                    <div className="progress-wrapper">

                        <div className="progress-bar">

                            <div

                                className="progress-fill"

                                style={{

                                    width:"85%"

                                }}

                            ></div>

                        </div>

                        <span>

                            85%

                        </span>

                    </div>

                </div>

            </div>

            {/*==========================================
                    ACTION BUTTONS
            ==========================================*/}

            <div className="profile-actions">

                <Link

                    to="/edit-profile"

                    className="edit-profile-btn"

                >

                    <FaEdit />

                    Edit Profile

                </Link>

                <Link

                    to="/change-password"

                    className="change-password-btn"

                >

                    <FaLock />

                    Change Password

                </Link>

            </div>
        </div>
    );
}
export default ProfileCard;