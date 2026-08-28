import { useEffect, useState } from "react";

import {
    useNavigate,
    useLocation
} from "react-router-dom";

import {
    FaCreditCard,
    FaUniversity,
    FaMobileAlt,
    FaWallet,
    FaMoneyBillWave,
    FaLock,
    FaShieldAlt,
    FaCheckCircle,
    FaArrowLeft,
    FaTruck,
    FaBoxOpen
} from "react-icons/fa";

import { toast } from "react-toastify";

import api from "../../services/api";

import "../../styles/Customer/Payment.css";


function Payment() {

    const navigate = useNavigate();

    const { state } = useLocation();


    /* =====================================================
       CURRENT USER
    ===================================================== */

    let currentUser = null;

    try {

        currentUser = JSON.parse(
            localStorage.getItem("user")
        );

    } catch (error) {

        console.error(
            "Unable to read logged-in user:",
            error
        );

        currentUser = null;
    }


    /* =====================================================
       PAYMENT STATE
    ===================================================== */

    const [paymentMethod, setPaymentMethod] =
        useState("upi");

    const [loading, setLoading] =
        useState(false);

    const [paymentData, setPaymentData] =
        useState({

            upiId: "",

            cardNumber: "",

            cardHolder: "",

            expiry: "",

            cvv: ""

        });


    /* =====================================================
       INITIAL PAYMENT METHOD
    ===================================================== */

    useEffect(() => {

        if (
            state &&
            state.paymentMethod
        ) {

            setPaymentMethod(
                state.paymentMethod
            );
        }

    }, [state]);


    /* =====================================================
       INVALID CHECKOUT SESSION
    ===================================================== */

    if (!state) {

        return (

            <div className="pc-page">

                <div className="pc-error-card">

                    <div className="pc-error-icon">
                        <FaBoxOpen />
                    </div>

                    <h2>
                        Invalid Checkout Session
                    </h2>

                    <p>
                        Your checkout session has expired
                        or is invalid.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/checkout")
                        }
                    >
                        Back To Checkout
                    </button>

                </div>

            </div>

        );
    }


    /* =====================================================
       USER VALIDATION
    ===================================================== */

    if (!currentUser) {

        return (

            <div className="pc-page">

                <div className="pc-error-card">

                    <div className="pc-error-icon">
                        <FaLock />
                    </div>

                    <h2>
                        Please Login
                    </h2>

                    <p>
                        You need to login before
                        completing your payment.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>

                </div>

            </div>

        );
    }


    /* =====================================================
       ORDER DATA
    ===================================================== */

    const {
        orderId,
        orderDate,
        customer,
        address,
        cartItems = [],
        subtotal,
        shipping,
        discount,
        gst,
        total,
        appliedCoupon
    } = state;


    /* =====================================================
       COD CHARGE
    ===================================================== */

    const codCharge =
        paymentMethod === "cod"
            ? 50
            : 0;


    /* =====================================================
       FINAL PAYMENT TOTAL
    ===================================================== */

    const paymentTotal = Number(

        (
            Number(total || 0) +
            codCharge
        ).toFixed(2)

    );


    /* =====================================================
       ORDER SUMMARY
    ===================================================== */

    const orderSummary = {

        subtotal:
            Number(subtotal || 0),

        delivery:
            Number(shipping || 0),

        discount:
            Number(discount || 0),

        tax:
            Number(gst || 0),

        codCharge,

        total:
            paymentTotal

    };


    /* =====================================================
       INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setPaymentData(
            previous => ({

                ...previous,

                [name]: value

            })
        );
    };


    /* =====================================================
       PAYMENT METHOD CHANGE
    ===================================================== */

    const handlePaymentMethodChange = (
        method
    ) => {

        if (loading) {
            return;
        }

        setPaymentMethod(method);
    };


    /* =====================================================
       PAYMENT METHOD NAME
    ===================================================== */

    const getPaymentMethodName = () => {

        switch (paymentMethod) {

            case "upi":
                return "UPI";

            case "card":
                return "Credit Card";

            case "netbanking":
                return "Net Banking";

            case "wallet":
                return "Wallet";

            case "cod":
                return "Cash On Delivery";

            default:
                return "Cash On Delivery";
        }
    };


    /* =====================================================
       PAYMENT VALIDATION
    ===================================================== */

    const validatePayment = () => {

        /* ---------------- UPI ---------------- */

        if (paymentMethod === "upi") {

            const upiId =
                paymentData.upiId.trim();


            if (!upiId) {

                toast.error(
                    "Enter your UPI ID."
                );

                return false;
            }


            if (
                !upiId.includes("@") ||
                upiId.startsWith("@") ||
                upiId.endsWith("@")
            ) {

                toast.error(
                    "Enter a valid UPI ID."
                );

                return false;
            }
        }


        /* ---------------- CARD ---------------- */

        if (paymentMethod === "card") {

            const cleanCardNumber =
                paymentData.cardNumber.replace(
                    /\s/g,
                    ""
                );


            if (
                !/^\d{16}$/.test(
                    cleanCardNumber
                )
            ) {

                toast.error(
                    "Card number must contain 16 digits."
                );

                return false;
            }


            if (
                paymentData.cardHolder.trim() === ""
            ) {

                toast.error(
                    "Enter card holder name."
                );

                return false;
            }


            if (
                !/^\d{2}\/\d{2}$/.test(
                    paymentData.expiry
                )
            ) {

                toast.error(
                    "Enter expiry in MM/YY format."
                );

                return false;
            }


            if (
                !/^\d{3}$/.test(
                    paymentData.cvv
                )
            ) {

                toast.error(
                    "CVV must contain 3 digits."
                );

                return false;
            }
        }


        return true;
    };


    /* =====================================================
       CREATE PAYMENT
    ===================================================== */

    const createPayment = async (
        transactionId
    ) => {

        const payment = {

            userId:
                currentUser.id,

            orderId,

            transactionId,

            method:
                getPaymentMethodName(),

            amount:
                paymentTotal,

            status:
                "Success",

            paymentDate:
                new Date().toLocaleString()

        };


        await api.post(
            "/payments",
            payment
        );
    };


    /* =====================================================
       CREATE ORDER
    ===================================================== */

    const createOrder = async (
        transactionId
    ) => {

        const order = {

            orderId,

            orderDate,

            userId:
                currentUser.id,

            customer,

            address,

            paymentMethod:
                getPaymentMethodName(),

            items:
                cartItems,

            subtotal:
                Number(subtotal || 0),

            shipping:
                Number(shipping || 0),

            discount:
                Number(discount || 0),

            gst:
                Number(gst || 0),

            codCharge,

            total:
                paymentTotal,

            coupon:
                appliedCoupon || null,

            transactionId,

            status:
                "Order Placed"

        };


        const response =
            await api.post(
                "/orders",
                order
            );


        return response.data;
    };


    /* =====================================================
       CREATE TRACKING
    ===================================================== */

    const createTracking = async () => {

        try {

            const tracking = {

                orderId,

                userId:
                    currentUser.id,

                status:
                    "Order Placed",

                courier:
                    "Blue Dart",

                trackingId:
                    "BD" + Date.now(),

                estimatedDelivery:
                    new Date(

                        Date.now() +
                        5 *
                        24 *
                        60 *
                        60 *
                        1000

                    ).toLocaleDateString(),

                customerName:
                    customer?.fullName || "",

                address:
                    address?.house || "",

                city:
                    address?.city || "",

                state:
                    address?.state || "",

                pincode:
                    address?.pincode || "",

                mobile:
                    customer?.phone ||
                    address?.mobile ||
                    "",

                productName:
                    cartItems[0]?.name ||
                    "Multiple Products",

                quantity:
                    cartItems.reduce(

                        (
                            sum,
                            item
                        ) =>
                            sum +
                            Number(
                                item.quantity || 0
                            ),

                        0
                    ),

                paymentMethod:
                    getPaymentMethodName(),

                totalAmount:
                    paymentTotal

            };


            await api.post(
                "/tracking",
                tracking
            );


            return true;

        } catch (error) {

            console.error(
                "TRACKING API FAILED:",
                error
            );

            return false;
        }
    };


    /* =====================================================
       CREATE NOTIFICATION
    ===================================================== */

    const createNotification = async () => {

        try {

            await api.post(
                "/notifications",
                {

                    userId:
                        currentUser.id,

                    title:
                        "Order Placed",

                    message:
                        `Your order ${orderId} has been placed successfully.`,

                    read:
                        false,

                    createdAt:
                        new Date().toLocaleString()

                }
            );


            return true;

        } catch (error) {

            console.error(
                "NOTIFICATION API FAILED:",
                error
            );

            return false;
        }
    };


    /* =====================================================
       SAVE APPLIED COUPON
    ===================================================== */

    const saveAppliedCoupon = async () => {

        if (!appliedCoupon) {
            return true;
        }


        try {

            await api.post(
                "/appliedCoupons",
                {

                    userId:
                        currentUser.id,

                    orderId,

                    couponCode:
                        appliedCoupon.code,

                    discount:
                        Number(
                            appliedCoupon.discount || 0
                        ),

                    savedAmount:
                        Number(
                            appliedCoupon.discount || 0
                        )

                }
            );


            return true;

        } catch (error) {

            console.error(
                "COUPON API FAILED:",
                error
            );

            return false;
        }
    };


    /* =====================================================
       CLEAR CART
    ===================================================== */

    const clearCart = async () => {

        try {

            await Promise.all(

                cartItems.map(
                    item =>
                        api.delete(
                            `/cart/${item.id}`
                        )
                )

            );


            window.dispatchEvent(
                new Event("cartUpdated")
            );


            return true;

        } catch (error) {

            console.error(
                "CART CLEANUP FAILED:",
                error
            );


            window.dispatchEvent(
                new Event("cartUpdated")
            );


            return false;
        }
    };


    /* =====================================================
       HANDLE PAYMENT
    ===================================================== */

    const handlePayment = async () => {

        if (loading) {
            return;
        }


        /* ---------------- VALIDATE PAYMENT ---------------- */

        if (!validatePayment()) {
            return;
        }


        /* ---------------- VALIDATE CART ---------------- */

        if (
            !cartItems ||
            cartItems.length === 0
        ) {

            toast.error(
                "Your cart is empty."
            );

            navigate("/cart");

            return;
        }


        /* ---------------- VALIDATE ADDRESS ---------------- */

        if (!address) {

            toast.error(
                "Delivery address is missing."
            );

            navigate("/checkout");

            return;
        }


        setLoading(true);


        try {

            const transactionId =
                "TXN" + Date.now();


            /* STEP 1 */

            await createPayment(
                transactionId
            );


            /* STEP 2 */

            await createOrder(
                transactionId
            );


            /* STEP 3 */

            await createTracking();


            /* STEP 4 */

            await createNotification();


            /* STEP 5 */

            await saveAppliedCoupon();


            /* STEP 6 */

            await clearCart();


            toast.success(
                "Order placed successfully!"
            );


            navigate(
                "/payment-success",
                {

                    state: {

                        orderId,

                        transactionId,

                        total:
                            paymentTotal,

                        coupon:
                            appliedCoupon ||
                            null

                    }

                }
            );


        } catch (error) {

            console.error(
                "PAYMENT / ORDER FAILED:",
                error
            );


            toast.error(
                "Unable to complete your order."
            );


            navigate(
                "/payment-failed",
                {

                    state: {

                        orderId,

                        reason:
                            error.response?.data?.message ||
                            "Payment or order processing failed.",

                        paymentMethod:
                            getPaymentMethodName(),

                        total:
                            paymentTotal

                    }

                }
            );


        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       PAYMENT METHOD CARD
    ===================================================== */

    const PaymentMethodCard = ({
        method,
        icon,
        title,
        description
    }) => {

        return (

            <label
                className={
                    `pc-method ${
                        paymentMethod === method
                            ? "pc-method-active"
                            : ""
                    }`
                }
            >

                <input
                    type="radio"
                    name="paymentMethod"
                    checked={
                        paymentMethod === method
                    }
                    onChange={() =>
                        handlePaymentMethodChange(
                            method
                        )
                    }
                />

                <div className="pc-method-icon">
                    {icon}
                </div>

                <div className="pc-method-content">

                    <strong>
                        {title}
                    </strong>

                    <span>
                        {description}
                    </span>

                </div>

                <span className="pc-method-arrow">
                    →
                </span>

            </label>
        );
    };


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    const formatPrice = (value) => {

        return Number(
            value || 0
        ).toFixed(2);
    };


    /* =====================================================
       JSX
    ===================================================== */

    return (

        <div className="pc-page">


            {/* =================================================
                TOP NAVIGATION
            ================================================= */}

            <div className="pc-topbar">

                <button
                    type="button"
                    className="pc-back-button"
                    onClick={() =>
                        navigate("/checkout")
                    }
                >

                    <FaArrowLeft />

                    <span>
                        Back to Checkout
                    </span>

                </button>


                <div className="pc-progress">

                    <div className="pc-progress-step pc-completed">

                        <span>
                            1
                        </span>

                        <strong>
                            Cart
                        </strong>

                    </div>


                    <div className="pc-progress-line" />


                    <div className="pc-progress-step pc-completed">

                        <span>
                            2
                        </span>

                        <strong>
                            Checkout
                        </strong>

                    </div>


                    <div className="pc-progress-line" />


                    <div className="pc-progress-step pc-current">

                        <span>
                            3
                        </span>

                        <strong>
                            Payment
                        </strong>

                    </div>

                </div>


                <div className="pc-secure-label">

                    <FaLock />

                    Secure Checkout

                </div>

            </div>


            {/* =================================================
                PAGE HEADING
            ================================================= */}

            <div className="pc-heading">

                <div className="pc-heading-badge">

                    <FaShieldAlt />

                    Safe & Secure Payment

                </div>


                <h1>
                    Complete Your Payment
                </h1>


                <p>
                    Choose your preferred payment method
                    and securely place your order.
                </p>

            </div>


            {/* =================================================
                MAIN LAYOUT
            ================================================= */}

            <div className="pc-layout">


                {/* =================================================
                    LEFT PAYMENT CARD
                ================================================= */}

                <section className="pc-payment-card">


                    <div className="pc-section-heading">

                        <div>

                            <span>
                                PAYMENT METHOD
                            </span>

                            <h2>
                                Choose how you'd like to pay
                            </h2>

                        </div>


                        <div className="pc-verified">

                            <FaCheckCircle />

                            Verified

                        </div>

                    </div>


                    {/* =================================================
                        SECURITY STRIP
                    ================================================= */}

                    <div className="pc-security-strip">

                        <div className="pc-security-item">

                            <div className="pc-security-icon">
                                <FaShieldAlt />
                            </div>

                            <div>

                                <strong>
                                    Secure Payment
                                </strong>

                                <span>
                                    Encrypted transaction
                                </span>

                            </div>

                        </div>


                        <div className="pc-security-item">

                            <div className="pc-security-icon">
                                <FaLock />
                            </div>

                            <div>

                                <strong>
                                    100% Protected
                                </strong>

                                <span>
                                    Your details are safe
                                </span>

                            </div>

                        </div>


                        <div className="pc-security-item">

                            <div className="pc-security-icon">
                                <FaCheckCircle />
                            </div>

                            <div>

                                <strong>
                                    Safe Checkout
                                </strong>

                                <span>
                                    Trusted payment process
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        PAYMENT METHODS
                    ================================================= */}

                    <div className="pc-method-grid">


                        <PaymentMethodCard
                            method="upi"
                            icon={<FaMobileAlt />}
                            title="UPI"
                            description="Google Pay, PhonePe, Paytm & BHIM"
                        />


                        <PaymentMethodCard
                            method="card"
                            icon={<FaCreditCard />}
                            title="Credit / Debit Card"
                            description="Visa, MasterCard, RuPay & Amex"
                        />


                        <PaymentMethodCard
                            method="netbanking"
                            icon={<FaUniversity />}
                            title="Net Banking"
                            description="Pay securely through your bank"
                        />


                        <PaymentMethodCard
                            method="wallet"
                            icon={<FaWallet />}
                            title="Wallet"
                            description="PhonePe, Paytm, Google Pay & more"
                        />


                        <PaymentMethodCard
                            method="cod"
                            icon={<FaMoneyBillWave />}
                            title="Cash On Delivery"
                            description="Pay when your order arrives"
                        />

                    </div>


                    {/* =================================================
                        UPI
                    ================================================= */}

                    {paymentMethod === "upi" && (

                        <div className="pc-form-box">

                            <div className="pc-form-heading">

                                <div className="pc-form-icon">
                                    <FaMobileAlt />
                                </div>

                                <div>

                                    <h3>
                                        UPI Payment
                                    </h3>

                                    <p>
                                        Enter your UPI ID to continue.
                                    </p>

                                </div>

                            </div>


                            <label>
                                UPI ID
                            </label>

                            <input
                                type="text"
                                name="upiId"
                                value={
                                    paymentData.upiId
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="example@upi"
                            />

                        </div>

                    )}


                    {/* =================================================
                        CARD
                    ================================================= */}

                    {paymentMethod === "card" && (

                        <div className="pc-form-box">

                            <div className="pc-form-heading">

                                <div className="pc-form-icon">
                                    <FaCreditCard />
                                </div>

                                <div>

                                    <h3>
                                        Card Details
                                    </h3>

                                    <p>
                                        Your card information is securely protected.
                                    </p>

                                </div>

                            </div>


                            <label>
                                Card Number
                            </label>

                            <input
                                type="text"
                                name="cardNumber"
                                value={
                                    paymentData.cardNumber
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                            />


                            <label>
                                Card Holder Name
                            </label>

                            <input
                                type="text"
                                name="cardHolder"
                                value={
                                    paymentData.cardHolder
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="John Doe"
                            />


                            <div className="pc-card-row">

                                <div>

                                    <label>
                                        Expiry Date
                                    </label>

                                    <input
                                        type="text"
                                        name="expiry"
                                        value={
                                            paymentData.expiry
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="MM/YY"
                                        maxLength="5"
                                    />

                                </div>


                                <div>

                                    <label>
                                        CVV
                                    </label>

                                    <input
                                        type="password"
                                        name="cvv"
                                        value={
                                            paymentData.cvv
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="123"
                                        maxLength="3"
                                    />

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        NET BANKING
                    ================================================= */}

                    {paymentMethod === "netbanking" && (

                        <div className="pc-form-box">

                            <div className="pc-form-heading">

                                <div className="pc-form-icon">
                                    <FaUniversity />
                                </div>

                                <div>

                                    <h3>
                                        Net Banking
                                    </h3>

                                    <p>
                                        Select your bank to continue.
                                    </p>

                                </div>

                            </div>


                            <label>
                                Select Bank
                            </label>

                            <select>

                                <option>
                                    State Bank of India
                                </option>

                                <option>
                                    HDFC Bank
                                </option>

                                <option>
                                    ICICI Bank
                                </option>

                                <option>
                                    Axis Bank
                                </option>

                                <option>
                                    Punjab National Bank
                                </option>

                            </select>

                        </div>

                    )}


                    {/* =================================================
                        WALLET
                    ================================================= */}

                    {paymentMethod === "wallet" && (

                        <div className="pc-form-box">

                            <div className="pc-form-heading">

                                <div className="pc-form-icon">
                                    <FaWallet />
                                </div>

                                <div>

                                    <h3>
                                        Wallet Payment
                                    </h3>

                                    <p>
                                        Select your preferred wallet.
                                    </p>

                                </div>

                            </div>


                            <label>
                                Select Wallet
                            </label>

                            <select>

                                <option>
                                    PhonePe
                                </option>

                                <option>
                                    Google Pay
                                </option>

                                <option>
                                    Paytm
                                </option>

                                <option>
                                    Amazon Pay
                                </option>

                            </select>

                        </div>

                    )}


                    {/* =================================================
                        COD
                    ================================================= */}

                    {paymentMethod === "cod" && (

                        <div className="pc-cod-box">

                            <div className="pc-cod-icon">
                                <FaMoneyBillWave />
                            </div>


                            <div className="pc-cod-content">

                                <span>
                                    PAYMENT METHOD
                                </span>

                                <h3>
                                    Cash On Delivery
                                </h3>

                                <p>
                                    Pay after your order
                                    is delivered to your doorstep.
                                </p>


                                <div className="pc-cod-bottom">

                                    <span>
                                        Additional COD charge
                                    </span>

                                    <strong>
                                        ₹50
                                    </strong>

                                </div>


                                <div className="pc-cod-available">

                                    <FaCheckCircle />

                                    COD is available for this order

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        SECURITY FOOTER
                    ================================================= */}

                    <div className="pc-security-footer">

                        <FaLock />

                        <div>

                            <strong>
                                Your payment is secure
                            </strong>

                            <span>
                                This demo application does not store
                                real card numbers, CVV or UPI credentials.
                            </span>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    RIGHT ORDER SUMMARY
                ================================================= */}

                <aside className="pc-summary-card">


                    {/* SUMMARY TOP */}

                    <div className="pc-summary-top">

                        <div>

                            <span>
                                YOUR ORDER
                            </span>

                            <h2>
                                Order Summary
                            </h2>

                            <p>
                                {cartItems.length}{" "}
                                {cartItems.length === 1
                                    ? "Item"
                                    : "Items"}
                            </p>

                        </div>


                        <div className="pc-summary-check">

                            <FaCheckCircle />

                        </div>

                    </div>


                    {/* =================================================
                        ORDER META
                    ================================================= */}

                    <div className="pc-order-meta">

                        <div>

                            <span>
                                ORDER ID
                            </span>

                            <strong>
                                {orderId || "N/A"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                DELIVERY
                            </span>

                            <strong>
                                {orderSummary.delivery === 0
                                    ? "FREE"
                                    : `₹${formatPrice(
                                        orderSummary.delivery
                                    )}`}
                            </strong>

                        </div>

                    </div>


                    {/* =================================================
                        PRODUCTS
                    ================================================= */}

                    <div className="pc-summary-products">

                        {cartItems.map(
                            (item) => (

                                <div
                                    className="pc-summary-product"
                                    key={item.id}
                                >

                                    <div className="pc-product-image">

                                        <img
                                            src={
                                                item.image ||
                                                "/images/no-image.png"
                                            }
                                            alt={
                                                item.name ||
                                                "Product"
                                            }
                                            onError={(event) => {

                                                event.currentTarget.src =
                                                    "/images/no-image.png";

                                            }}
                                        />

                                    </div>


                                    <div className="pc-product-info">

                                        <h4>
                                            {item.name}
                                        </h4>

                                        <span>
                                            Qty:{" "}
                                            {item.quantity || 1}
                                        </span>

                                    </div>


                                    <strong>
                                        ₹
                                        {formatPrice(
                                            Number(
                                                item.price || 0
                                            ) *
                                            Number(
                                                item.quantity || 1
                                            )
                                        )}
                                    </strong>

                                </div>

                            )
                        )}

                    </div>


                    {/* =================================================
                        PRICE DETAILS
                    ================================================= */}

                    <div className="pc-price-details">


                        <div className="pc-price-row">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹
                                {formatPrice(
                                    orderSummary.subtotal
                                )}
                            </strong>

                        </div>


                        <div className="pc-price-row">

                            <span>
                                Shipping
                            </span>

                            <strong
                                className={
                                    orderSummary.delivery === 0
                                        ? "pc-free"
                                        : ""
                                }
                            >

                                {orderSummary.delivery === 0
                                    ? "FREE"
                                    : `₹${formatPrice(
                                        orderSummary.delivery
                                    )}`}

                            </strong>

                        </div>


                        {orderSummary.discount > 0 && (

                            <div className="pc-price-row">

                                <span>
                                    Discount
                                </span>

                                <strong className="pc-discount">

                                    -₹
                                    {formatPrice(
                                        orderSummary.discount
                                    )}

                                </strong>

                            </div>

                        )}


                        {appliedCoupon && (

                            <div className="pc-price-row">

                                <span>
                                    Coupon
                                </span>

                                <strong className="pc-coupon">

                                    {appliedCoupon.code}

                                </strong>

                            </div>

                        )}


                        <div className="pc-price-row">

                            <span>
                                GST
                            </span>

                            <strong>
                                ₹
                                {formatPrice(
                                    orderSummary.tax
                                )}
                            </strong>

                        </div>


                        {orderSummary.codCharge > 0 && (

                            <div className="pc-price-row">

                                <span>
                                    COD Charge
                                </span>

                                <strong>
                                    ₹50.00
                                </strong>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        TOTAL
                    ================================================= */}

                    <div className="pc-total-box">

                        <div>

                            <span>
                                Total Amount
                            </span>

                            <small>
                                Inclusive of applicable taxes
                            </small>

                        </div>


                        <strong>
                            ₹
                            {formatPrice(
                                orderSummary.total
                            )}
                        </strong>

                    </div>


                    {/* =================================================
                        PAY BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        className="pc-pay-button"
                        onClick={
                            handlePayment
                        }
                        disabled={
                            loading
                        }
                    >

                        {loading ? (

                            <>
                                Processing Order...
                            </>

                        ) : (

                            <>
                                <FaLock />

                                Pay ₹
                                {formatPrice(
                                    orderSummary.total
                                )}
                            </>

                        )}

                    </button>


                    {/* =================================================
                        TRUST BADGES
                    ================================================= */}

                    <div className="pc-trust-row">

                        <div>

                            <FaShieldAlt />

                            <span>
                                Secure
                            </span>

                        </div>


                        <div>

                            <FaCheckCircle />

                            <span>
                                Verified
                            </span>

                        </div>


                        <div>

                            <FaTruck />

                            <span>
                                Reliable Delivery
                            </span>

                        </div>

                    </div>

                </aside>

            </div>

        </div>

    );
}


export default Payment;