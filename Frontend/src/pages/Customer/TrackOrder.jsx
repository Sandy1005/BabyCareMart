import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    FaSearch,
    FaBoxOpen,
    FaTruck,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaClipboardList,
    FaHeadset,
    FaArrowRight
} from "react-icons/fa";

import "../../styles/Customer/TrackOrder.css";


function TrackOrder() {

    const [orderId, setOrderId] = useState("");

    const navigate = useNavigate();


    const handleTrackOrder = (e) => {

        e.preventDefault();

        const trimmedOrderId = orderId.trim();

        if (!trimmedOrderId) {
            return;
        }

        navigate(`/track-order/${trimmedOrderId}`);
    };


    return (

        <div className="track-order-page">

            {/* =================================================
                HERO SECTION
            ================================================= */}

            <section className="track-hero">

                <div className="track-hero-content">

                    <span className="track-eyebrow">
                        BABYCARE MART
                    </span>

                    <h1>
                        Track Your Order
                    </h1>

                    <p>
                        Enter your order ID and easily check
                        the latest status of your delivery.
                    </p>

                </div>

                <div className="track-hero-icon">

                    <FaBoxOpen />

                </div>

            </section>


            {/* =================================================
                TRACKING CARD
            ================================================= */}

            <section className="track-main">

                <div className="tracking-card">

                    <div className="tracking-card-header">

                        <div className="tracking-icon">

                            <FaSearch />

                        </div>

                        <div>

                            <h2>
                                Where is my order?
                            </h2>

                            <p>
                                Enter your order ID below to
                                view your delivery status.
                            </p>

                        </div>

                    </div>


                    <form
                        className="tracking-form"
                        onSubmit={handleTrackOrder}
                    >

                        <label htmlFor="orderId">
                            Order ID
                        </label>

                        <div className="tracking-input-wrapper">

                            <FaClipboardList />

                            <input
                                id="orderId"
                                type="text"
                                value={orderId}
                                onChange={(e) =>
                                    setOrderId(e.target.value)
                                }
                                placeholder="Example: ORD12345"
                                autoComplete="off"
                            />

                        </div>


                        <button
                            type="submit"
                            className="track-submit-btn"
                        >

                            <FaSearch />

                            Track Order

                            <FaArrowRight />

                        </button>

                    </form>


                    <div className="tracking-help">

                        <span>
                            Don't know your order ID?
                        </span>

                        <Link to="/orders">
                            View My Orders
                            <FaArrowRight />
                        </Link>

                    </div>

                </div>


                {/* =================================================
                    TRACKING FEATURES
                ================================================= */}

                <div className="tracking-features">

                    <div className="tracking-feature">

                        <div className="feature-icon">

                            <FaClipboardList />

                        </div>

                        <div>

                            <h3>
                                Order Confirmed
                            </h3>

                            <p>
                                Your order has been successfully
                                placed and confirmed.
                            </p>

                        </div>

                    </div>


                    <div className="tracking-feature">

                        <div className="feature-icon">

                            <FaBoxOpen />

                        </div>

                        <div>

                            <h3>
                                Packed With Care
                            </h3>

                            <p>
                                Your products are carefully packed
                                and prepared for shipping.
                            </p>

                        </div>

                    </div>


                    <div className="tracking-feature">

                        <div className="feature-icon">

                            <FaTruck />

                        </div>

                        <div>

                            <h3>
                                On The Way
                            </h3>

                            <p>
                                Your package is travelling to
                                your delivery address.
                            </p>

                        </div>

                    </div>


                    <div className="tracking-feature">

                        <div className="feature-icon">

                            <FaCheckCircle />

                        </div>

                        <div>

                            <h3>
                                Delivered
                            </h3>

                            <p>
                                Your little one's essentials
                                arrive safely at your doorstep.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    HELP SECTION
                ================================================= */}

                <div className="track-help-card">

                    <div className="track-help-icon">

                        <FaHeadset />

                    </div>

                    <div className="track-help-content">

                        <h3>
                            Need help with your order?
                        </h3>

                        <p>
                            Our customer support team is here
                            to help you with your order or delivery.
                        </p>

                    </div>

                    <Link
                        to="/support"
                        className="track-support-btn"
                    >

                        Contact Support

                        <FaArrowRight />

                    </Link>

                </div>

            </section>

        </div>

    );
}


export default TrackOrder;