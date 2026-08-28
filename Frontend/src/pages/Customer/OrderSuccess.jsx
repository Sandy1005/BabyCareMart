import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {

    FaCheckCircle,

    FaBox,

    FaMoneyCheckAlt,

    FaMapMarkerAlt,

    FaTruck,

    FaGift

} from "react-icons/fa";

import api from "../../services/api";

import "../../styles/Customer/OrderSuccess.css";

function OrderSuccess() {

    const navigate = useNavigate();

    const { state } = useLocation();

    const [order, setOrder] = useState(null);

    const [payment, setPayment] = useState(null);

    const [tracking, setTracking] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!state?.orderId) {

            navigate("/");

            return;

        }

        loadOrderDetails();

    }, []);

    const loadOrderDetails = async () => {

        try {

            const [

                orders,

                payments,

                tracking

            ] = await Promise.all([

                api.get("/orders"),

                api.get("/payments"),

                api.get("/tracking")

            ]);

            const currentOrder =

                orders.data.find(

                    item =>

                        item.orderId ===

                        state.orderId

                );

            const currentPayment =

                payments.data.find(

                    item =>

                        item.orderId ===

                        state.orderId

                );

            const currentTracking =

                tracking.data.find(

                    item =>

                        item.orderId ===

                        state.orderId

                );

            setOrder(currentOrder);

            setPayment(currentPayment);

            setTracking(currentTracking);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="order-success-loading">

                Loading Order...

            </div>

        );

    }

    if (!order) {

        return (

            <div className="order-success-error">

                <h2>

                    Order Not Found

                </h2>

            </div>

        );

    }

    return (

        <div className="order-success-page">

            <div className="success-card">

                <div className="success-icon">

                    <FaCheckCircle />

                </div>

                <h1>

                    Order Placed Successfully!

                </h1>

                <p>

                    Thank you for shopping with MotoHub.

                    Your order has been confirmed.

                </p>
                                {/*==========================================
                        ORDER DETAILS
                ==========================================*/}

                <div className="details-grid">

                    <div className="info-card">

                        <h3>

                            <FaBox />

                            Order Details

                        </h3>

                        <div className="info-row">

                            <span>Order ID</span>

                            <strong>{order.orderId}</strong>

                        </div>

                        <div className="info-row">

                            <span>Order Date</span>

                            <strong>{order.orderDate}</strong>

                        </div>

                        <div className="info-row">

                            <span>Order Status</span>

                            <strong className="status">

                                {order.status}

                            </strong>

                        </div>

                    </div>

                    {/*==========================================
                            PAYMENT DETAILS
                    ==========================================*/}

                    <div className="info-card">

                        <h3>

                            <FaMoneyCheckAlt />

                            Payment Details

                        </h3>

                        <div className="info-row">

                            <span>Payment Method</span>

                            <strong>

                                {payment?.method || order.paymentMethod}

                            </strong>

                        </div>

                        <div className="info-row">

                            <span>Transaction ID</span>

                            <strong>

                                {payment?.transactionId || "N/A"}

                            </strong>

                        </div>

                        <div className="info-row">

                            <span>Amount Paid</span>

                            <strong>

                                ₹{order.total}

                            </strong>

                        </div>

                        <div className="info-row">

                            <span>Status</span>

                            <strong className="success">

                                {payment?.status || "Success"}

                            </strong>

                        </div>

                    </div>

                </div>

                {/*==========================================
                        COUPON DETAILS
                ==========================================*/}

                {

                    order.coupon && (

                        <div className="coupon-card">

                            <FaGift className="coupon-icon" />

                            <div>

                                <h3>

                                    Coupon Applied

                                </h3>

                                <p>

                                    <strong>

                                        {order.coupon.code}

                                    </strong>

                                </p>

                                <span>

                                    You saved ₹{order.discount}

                                </span>

                            </div>

                        </div>

                    )

                }

                {/*==========================================
                        DELIVERY DETAILS
                ==========================================*/}

                <div className="details-grid">

                    <div className="info-card">

                        <h3>

                            <FaTruck />

                            Delivery Details

                        </h3>

                        <div className="info-row">

                            <span>Courier</span>

                            <strong>

                                {tracking?.courier || "Blue Dart"}

                            </strong>

                        </div>

                        <div className="info-row">

                            <span>Tracking ID</span>

                            <strong>

                                {tracking?.trackingId || "Pending"}

                            </strong>

                        </div>

                        <div className="info-row">

                            <span>Estimated Delivery</span>

                            <strong>

                                {

                                    tracking?.estimatedDelivery ||

                                    "Updating..."

                                }

                            </strong>

                        </div>

                    </div>

                    {/*==========================================
                            DELIVERY ADDRESS
                    ==========================================*/}

                    <div className="info-card">

                        <h3>

                            <FaMapMarkerAlt />

                            Delivery Address

                        </h3>

                        <p>

                            <strong>

                                {order.address.fullName}

                            </strong>

                        </p>

                        <p>

                            {order.address.house}

                        </p>

                        <p>

                            {order.address.street}

                        </p>

                        <p>

                            {order.address.city},

                            {" "}

                            {order.address.state}

                        </p>

                        <p>

                            {order.address.pincode}

                        </p>

                        <p>

                            Mobile :

                            {" "}

                            {order.address.mobile}

                        </p>

                    </div>

                </div>
                                {/*==========================================
                        PURCHASED PRODUCTS
                ==========================================*/}

                <div className="products-card">

                    <h3>

                        Purchased Products

                    </h3>

                    {

                        order.items.map((item) => (

                            <div

                                key={item.id}

                                className="product-item"

                            >

                                <div className="product-left">

                                    <img

                                        src={item.image}

                                        alt={item.name}

                                    />

                                    <div>

                                        <h4>

                                            {item.name}

                                        </h4>

                                        <p>

                                            Quantity : {item.quantity}

                                        </p>

                                    </div>

                                </div>

                                <div className="product-right">

                                    ₹{item.price * item.quantity}

                                </div>

                            </div>

                        ))

                    }

                </div>

                {/*==========================================
                        ORDER TOTAL
                ==========================================*/}

                <div className="total-card">

                    <div className="total-row">

                        <span>

                            Subtotal

                        </span>

                        <span>

                            ₹{order.subtotal}

                        </span>

                    </div>

                    <div className="total-row">

                        <span>

                            Shipping

                        </span>

                        <span>

                            {

                                order.shipping === 0

                                    ? "FREE"

                                    : `₹${order.shipping}`

                            }

                        </span>

                    </div>

                    {

                        order.discount > 0 && (

                            <div className="total-row discount">

                                <span>

                                    Discount

                                </span>

                                <span>

                                    -₹{order.discount}

                                </span>

                            </div>

                        )

                    }

                    <div className="total-row">

                        <span>

                            GST

                        </span>

                        <span>

                            ₹{order.gst}

                        </span>

                    </div>

                    <hr />

                    <div className="grand-total">

                        <span>

                            Grand Total

                        </span>

                        <span>

                            ₹{order.total}

                        </span>

                    </div>

                </div>

                {/*==========================================
                        ACTION BUTTONS
                ==========================================*/}

                <div className="success-actions">

                    <button

                        className="track-btn"

                        onClick={() =>

                            navigate(

                                "/order-tracking",

                                {

                                    state: {

                                        orderId:

                                            order.orderId

                                    }

                                }

                            )

                        }

                    >

                        Track Order

                    </button>

                    <button

                        className="orders-btn"

                        onClick={() =>

                            navigate("/orders")

                        }

                    >

                        View Orders

                    </button>

                    <button

                        className="shop-btn"

                        onClick={() =>

                            navigate("/")

                        }

                    >

                        Continue Shopping

                    </button>

                    <button

                        className="invoice-btn"

                        onClick={() =>

                            window.print()

                        }

                    >

                        Download Invoice

                    </button>

                </div>

            </div>

        </div>

    );

}

export default OrderSuccess;