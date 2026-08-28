import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import api from "../../services/api";

import "../../styles/Customer/ChangePassword.css";

function ChangePassword() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);

    const [showNew, setShowNew] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);

    const [formData, setFormData] = useState({

        currentPassword: "",

        newPassword: "",

        confirmPassword: ""

    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value

        }));

    };

    const getStrength = () => {

        const password = formData.newPassword;

        if (!password) {

            return {
                text: "",
                width: "0%",
                className: ""
            };

        }

        let score = 0;

        if (password.length >= 8) score++;

        if (/[A-Z]/.test(password)) score++;

        if (/[a-z]/.test(password)) score++;

        if (/\d/.test(password)) score++;

        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) {

            return {

                text: "Weak",

                width: "33%",

                className: "weak"

            };

        }

        if (score <= 4) {

            return {

                text: "Medium",

                width: "66%",

                className: "medium"

            };

        }

        return {

            text: "Strong",

            width: "100%",

            className: "strong"

        };

    };

    const strength = getStrength();
        const validateForm = () => {

        if (!formData.currentPassword.trim()) {

            toast.error("Current password is required.");

            return false;

        }

        if (!formData.newPassword.trim()) {

            toast.error("New password is required.");

            return false;

        }

        if (formData.newPassword.length < 8) {

            toast.error("Password must be at least 8 characters.");

            return false;

        }

        if (!/[A-Z]/.test(formData.newPassword)) {

            toast.error("Password must contain one uppercase letter.");

            return false;

        }

        if (!/[a-z]/.test(formData.newPassword)) {

            toast.error("Password must contain one lowercase letter.");

            return false;

        }

        if (!/[0-9]/.test(formData.newPassword)) {

            toast.error("Password must contain one number.");

            return false;

        }

        if (formData.confirmPassword.trim() === "") {

            toast.error("Confirm password is required.");

            return false;

        }

        if (formData.newPassword !== formData.confirmPassword) {

            toast.error("Passwords do not match.");

            return false;

        }

        return true;

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) return;

        try {

            setLoading(true);

            const loggedUser = JSON.parse(

                localStorage.getItem("user")

            );

            if (!loggedUser) {

                toast.error("Please login again.");

                navigate("/login");

                return;

            }

            const response = await api.get(

                `/users/${loggedUser.id}`

            );

            const user = response.data;

            if (user.password !== formData.currentPassword) {

                toast.error("Current password is incorrect.");

                return;

            }

            if (user.password === formData.newPassword) {

                toast.error(

                    "New password must be different from the current password."

                );

                return;

            }

            const updatedUser = {

                ...user,

                password: formData.newPassword

            };

            await api.put(

                `/users/${loggedUser.id}`,

                updatedUser

            );

            localStorage.setItem(

                "user",

                JSON.stringify(updatedUser)

            );

            toast.success(

                "Password updated successfully."

            );

            setFormData({

                currentPassword: "",

                newPassword: "",

                confirmPassword: ""

            });

            navigate("/profile");

        }

        catch (error) {

            console.error(error);

            toast.error(

                "Unable to update password."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <>

            <Navbar />

            <section className="change-password-page">

                <div className="change-password-container">

                    <div className="change-password-header">

                        <h1>

                            Change Password

                        </h1>

                        <p>

                            Update your account password securely.

                        </p>

                    </div>

                    <div className="change-password-card">

                        <form

                            className="change-password-form"

                            onSubmit={handleSubmit}

                        >
                                                        {/* Current Password */}

                            <div className="form-group">

                                <label>Current Password</label>

                                <div className="password-field">

                                    <input

                                        type={showCurrent ? "text" : "password"}

                                        name="currentPassword"

                                        value={formData.currentPassword}

                                        onChange={handleChange}

                                        placeholder="Enter current password"

                                        disabled={loading}

                                    />

                                    <button

                                        type="button"

                                        className="toggle-password"

                                        onClick={() => setShowCurrent(!showCurrent)}

                                    >

                                        {showCurrent ? <FaEyeSlash /> : <FaEye />}

                                    </button>

                                </div>

                            </div>

                            {/* New Password */}

                            <div className="form-group">

                                <label>New Password</label>

                                <div className="password-field">

                                    <input

                                        type={showNew ? "text" : "password"}

                                        name="newPassword"

                                        value={formData.newPassword}

                                        onChange={handleChange}

                                        placeholder="Enter new password"

                                        disabled={loading}

                                    />

                                    <button

                                        type="button"

                                        className="toggle-password"

                                        onClick={() => setShowNew(!showNew)}

                                    >

                                        {showNew ? <FaEyeSlash /> : <FaEye />}

                                    </button>

                                </div>

                                {formData.newPassword && (

                                    <div className="password-strength">

                                        <div className="strength-track">

                                            <div

                                                className={`strength-fill ${strength.className}`}

                                                style={{ width: strength.width }}

                                            ></div>

                                        </div>

                                        <span className={`strength-text ${strength.className}`}>

                                            Password Strength : {strength.text}

                                        </span>

                                    </div>

                                )}

                                <div className="password-rules">

                                    <p>Password must contain:</p>

                                    <ul>

                                        <li>• Minimum 8 characters</li>

                                        <li>• One uppercase letter</li>

                                        <li>• One lowercase letter</li>

                                        <li>• One number</li>

                                        <li>• One special character (recommended)</li>

                                    </ul>

                                </div>

                            </div>

                            {/* Confirm Password */}

                            <div className="form-group">

                                <label>Confirm Password</label>

                                <div className="password-field">

                                    <input

                                        type={showConfirm ? "text" : "password"}

                                        name="confirmPassword"

                                        value={formData.confirmPassword}

                                        onChange={handleChange}

                                        placeholder="Confirm new password"

                                        disabled={loading}

                                    />

                                    <button

                                        type="button"

                                        className="toggle-password"

                                        onClick={() => setShowConfirm(!showConfirm)}

                                    >

                                        {showConfirm ? <FaEyeSlash /> : <FaEye />}

                                    </button>

                                </div>

                            </div>

                            <div className="form-actions">

                                <button

                                    type="button"

                                    className="cancel-btn"

                                    onClick={() => navigate("/profile")}

                                    disabled={loading}

                                >

                                    Cancel

                                </button>

                                <button

                                    type="submit"

                                    className="save-btn"

                                    disabled={loading}

                                >

                                    {loading ? "Updating..." : "Update Password"}

                                </button>

                            </div>
                                                    </form>

                    </div>

                </div>

            </section>

            <Footer />

        </>

    );

}

export default ChangePassword;