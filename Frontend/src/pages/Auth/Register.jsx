import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {

    FaBaby,

    FaUser,

    FaPhone,

    FaEnvelope,

    FaLock,

    FaEye,

    FaEyeSlash,

    FaGoogle,

    FaVenusMars,

    FaUsers,

    FaBoxOpen,

    FaTruck,

    FaShieldAlt

} from "react-icons/fa";

import api from "../../services/api";

import "../../styles/Auth/Register.css";

import logo from "../../assets/logo/logo.png";

function Register() {

    const navigate = useNavigate();

    const [

        showPassword,

        setShowPassword

    ] = useState(false);

    const [

        showConfirmPassword,

        setShowConfirmPassword

    ] = useState(false);

    const [

        acceptTerms,

        setAcceptTerms

    ] = useState(false);

    const [

        message,

        setMessage

    ] = useState("");

    const [

        errors,

        setErrors

    ] = useState({});

    const [

        formData,

        setFormData

    ] = useState({

        name:"",

        gender:"",

        phone:"",

        email:"",

        password:"",

        confirmPassword:""

    });

    /*==========================================
                HANDLE CHANGE
    ==========================================*/

    const handleChange=(event)=>{

        const{

            name,

            value

        }=event.target;

        setFormData({

            ...formData,

            [name]:value

        });

    };

    /*==========================================
                VALIDATION
    ==========================================*/

    const validate=()=>{

        const validationErrors={};

        if(!formData.name.trim()){

            validationErrors.name=

                "Full Name is required.";

        }

        if(!formData.gender){

            validationErrors.gender=

                "Please select gender.";

        }

        if(!/^[0-9]{10}$/.test(formData.phone)){

            validationErrors.phone=

                "Enter a valid 10 digit phone number.";

        }

        if(!formData.email.trim()){

            validationErrors.email=

                "Email is required.";

        }

        if(formData.password.length<6){

            validationErrors.password=

                "Password must contain at least 6 characters.";

        }

        if(

            formData.confirmPassword!==

            formData.password

        ){

            validationErrors.confirmPassword=

                "Passwords do not match.";

        }

        if(!acceptTerms){

            validationErrors.terms=

                "Accept Terms & Conditions.";

        }

        setErrors(validationErrors);

        return Object.keys(

            validationErrors

        ).length===0;

    };

    /*==========================================
                REGISTER
    ==========================================*/

    const handleRegister=async(event)=>{

        event.preventDefault();

        if(!validate()) return;

        try{

            const response=

                await api.get("/users");

            const emailExists=

                response.data.find(

                    user=>

                    user.email===

                    formData.email

                );

            if(emailExists){

                setMessage(

                    "Email already exists."

                );

                return;

            }

            await api.post("/users",{

                name:formData.name,

                gender:formData.gender,

                phone:formData.phone,

                email:formData.email,

                password:formData.password,

                role:"user",

                isActive:true,

                createdAt:

                new Date().toLocaleString()

            });

            navigate("/login");

        }

        catch(error){

            console.log(error);

            setMessage(

                "Registration failed."

            );

        }

    };
        return (

        <div className="register-page">

            {/*==========================================
                    HERO SECTION
            ==========================================*/}

            <div className="hero-section">

                <div className="hero-content">

                    <div className="logo">

                       <img
                            src={logo}
                            alt="BabyCareMart Logo"
                            className="auth-logo"
                        />

                        <h2>

                            BabyCareMart

                        </h2>

                    </div>

                    <span className="hero-badge">

                        Join India's Most Trusted Baby Shopping Store

                    </span>

                    <h1>

                        Give Your Baby

                        <br />

                        The Best Start

                        <span>

                            💖

                        </span>

                    </h1>

                    <p>

                        Join thousands of happy parents and shop premium

                        baby essentials, clothing, toys, feeding products,

                        skincare and much more.

                    </p>

                    {/*==========================================
                            STATS
                    ==========================================*/}

                    <div className="hero-stats">

                        <div className="stat-card">

                            <FaUsers />

                            <div>

                                <h3>

                                    10K+

                                </h3>

                                <p>

                                    Happy Parents

                                </p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaBoxOpen />

                            <div>

                                <h3>

                                    50K+

                                </h3>

                                <p>

                                    Baby Products

                                </p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaTruck />

                            <div>

                                <h3>

                                    24 Hrs

                                </h3>

                                <p>

                                    Fast Delivery

                                </p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaShieldAlt />

                            <div>

                                <h3>

                                    100%

                                </h3>

                                <p>

                                    Trusted Brands

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/*==========================================
                    REGISTER SECTION
            ==========================================*/}

            <div className="register-section">

                <div className="register-card">

                    <span className="welcome-tag">

                        👶 Join BabyCareMart

                    </span>

                    <h2>

                        Create Your Account

                    </h2>

                    <p className="subtitle">

                        Start shopping safely for your little one's everyday needs.

                    </p>

                    <form onSubmit={handleRegister}>

                        {/* NAME */}

                        <div className="input-group">

                            <FaUser className="input-icon" />

                            <input

                                type="text"

                                name="name"

                                placeholder="Full Name"

                                value={formData.name}

                                onChange={handleChange}

                            />

                        </div>

                        {

                            errors.name &&

                            <small className="error">

                                {errors.name}

                            </small>

                        }

                        {/* GENDER */}

                        <div className="input-group">

                            <FaVenusMars className="input-icon" />

                            <select

                                name="gender"

                                value={formData.gender}

                                onChange={handleChange}

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

                        {

                            errors.gender &&

                            <small className="error">

                                {errors.gender}

                            </small>

                        }

                        {/* PHONE */}

                        <div className="input-group">

                            <FaPhone className="input-icon" />

                            <input

                                type="text"

                                name="phone"

                                placeholder="Phone Number"

                                value={formData.phone}

                                onChange={handleChange}

                            />

                        </div>

                        {

                            errors.phone &&

                            <small className="error">

                                {errors.phone}

                            </small>

                        }

                        {/* EMAIL */}

                        <div className="input-group">

                            <FaEnvelope className="input-icon" />

                            <input

                                type="email"

                                name="email"

                                placeholder="Email Address"

                                value={formData.email}

                                onChange={handleChange}

                            />

                        </div>

                        {

                            errors.email &&

                            <small className="error">

                                {errors.email}

                            </small>

                        }

                        {/* PASSWORD */}

                        <div className="input-group">

                            <FaLock className="input-icon" />

                            <input

                                type={

                                    showPassword

                                    ? "text"

                                    : "password"

                                }

                                name="password"

                                placeholder="Create Password"

                                value={formData.password}

                                onChange={handleChange}

                            />

                            <span

                                className="toggle-password"

                                onClick={()=>

                                    setShowPassword(

                                        !showPassword

                                    )

                                }

                            >

                                {

                                    showPassword

                                    ? <FaEyeSlash />

                                    : <FaEye />

                                }

                            </span>

                        </div>

                        {

                            errors.password &&

                            <small className="error">

                                {errors.password}

                            </small>

                        }

                        {/* CONFIRM PASSWORD */}

                        <div className="input-group">

                            <FaLock className="input-icon" />

                            <input

                                type={

                                    showConfirmPassword

                                    ? "text"

                                    : "password"

                                }

                                name="confirmPassword"

                                placeholder="Confirm Password"

                                value={formData.confirmPassword}

                                onChange={handleChange}

                            />

                            <span

                                className="toggle-password"

                                onClick={()=>

                                    setShowConfirmPassword(

                                        !showConfirmPassword

                                    )

                                }

                            >

                                {

                                    showConfirmPassword

                                    ? <FaEyeSlash />

                                    : <FaEye />

                                }

                            </span>

                        </div>

                        {

                            errors.confirmPassword &&

                            <small className="error">

                                {errors.confirmPassword}

                            </small>

                        }
                                                {/*==========================================
                                TERMS & CONDITIONS
                        ==========================================*/}

                        <div className="terms-section">

                            <label>

                                <input

                                    type="checkbox"

                                    checked={acceptTerms}

                                    onChange={()=>

                                        setAcceptTerms(

                                            !acceptTerms

                                        )

                                    }

                                />

                                I agree to the

                                <Link to="/terms">

                                    Terms & Conditions

                                </Link>

                                &

                                <Link to="/privacy-policy">

                                    Privacy Policy

                                </Link>

                            </label>

                        </div>

                        {

                            errors.terms &&

                            <small className="error">

                                {errors.terms}

                            </small>

                        }

                        {/*==========================================
                                REGISTER BUTTON
                        ==========================================*/}

                        <button

                            type="submit"

                            className="register-btn"

                        >

                            Create My Account

                        </button>

                    </form>

                    {/*==========================================
                            REGISTER MESSAGE
                    ==========================================*/}

                    {

                        message && (

                            <div className="register-message">

                                {message}

                            </div>

                        )

                    }

                    {/*==========================================
                            DIVIDER
                    ==========================================*/}

                    <div className="divider">

                        <span>

                            OR CONTINUE WITH

                        </span>

                    </div>

                    {/*==========================================
                            GOOGLE SIGN UP
                    ==========================================*/}

                    <button

                        type="button"

                        className="google-btn"

                    >

                        <FaGoogle />

                        Continue with Google

                    </button>

                    {/*==========================================
                            SECURITY MESSAGE
                    ==========================================*/}

                    <div className="secure-box">

                        <FaShieldAlt />

                        <span>

                            Your personal information is securely encrypted and protected.

                        </span>

                    </div>

                    {/*==========================================
                            LOGIN LINK
                    ==========================================*/}

                    <div className="login-section-footer">

                        <p>

                            Already have an account?

                        </p>

                        <Link

                            to="/login"

                            className="login-link"

                        >

                            Sign In

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Register;