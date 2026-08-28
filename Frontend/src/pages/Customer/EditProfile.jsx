import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import api from "../../services/api";

import "../../styles/Customer/EditProfile.css";

function EditProfile() {

    /*==========================================
                NAVIGATION
    ==========================================*/

    const navigate = useNavigate();

    /*==========================================
                    STATES
    ==========================================*/

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [userId, setUserId] = useState(null);

    const [formData, setFormData] = useState({

        name: "",

        email: "",

        phone: "",

        gender: "",

        dateOfBirth: ""

    });

    /*==========================================
                FETCH USER
    ==========================================*/

    useEffect(() => {

        fetchUser();

    }, []);

    const fetchUser = async () => {

        try {

            const loggedUser = JSON.parse(

                localStorage.getItem("user")

            );

            if (!loggedUser) {

                navigate("/login");

                return;

            }

            setUserId(loggedUser.id);

            const response = await api.get(

                `/users/${loggedUser.id}`

            );

            setFormData({

                name: response.data.name || "",

                email: response.data.email || "",

                phone: response.data.phone || "",

                gender: response.data.gender || "",

                dateOfBirth: response.data.dateOfBirth || ""

            });

        }

        catch (error) {

            console.log(error);

            toast.error("Unable to load profile.");

        }

        finally {

            setLoading(false);

        }

    };

    /*==========================================
                HANDLE INPUT
    ==========================================*/

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    };

    /*==========================================
                SAVE PROFILE
    ==========================================*/

    const handleSaveProfile = async (event) => {

        event.preventDefault();

        /*==========================
                NAME
        ==========================*/

        if (formData.name.trim() === "") {

            toast.error("Full Name is required.");

            return;

        }

        if (formData.name.trim().length < 3) {

            toast.error(

                "Name must contain at least 3 characters."

            );

            return;

        }

        /*==========================
                EMAIL
        ==========================*/

        const emailRegex =

            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (formData.email.trim() === "") {

            toast.error(

                "Email is required."

            );

            return;

        }

        if (!emailRegex.test(formData.email)) {

            toast.error(

                "Please enter a valid email."

            );

            return;

        }

        /*==========================
                PHONE
        ==========================*/

        const phoneRegex = /^[6-9]\d{9}$/;

        if (formData.phone.trim() === "") {

            toast.error(

                "Phone Number is required."

            );

            return;

        }

        if (!phoneRegex.test(formData.phone)) {

            toast.error(

                "Please enter a valid mobile number."

            );

            return;

        }
                /*==========================
                GENDER
        ==========================*/

        if (formData.gender === "") {

            toast.error(

                "Please select your gender."

            );

            return;

        }

        /*==========================
            DATE OF BIRTH
        ==========================*/

        if (formData.dateOfBirth === "") {

            toast.error(

                "Please select your Date of Birth."

            );

            return;

        }

        const today = new Date();

        const dob = new Date(formData.dateOfBirth);

        if (dob > today) {

            toast.error(

                "Date of Birth cannot be a future date."

            );

            return;

        }

        /*==========================
            UPDATE PROFILE
        ==========================*/

        try {

            setSaving(true);

            const response = await api.put(

                `/users/${userId}`,

                formData

            );

            const loggedUser = JSON.parse(

                localStorage.getItem("user")

            );

            localStorage.setItem(

                "user",

                JSON.stringify({

                    ...loggedUser,

                    ...response.data

                })

            );

            toast.success(

                "Profile updated successfully."

            );

            navigate("/profile");

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Failed to update profile."

            );

        }

        finally {

            setSaving(false);

        }

    };

    /*==========================================
                LOADING
    ==========================================*/

    if (loading) {

        return (

            <h2 className="loading-text">

                Loading Profile...

            </h2>

        );

    }

    return (

        <>

            <Navbar />

            <section className="edit-profile-page">

                {/*==========================================
                        PAGE HEADER
                ==========================================*/}

                <div className="edit-profile-header">

                    <h1>

                        Edit Profile

                    </h1>

                    <p>

                        Update your personal information.

                    </p>

                </div>

                {/*==========================================
                        PROFILE FORM
                ==========================================*/}

                <div className="edit-profile-card">

                    <form

                        className="edit-profile-form"

                        onSubmit={handleSaveProfile}

                    >

                        {/*==============================
                                FULL NAME
                        ==============================*/}

                        <div className="form-group">

                            <label>

                                Full Name

                            </label>

                            <input

                                type="text"

                                name="name"

                                value={formData.name}

                                onChange={handleChange}

                                disabled={saving}

                                placeholder="Enter your full name"

                            />

                        </div>

                        {/*==============================
                                EMAIL
                        ==============================*/}

                        <div className="form-group">

                            <label>

                                Email Address

                            </label>

                            <input

                                type="email"

                                name="email"

                                value={formData.email}

                                onChange={handleChange}

                                disabled={saving}

                                placeholder="Enter your email"

                            />

                        </div>

                        {/*==============================
                                PHONE
                        ==============================*/}

                        <div className="form-group">

                            <label>

                                Phone Number

                            </label>

                            <input

                                type="tel"

                                name="phone"

                                value={formData.phone}

                                onChange={handleChange}

                                disabled={saving}

                                placeholder="Enter phone number"

                            />

                        </div>

                        {/*==============================
                                GENDER
                        ==============================*/}

                        <div className="form-group">

                            <label>

                                Gender

                            </label>

                            <select

                                name="gender"

                                value={formData.gender}

                                onChange={handleChange}

                                disabled={saving}

                            >

                                <option value="">

                                    Select Gender

                                </option>

                                <option value="Male">

                                    Male

                                </option>

                                <option value="Female">

                                    Female

                                </option>

                                <option value="Other">

                                    Other

                                </option>

                            </select>

                        </div>

                        {/*==============================
                            DATE OF BIRTH
                        ==============================*/}

                        <div className="form-group">

                            <label>

                                Date Of Birth

                            </label>

                            <input

                                type="date"

                                name="dateOfBirth"

                                value={formData.dateOfBirth}

                                onChange={handleChange}

                                disabled={saving}

                            />

                        </div>
                                                {/*==========================================
                                ACTION BUTTONS
                        ==========================================*/}

                        <div className="form-actions">

                            <button

                                type="button"

                                className="cancel-btn"

                                disabled={saving}

                                onClick={() => navigate("/profile")}

                            >

                                Cancel

                            </button>

                            <button

                                type="submit"

                                className="save-btn"

                                disabled={saving}

                            >

                                {

                                    saving

                                    ?

                                    "Saving..."

                                    :

                                    "Save Changes"

                                }

                            </button>

                        </div>

                    </form>

                </div>

            </section>

            <Footer />

        </>

    );

}

export default EditProfile;