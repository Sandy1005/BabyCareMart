import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import {

    FaEnvelope,

    FaLock,

    FaEye,

    FaEyeSlash,

    FaGoogle,

    FaShieldAlt,

    FaTruck,

    FaBoxOpen,

    FaUsers

} from "react-icons/fa";

import {

    loginStart,

    loginSuccess,

    loginFailure

} from "../../redux/authSlice";

import api from "../../services/api";

import "../../styles/Auth/Login.css";

import logo from "../../assets/logo/logo.png";

function Login() {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [showPassword, setShowPassword] =

        useState(false);

    const [rememberMe, setRememberMe] =

        useState(false);

    const [message, setMessage] =

        useState("");

    const [errors, setErrors] =

        useState({});

    const [formData, setFormData] =

        useState({

            email: "",

            password: ""

        });

    /*==========================================
                INPUT CHANGE
    ==========================================*/

    const handleChange = (event) => {

        const {

            name,

            value

        } = event.target;

        setFormData({

            ...formData,

            [name]: value

        });

    };

    /*==========================================
                VALIDATION
    ==========================================*/

    const validate = () => {

        const validationErrors = {};

        if (!formData.email.trim()) {

            validationErrors.email =

                "Email is required.";

        }

        if (!formData.password.trim()) {

            validationErrors.password =

                "Password is required.";

        }

        setErrors(validationErrors);

        return Object.keys(

            validationErrors

        ).length === 0;

    };

    /*==========================================
                LOGIN
    ==========================================*/

    const handleLogin = async (event) => {

        event.preventDefault();

        if (!validate()) return;

        dispatch(loginStart());

        setMessage("");

        try {

            const response = await api.get(

                "/users",

                {

                    params:{

                        email:formData.email,

                        password:formData.password

                    }

                }

            );

            if(response.data.length===0){

                dispatch(loginFailure());

                setMessage(

                    "Invalid Email or Password."

                );

                return;

            }

            const user=response.data[0];

            if(user.isActive===false){

                dispatch(loginFailure());

                setMessage(

                    "Your account has been disabled."

                );

                return;

            }

            dispatch(

                loginSuccess(user)

            );

            if(rememberMe){

                localStorage.setItem(

                    "rememberUser",

                    JSON.stringify(user)

                );

            }

            if(user.role==="admin"){

                navigate(

                    "/admin/dashboard"

                );

            }

            else{

                navigate("/home");

            }

        }

        catch(error){

            console.log(error);

            dispatch(loginFailure());

            setMessage(

                "Something went wrong."

            );

        }

    };
        return (

        <div className="login-page">

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

                        India's Trusted Baby Shopping Store

                    </span>

                    <h1>

                        Everything Your

                        <br />

                        Baby Needs

                        <span>

                            ❤️

                        </span>

                    </h1>

                    <p>

                        Shop trusted baby products, clothing,

                        toys, diapers, feeding essentials,

                        skincare and much more—all in one place.

                    </p>

                    {/*==============================
                            STATS
                    ==============================*/}

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

                                    Products

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

                                    Delivery

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

                                    Genuine Brands

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/*==========================================
                    LOGIN SECTION
            ==========================================*/}

            <div className="login-section">

                <div className="login-card">

                    <span className="welcome-tag">

                        👋 Welcome Back

                    </span>

                    <h2>

                        Sign in to your account

                    </h2>

                    <p className="subtitle">

                        Continue shopping for your little one's

                        favourite products.

                    </p>

                    <form

                        onSubmit={handleLogin}

                    >

                        {/* EMAIL */}

                        <div className="input-group">

                            <FaEnvelope

                                className="input-icon"

                            />

                            <input

                                type="email"

                                name="email"

                                placeholder="Email Address"

                                value={formData.email}

                                onChange={handleChange}

                            />

                        </div>

                        {

                            errors.email && (

                                <small className="error">

                                    {errors.email}

                                </small>

                            )

                        }

                        {/* PASSWORD */}

                        <div className="input-group">

                            <FaLock

                                className="input-icon"

                            />

                            <input

                                type={

                                    showPassword

                                        ? "text"

                                        : "password"

                                }

                                name="password"

                                placeholder="Password"

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

                            errors.password && (

                                <small className="error">

                                    {errors.password}

                                </small>

                            )

                        }

                        <div className="login-options">

                            <label>

                                <input

                                    type="checkbox"

                                    checked={rememberMe}

                                    onChange={()=>

                                        setRememberMe(

                                            !rememberMe

                                        )

                                    }

                                />

                                Remember Me

                            </label>

                            <Link

                                to="/forgot-password"

                            >

                                Forgot Password?

                            </Link>

                        </div>
                                                {/*==========================================
                                LOGIN BUTTON
                        ==========================================*/}

                        <button

                            type="submit"

                            className="login-btn"

                        >

                            Sign In

                        </button>

                    </form>

                    {/*==========================================
                            LOGIN MESSAGE
                    ==========================================*/}

                    {

                        message && (

                            <div className="login-message">

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
                            GOOGLE LOGIN
                    ==========================================*/}

                    <button

                        type="button"

                        className="google-btn"

                    >

                        <FaGoogle />

                        Continue with Google

                    </button>

                    {/*==========================================
                            TRUST MESSAGE
                    ==========================================*/}

                    <div className="secure-box">

                        <FaShieldAlt />

                        <span>

                            Your information is protected with secure encryption.

                        </span>

                    </div>

                    {/*==========================================
                            REGISTER LINK
                    ==========================================*/}

                    <div className="register-section">

                        <p>

                            New to BabyCareMart?

                        </p>

                        <Link

                            to="/register"

                            className="register-link"

                        >

                            Create an Account

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;