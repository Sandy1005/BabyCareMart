import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FaEnvelope,
    FaArrowLeft,
    FaLock
} from "react-icons/fa";

import api from "../../services/api";

import "../../styles/Auth/ForgotPassword.css";


function ForgotPassword() {

    const [email, setEmail] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    /*==========================================
                    SUBMIT
    ==========================================*/

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");


        const trimmedEmail = email.trim();


        /*==========================================
                    EMPTY EMAIL
        ==========================================*/

        if (!trimmedEmail) {

            setError(
                "Please enter your email address."
            );

            return;

        }


        /*==========================================
                    EMAIL FORMAT
        ==========================================*/

        const emailRegex =

            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(trimmedEmail)) {

            setError(
                "Please enter a valid email address."
            );

            return;

        }


        setLoading(true);


        try {

            /*==========================================
                    CHECK USER FROM JSON SERVER
            ==========================================*/

            const response = await api.get(

                `/users?email=${encodeURIComponent(
                    trimmedEmail
                )}`

            );


            const users = response.data || [];


            /*==========================================
                    USER NOT FOUND
            ==========================================*/

            if (users.length === 0) {

                setError(

                    "No account found with this email address."

                );

                return;

            }


            /*==========================================
                    USER FOUND
            ==========================================*/

            setMessage(

                "Password reset instructions have been sent to your email."

            );

        }

        catch (error) {

            console.error(

                "Forgot Password Error:",

                error

            );


            setError(

                "Unable to process your request. Please try again."

            );

        }

        finally {

            setLoading(false);

        }

    };


    /*==========================================
                    JSX
    ==========================================*/

    return (

        <div className="forgot-page">

            <div className="forgot-card">


                {/*==========================================
                            ICON
                ==========================================*/}

                <div className="forgot-icon">

                    <FaLock />

                </div>


                {/*==========================================
                            BADGE
                ==========================================*/}

                <span className="forgot-badge">

                    🔐 Account Recovery

                </span>


                {/*==========================================
                            TITLE
                ==========================================*/}

                <h1>

                    Forgot Your Password?

                </h1>


                <p className="forgot-description">

                    Enter the email address associated
                    with your BabyCareMart account and
                    we'll help you reset your password.

                </p>


                {/*==========================================
                            FORM
                ==========================================*/}

                <form onSubmit={handleSubmit}>


                    {/*==========================================
                                EMAIL
                    ==========================================*/}

                    <div className="forgot-input">

                        <FaEnvelope />

                        <input

                            type="email"

                            placeholder="Email Address"

                            value={email}

                            onChange={(e) => {

                                setEmail(
                                    e.target.value
                                );

                                setError("");

                                setMessage("");

                            }}

                            autoComplete="email"

                        />

                    </div>


                    {/*==========================================
                                ERROR
                    ==========================================*/}

                    {error && (

                        <div className="forgot-error">

                            {error}

                        </div>

                    )}


                    {/*==========================================
                                SUCCESS
                    ==========================================*/}

                    {message && (

                        <div className="forgot-success">

                            {message}

                        </div>

                    )}


                    {/*==========================================
                                BUTTON
                    ==========================================*/}

                    <button

                        type="submit"

                        className="reset-button"

                        disabled={loading}

                    >

                        {loading

                            ? "Checking..."

                            : "Send Reset Instructions"

                        }

                    </button>

                </form>


                {/*==========================================
                            BACK TO LOGIN
                ==========================================*/}

                <button

                    className="back-login-button"

                    onClick={() =>
                        navigate("/login")
                    }

                >

                    <FaArrowLeft />

                    Back to Login

                </button>


                {/*==========================================
                            REGISTER
                ==========================================*/}

                <p className="create-account-text">

                    Don't have an account?

                    {" "}

                    <Link to="/register">

                        Create an Account

                    </Link>

                </p>


            </div>

        </div>

    );

}


export default ForgotPassword;