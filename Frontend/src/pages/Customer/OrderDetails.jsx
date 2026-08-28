import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../services/api";

import "../../styles/Customer/OrderDetails.css";


function OrderDetails() {

    /* =========================================================
                        NAVIGATION
    ========================================================= */

    const params = useParams();

    const id =
        params.id ||
        params.orderId ||
        params.orderID;
    const navigate = useNavigate();


    /* =========================================================
                            STATES
    ========================================================= */

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);


    /* =========================================================
                        FETCH ORDER
    ========================================================= */

    useEffect(() => {

        fetchOrder();

    }, [id]);


    const fetchOrder = async () => {

        try {

            /* =================================================
                            CHECK LOGIN
            ================================================= */

            const user = JSON.parse(
                localStorage.getItem("user")
            );


            if (!user) {

                toast.error(
                    "Please login to view your order."
                );

                navigate("/login");

                return;
            }


            /* =================================================
                    FETCH EXACT ORDER

                The Orders page sends:

                    /orders/${order.id}

                Therefore here we directly request:

                    /orders/${id}

                DO NOT search all orders.
                DO NOT compare userId again.

                This fixes:
                    "You are not authorized to view this order."
            ================================================= */

            console.log(
                "Loading Order ID:",
                id
            );


            const response = await api.get(
                `/orders/${id}`
            );


            /* =================================================
                        CHECK ORDER RESPONSE
            ================================================= */

            if (!response.data) {

                toast.error(
                    "Order not found."
                );

                navigate("/orders");

                return;
            }


            /* =================================================
                        STORE ORDER
            ================================================= */

            console.log(
                "Selected Order:",
                response.data
            );


            setOrder(response.data);

        }

        catch (error) {

            console.error(
                "Order Details Error:",
                error
            );


            toast.error(
                "Unable to load order."
            );


            navigate("/orders");

        }

        finally {

            setLoading(false);

        }

    };


    /* =========================================================
                            LOADING
    ========================================================= */

    if (loading) {

        return (
            <>
                <Navbar />

                <main className="od-page">

                    <div className="od-loading">

                        <div className="od-spinner"></div>

                        <p>
                            Loading Order Details...
                        </p>

                    </div>

                </main>

                <Footer />
            </>
        );
    }


    /* =========================================================
                        ORDER NOT FOUND
    ========================================================= */

    if (!order) {

        return null;

    }


    /* =========================================================
                    NORMALIZE ORDER DATA
    ========================================================= */

    const items =
        Array.isArray(order.items)
            ? order.items
            : Array.isArray(order.products)
                ? order.products
                : [];


    const status =
        order.status ||
        order.orderStatus ||
        "Order Placed";


    const orderId =
        order.orderId ||
        order.id ||
        id;


    const orderDate =
        order.orderDate ||
        order.createdAt ||
        "N/A";


    /* =========================================================
                        CUSTOMER DETAILS
    ========================================================= */

    const customerName =
        order.customer?.fullName ||
        order.customer?.name ||
        order.customerName ||
        order.fullName ||
        "N/A";


    const customerPhone =
        order.customer?.phone ||
        order.customer?.mobile ||
        order.phone ||
        order.mobile ||
        "N/A";


    const customerEmail =
        order.customer?.email ||
        order.email ||
        "N/A";


    /* =========================================================
                        DELIVERY ADDRESS
    ========================================================= */

    const addressName =
        order.address?.fullName ||
        order.address?.name ||
        customerName;


    const addressMobile =
        order.address?.mobile ||
        order.address?.phone ||
        customerPhone;


    const house =
        order.address?.house ||
        order.address?.houseNo ||
        "";


    const street =
        order.address?.street ||
        order.address?.address ||
        "";


    const landmark =
        order.address?.landmark ||
        "";


    const city =
        order.address?.city ||
        "";


    const state =
        order.address?.state ||
        "";


    const pincode =
        order.address?.pincode ||
        order.address?.zip ||
        "";


    /*
        Some older orders may have address stored
        directly as a string.
    */

    const flatAddress =
        typeof order.address === "string"
            ? order.address
            : "";


    /* =========================================================
                        BILL VALUES
    ========================================================= */

    const calculatedSubtotal =
        items.reduce(
            (sum, item) => {

                const price =
                    Number(
                        item.price ??
                        item.discountPrice ??
                        0
                    );


                const quantity =
                    Number(
                        item.quantity ?? 1
                    );


                return (
                    sum +
                    price * quantity
                );

            },
            0
        );


    const subtotal =
        Number(order.subtotal) ||
        calculatedSubtotal;


    const shipping =
        Number(order.shipping) || 0;


    const discount =
        Number(order.discount) || 0;


    const gst =
        Number(order.gst) || 0;


    const codCharge =
        Number(order.codCharge) || 0;


    const calculatedTotal =
        subtotal +
        shipping +
        gst +
        codCharge -
        discount;


    const total =
        Number(order.total) ||
        calculatedTotal;


    /* =========================================================
                        PAYMENT METHOD
    ========================================================= */

    const getPaymentMethod = () => {

        const method =
            String(
                order.paymentMethod || ""
            ).toLowerCase();


        if (
            method === "cod" ||
            method === "cash on delivery"
        ) {

            return "Cash on Delivery";

        }


        if (method === "upi") {

            return "UPI";

        }


        if (
            method === "card" ||
            method === "credit card" ||
            method === "debit card"
        ) {

            return "Credit / Debit Card";

        }


        if (
            method === "netbanking" ||
            method === "net banking"
        ) {

            return "Net Banking";

        }


        if (method === "wallet") {

            return "Wallet";

        }


        return order.paymentMethod || "N/A";

    };


    /* =========================================================
                        STATUS CLASS
    ========================================================= */

    const getStatusClass = () => {

        const normalized =
            String(status)
                .toLowerCase()
                .replace(/\s+/g, "-");


        if (normalized === "delivered") {

            return "delivered";

        }


        if (
            normalized === "cancelled" ||
            normalized === "canceled"
        ) {

            return "cancelled";

        }


        if (normalized === "shipped") {

            return "shipped";

        }


        if (normalized === "processing") {

            return "processing";

        }


        return "pending";

    };


    /* =========================================================
                            ACTIONS
    ========================================================= */

    const handleTrackOrder = () => {

        navigate(
            `/track-order/${orderId}`
        );

    };


    const handleReturnExchange = () => {

        navigate(
            `/return-exchange/${orderId}`
        );

    };


    const handleCancelOrder = () => {

        navigate(
            `/cancel-order/${orderId}`
        );

    };


    const handleInvoice = () => {

        navigate(
            `/invoice/${orderId}`
        );

    };


    const handleReview = (productId) => {

        navigate(
            `/review/${orderId}/${productId}`
        );

    };


    /* =========================================================
                            RENDER
    ========================================================= */

    return (
        <>

            <Navbar />


            <main className="od-page">

                <div className="od-container">


                    {/* =================================================
                                TOP HEADER
                    ================================================= */}

                    <div className="od-top-header">

                        <button
                            type="button"
                            className="od-back-btn"
                            onClick={() =>
                                navigate("/orders")
                            }
                        >
                            ← Back to Orders
                        </button>


                        <div className="od-title-row">

                            <div>

                                <h1>
                                    Order Details
                                </h1>


                                <p>

                                    Order ID:{" "}

                                    <strong>
                                        {orderId}
                                    </strong>

                                </p>

                            </div>


                            <span
                                className={
                                    `od-status ${getStatusClass()}`
                                }
                            >
                                {status}
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                            ORDER INFORMATION
                    ================================================= */}

                    <section className="od-card">

                        <div className="od-card-heading">

                            <span className="od-heading-icon">
                                ▣
                            </span>

                            <h2>
                                Order Information
                            </h2>

                        </div>


                        <div className="od-info-grid">


                            <div className="od-info-item">

                                <span>
                                    Order ID
                                </span>

                                <strong>
                                    {orderId}
                                </strong>

                            </div>


                            <div className="od-info-item">

                                <span>
                                    Order Date
                                </span>

                                <strong>
                                    {orderDate}
                                </strong>

                            </div>


                            <div className="od-info-item">

                                <span>
                                    Payment Method
                                </span>

                                <strong>
                                    {getPaymentMethod()}
                                </strong>

                            </div>


                            <div className="od-info-item">

                                <span>
                                    Grand Total
                                </span>

                                <strong className="od-total-blue">
                                    ₹{total.toFixed(2)}
                                </strong>

                            </div>


                        </div>

                    </section>


                    {/* =================================================
                            CUSTOMER DETAILS
                    ================================================= */}

                    <section className="od-card">

                        <div className="od-card-heading">

                            <span className="od-heading-icon">
                                ●
                            </span>

                            <h2>
                                Customer Details
                            </h2>

                        </div>


                        <div className="od-customer-grid">


                            <div className="od-field">

                                <span>
                                    Full Name
                                </span>

                                <strong>
                                    {customerName}
                                </strong>

                            </div>


                            <div className="od-field">

                                <span>
                                    Phone Number
                                </span>

                                <strong>
                                    {customerPhone}
                                </strong>

                            </div>


                            <div className="od-field">

                                <span>
                                    Email Address
                                </span>

                                <strong>
                                    {customerEmail}
                                </strong>

                            </div>


                        </div>

                    </section>


                    {/* =================================================
                            DELIVERY ADDRESS
                    ================================================= */}

                    <section className="od-card">

                        <div className="od-card-heading">

                            <span className="od-heading-icon">
                                ●
                            </span>

                            <h2>
                                Delivery Address
                            </h2>

                        </div>


                        <div className="od-address-box">


                            <div className="od-location-icon">
                                ●
                            </div>


                            <div className="od-address-content">

                                <h3>
                                    {addressName}
                                </h3>


                                {addressMobile && (

                                    <p>
                                        {addressMobile}
                                    </p>

                                )}


                                {flatAddress ? (

                                    <p>
                                        {flatAddress}
                                    </p>

                                ) : (

                                    <>


                                        {house && (

                                            <p>
                                                {house}
                                            </p>

                                        )}


                                        {street && (

                                            <p>
                                                {street}
                                            </p>

                                        )}


                                        {landmark && (

                                            <p>
                                                {landmark}
                                            </p>

                                        )}


                                        {(city ||
                                            state ||
                                            pincode) && (

                                            <p>

                                                {city}

                                                {city && state
                                                    ? ", "
                                                    : ""}

                                                {state}

                                                {pincode
                                                    ? ` - ${pincode}`
                                                    : ""}

                                            </p>

                                        )}

                                    </>

                                )}

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                            ORDERED PRODUCTS
                    ================================================= */}

                    <section className="od-card">

                        <div className="od-card-heading od-products-heading">

                            <div className="od-heading-left">

                                <span className="od-heading-icon">
                                    ▣
                                </span>

                                <h2>
                                    Ordered Products
                                </h2>

                            </div>


                            <span className="od-item-count">

                                {items.length}{" "}

                                {items.length === 1
                                    ? "Item"
                                    : "Items"}

                            </span>

                        </div>


                        {items.length === 0 ? (

                            <div className="od-empty">

                                No products found.

                            </div>

                        ) : (

                            <div className="od-products">

                                {items.map(
                                    (item, index) => {

                                        const productId =
                                            item.productId ||
                                            item.product_id ||
                                            item.id ||
                                            index;


                                        const itemPrice =
                                            Number(
                                                item.price ??
                                                item.discountPrice ??
                                                0
                                            );


                                        const quantity =
                                            Number(
                                                item.quantity ?? 1
                                            );


                                        const itemTotal =
                                            itemPrice *
                                            quantity;


                                        /*
                                            Support both:

                                            image:
                                            "image.jpg"

                                            and:

                                            images:
                                            ["image1.jpg", "image2.jpg"]
                                        */

                                        let productImage =
                                            item.image ||
                                            item.images ||
                                            "";


                                        if (
                                            Array.isArray(
                                                productImage
                                            )
                                        ) {

                                            productImage =
                                                productImage[0] ||
                                                "";

                                        }


                                        return (

                                            <div
                                                className="od-product-row"
                                                key={
                                                    `${productId}-${index}`
                                                }
                                            >


                                                {/* PRODUCT LEFT */}

                                                <div className="od-product-left">


                                                    <div className="od-product-image">

                                                        {productImage ? (

                                                            <img
                                                                src={
                                                                    productImage
                                                                }
                                                                alt={
                                                                    item.name ||
                                                                    "Product"
                                                                }
                                                                onError={(
                                                                    e
                                                                ) => {

                                                                    e.currentTarget.style.display =
                                                                        "none";

                                                                    e.currentTarget.parentElement.classList.add(
                                                                        "od-image-fallback"
                                                                    );

                                                                }}
                                                            />

                                                        ) : (

                                                            <span>
                                                                🛍
                                                            </span>

                                                        )}

                                                    </div>


                                                    <div className="od-product-info">

                                                        <h3>
                                                            {item.name ||
                                                                "Product"}
                                                        </h3>


                                                        <p>
                                                            Quantity:{" "}
                                                            {quantity}
                                                        </p>


                                                        <span>
                                                            Unit Price: ₹
                                                            {itemPrice.toFixed(
                                                                2
                                                            )}
                                                        </span>

                                                    </div>


                                                </div>


                                                {/* PRODUCT RIGHT */}

                                                <div className="od-product-right">


                                                    <strong className="od-product-total">

                                                        ₹
                                                        {itemTotal.toFixed(
                                                            2
                                                        )}

                                                    </strong>


                                                    {/* REVIEW BUTTON */}

                                                    {String(status)
                                                        .toLowerCase() ===
                                                        "delivered" && (

                                                        <button
                                                            type="button"
                                                            className="od-review-btn"
                                                            onClick={() =>
                                                                handleReview(
                                                                    productId
                                                                )
                                                            }
                                                        >
                                                            ★ Write Review
                                                        </button>

                                                    )}


                                                </div>


                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </section>


                    {/* =================================================
                            BILL SUMMARY
                    ================================================= */}

                    <section className="od-card od-bill-card">

                        <div className="od-card-heading">

                            <span className="od-heading-icon">
                                ▣
                            </span>

                            <h2>
                                Bill Summary
                            </h2>

                        </div>


                        <div className="od-bill">


                            {/* SUBTOTAL */}

                            <div className="od-bill-row">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹{subtotal.toFixed(2)}
                                </strong>

                            </div>


                            {/* SHIPPING */}

                            <div className="od-bill-row">

                                <span>
                                    Shipping
                                </span>

                                <strong>

                                    {shipping === 0
                                        ? "FREE"
                                        : `₹${shipping.toFixed(2)}`}

                                </strong>

                            </div>


                            {/* DISCOUNT */}

                            {discount > 0 && (

                                <div className="od-bill-row">

                                    <span>
                                        Discount
                                    </span>

                                    <strong className="od-discount">

                                        -₹
                                        {discount.toFixed(2)}

                                    </strong>

                                </div>

                            )}


                            {/* COUPON */}

                            {order.coupon?.code && (

                                <div className="od-bill-row">

                                    <span>
                                        Coupon
                                    </span>

                                    <strong>
                                        {order.coupon.code}
                                    </strong>

                                </div>

                            )}


                            {/* GST */}

                            <div className="od-bill-row">

                                <span>
                                    GST (18%)
                                </span>

                                <strong>
                                    ₹{gst.toFixed(2)}
                                </strong>

                            </div>


                            {/* COD CHARGE */}

                            {codCharge > 0 && (

                                <div className="od-bill-row">

                                    <span>
                                        COD Charge
                                    </span>

                                    <strong>
                                        ₹
                                        {codCharge.toFixed(2)}
                                    </strong>

                                </div>

                            )}


                            <div className="od-bill-divider"></div>


                            {/* GRAND TOTAL */}

                            <div className="od-grand-total">

                                <span>
                                    Grand Total
                                </span>

                                <strong>
                                    ₹{total.toFixed(2)}
                                </strong>

                            </div>


                        </div>

                    </section>


                    {/* =================================================
                            ACTION BUTTONS
                    ================================================= */}

                    <div className="od-actions">


                        {/* TRACK ORDER */}

                        {String(status).toLowerCase() !==
                            "cancelled" && (

                            <button
                                type="button"
                                className="od-action-btn od-track-btn"
                                onClick={
                                    handleTrackOrder
                                }
                            >
                                Track Order
                            </button>

                        )}


                        {/* RETURN / EXCHANGE */}

                        {String(status).toLowerCase() ===
                            "delivered" && (

                            <button
                                type="button"
                                className="od-action-btn od-return-btn"
                                onClick={
                                    handleReturnExchange
                                }
                            >
                                Return / Exchange
                            </button>

                        )}


                        {/* CANCEL ORDER */}

                        {String(status).toLowerCase() !==
                            "delivered" &&

                            String(status).toLowerCase() !==
                                "cancelled" && (

                                <button
                                    type="button"
                                    className="od-action-btn od-cancel-btn"
                                    onClick={
                                        handleCancelOrder
                                    }
                                >
                                    Cancel Order
                                </button>

                            )}


                        {/* INVOICE */}

                        <button
                            type="button"
                            className="od-action-btn od-invoice-btn"
                            onClick={
                                handleInvoice
                            }
                        >
                            View Invoice
                        </button>


                        {/* CONTINUE SHOPPING */}

                        <button
                            type="button"
                            className="od-action-btn od-shopping-btn"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Continue Shopping
                        </button>


                    </div>


                </div>

            </main>


            <Footer />

        </>
    );
}


export default OrderDetails;