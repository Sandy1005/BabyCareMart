import { useEffect, useMemo, useState } from "react";

import {
    FaSearch,
    FaEye,
    FaTruck,
    FaFileInvoice,
    FaStar,
    FaTimesCircle
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import api from "../../services/api";

import "../../styles/Customer/MyOrders.css";


function MyOrders() {

    /*==========================================
                    CURRENT USER
    ==========================================*/

    const navigate = useNavigate();

    const currentUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );


    /*==========================================
                    STATES
    ==========================================*/

    const [orders, setOrders] = useState([]);

    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    const [showReviewModal, setShowReviewModal] =
        useState(false);

    const [showCancelModal, setShowCancelModal] =
        useState(false);

    const [rating, setRating] = useState(5);

    const [comment, setComment] = useState("");


    /*==========================================
                LOAD ORDERS
    ==========================================*/

    useEffect(() => {

        if (!currentUser) {

            navigate("/login");

            return;
        }

        loadOrders();

    }, []);


    /*==========================================
                NORMALIZE ORDER
    ==========================================*/

    const normalizeOrder = (order) => {

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
            "N/A";


        const paymentStatus =
            order.paymentStatus ||
            (
                order.paymentMethod ===
                "Cash On Delivery"
                    ? "Pending"
                    : "Success"
            );


        return {

            ...order,

            displayOrderId: orderId,

            displayStatus: status,

            items,

            paymentStatus,

            total:
                Number(order.total || 0)

        };

    };


    /*==========================================
                FETCH ORDERS
    ==========================================*/

    const loadOrders = async () => {

        try {

            setLoading(true);


            if (!currentUser) {

                navigate("/login");

                return;
            }


            /*
                IMPORTANT:

                Do NOT use:

                /orders?userId=...

                because this project is using
                JSON Server and the existing
                implementation already had
                inconsistent filtering.

                Fetch all orders and filter here.
            */

            const ordersResponse =
                await api.get("/orders");


            const allOrders =
                Array.isArray(
                    ordersResponse.data
                )
                    ? ordersResponse.data
                    : [];


            /*
                Match userId safely.

                Handles:

                1
                "1"
            */

            const userOrders =
                allOrders.filter((order) => {

                    const orderUserId =
                        order.userId ??
                        order.user?.id ??
                        order.customer?.userId;


                    const orderEmail =
                        order.email ??
                        order.customer?.email;


                    const userIdMatches =
                        orderUserId !==
                        undefined &&
                        orderUserId !== null &&
                        String(orderUserId) ===
                        String(currentUser.id);


                    const emailMatches =
                        orderEmail &&
                        currentUser.email &&
                        String(orderEmail)
                            .toLowerCase() ===
                        String(currentUser.email)
                            .toLowerCase();


                    return (
                        userIdMatches ||
                        emailMatches
                    );

                });


            /*
                Normalize every order.

                This converts:

                items -> items
                products -> items

                status -> displayStatus
                orderStatus -> displayStatus
            */

            const normalizedOrders =
                userOrders
                    .map(normalizeOrder)
                    .sort(
                        (a, b) =>
                            new Date(
                                b.orderDate ||
                                b.createdAt ||
                                0
                            ) -
                            new Date(
                                a.orderDate ||
                                a.createdAt ||
                                0
                            )
                    );


            setOrders(
                normalizedOrders
            );


            /*======================================
                    LOAD REVIEWS SEPARATELY
            ======================================*/

            try {

                const reviewsResponse =
                    await api.get("/reviews");

                setReviews(
                    Array.isArray(
                        reviewsResponse.data
                    )
                        ? reviewsResponse.data
                        : []
                );

            }
            catch (reviewError) {

                console.log(
                    "Reviews could not be loaded:",
                    reviewError
                );

                setReviews([]);

            }

        }
        catch (error) {

            console.error(
                "Orders Fetch Error:",
                error
            );

            setOrders([]);

            toast.error(
                "Unable to load orders."
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*==========================================
                SEARCH + FILTER
    ==========================================*/

    const filteredOrders = useMemo(() => {

        return orders.filter((order) => {

            const searchText =
                search
                    .trim()
                    .toLowerCase();


            const orderId =
                String(
                    order.displayOrderId ||
                    ""
                ).toLowerCase();


            const productMatch =
                order.items.some(
                    (item) =>
                        String(
                            item.name || ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )
                );


            const matchesSearch =
                !searchText ||
                orderId.includes(
                    searchText
                ) ||
                productMatch;


            const matchesStatus =
                statusFilter === "All" ||
                order.displayStatus ===
                statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        orders,
        search,
        statusFilter
    ]);


    /*==========================================
                REVIEW CHECK
    ==========================================*/

    const hasReviewed = (productId) => {

        return reviews.some(
            (review) =>
                String(review.userId) ===
                String(currentUser?.id)
                &&
                String(review.productId) ===
                String(productId)
        );

    };


    /*==========================================
                REVIEW MODAL
    ==========================================*/

    const openReviewModal = (order) => {

        setSelectedOrder(order);

        setRating(5);

        setComment("");

        setShowReviewModal(true);

    };


    const closeReviewModal = () => {

        setShowReviewModal(false);

        setSelectedOrder(null);

    };


    /*==========================================
                CANCEL MODAL
    ==========================================*/

    const openCancelModal = (order) => {

        setSelectedOrder(order);

        setShowCancelModal(true);

    };


    const closeCancelModal = () => {

        setSelectedOrder(null);

        setShowCancelModal(false);

    };


    /*==========================================
                    SUBMIT REVIEW
    ==========================================*/

    const submitReview = async () => {

        try {

            const product =
                selectedOrder?.items?.[0];


            if (!product) {

                toast.error(
                    "Product information not found."
                );

                return;
            }


            const review = {

                productId:
                    product.productId ||
                    product.id,

                productName:
                    product.name,

                productImage:
                    product.image,

                userId:
                    currentUser.id,

                customerName:
                    currentUser.name ||
                    currentUser.fullName ||
                    "Customer",

                rating,

                comment,

                reviewDate:
                    new Date()
                        .toLocaleDateString(
                            "en-IN"
                        )

            };


            await api.post(
                "/reviews",
                review
            );


            toast.success(
                "Review submitted successfully!"
            );


            await loadOrders();

            closeReviewModal();

        }
        catch (error) {

            console.error(
                "Review Error:",
                error
            );

            toast.error(
                "Unable to submit review."
            );

        }

    };


    /*==========================================
                    CANCEL ORDER
    ==========================================*/

    const cancelOrder = async () => {

        try {

            if (!selectedOrder) {
                return;
            }


            /*
                Update both fields so that
                old and new order structures
                remain compatible.
            */

            await api.patch(
                `/orders/${selectedOrder.id}`,
                {
                    status: "Cancelled",
                    orderStatus: "Cancelled"
                }
            );


            toast.success(
                "Order cancelled successfully."
            );


            await loadOrders();

            closeCancelModal();

        }
        catch (error) {

            console.error(
                "Cancel Order Error:",
                error
            );

            toast.error(
                "Unable to cancel order."
            );

        }

    };


    /*==========================================
                    LOADING
    ==========================================*/

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="orders-loading">

                    <div className="orders-spinner"></div>

                    <h2>
                        Loading Your Orders...
                    </h2>

                </div>

                <Footer />
            </>
        );

    }


    /*==========================================
                    JSX
    ==========================================*/

    return (
        <>

            <Navbar />


            <main className="my-orders-page">


                {/*==========================================
                            HEADER
                ==========================================*/}

                <section className="orders-hero">

                    <div>

                        <span className="orders-eyebrow">
                            ORDER HISTORY
                        </span>

                        <h1>
                            My Orders
                        </h1>

                        <p>
                            View, track and manage all your orders.
                        </p>

                    </div>


                    <div className="orders-count-card">

                        <span>
                            Total Orders
                        </span>

                        <strong>
                            {orders.length}
                        </strong>

                    </div>

                </section>


                {/*==========================================
                        SEARCH + FILTER
                ==========================================*/}

                <section className="orders-toolbar">

                    <div className="orders-search">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search Order ID or Product..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Orders
                        </option>

                        <option value="Order Placed">
                            Order Placed
                        </option>

                        <option value="Processing">
                            Processing
                        </option>

                        <option value="Packed">
                            Packed
                        </option>

                        <option value="Shipped">
                            Shipped
                        </option>

                        <option value="Out For Delivery">
                            Out For Delivery
                        </option>

                        <option value="Delivered">
                            Delivered
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>

                    </select>

                </section>


                {/*==========================================
                        NO ORDERS
                ==========================================*/}

                {orders.length === 0 ? (

                    <section className="empty-orders">

                        <div className="empty-orders-icon">
                            📦
                        </div>

                        <h2>
                            No Orders Yet
                        </h2>

                        <p>
                            You haven't placed any orders yet.
                            Start shopping and your orders will
                            appear here.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Start Shopping
                        </button>

                    </section>

                ) : filteredOrders.length === 0 ? (

                    <section className="empty-orders">

                        <div className="empty-orders-icon">
                            🔎
                        </div>

                        <h2>
                            No Matching Orders
                        </h2>

                        <p>
                            Try another order ID,
                            product name or status.
                        </p>

                    </section>

                ) : (

                    <section className="orders-list">

                        {filteredOrders.map(
                            (order) => (

                                <article
                                    className="order-card"
                                    key={order.id}
                                >


                                    {/*================================
                                            ORDER HEADER
                                    =================================*/}

                                    <div className="order-card-header">

                                        <div>

                                            <span>
                                                ORDER ID
                                            </span>

                                            <h3>
                                                {order.displayOrderId}
                                            </h3>

                                        </div>


                                        <div>

                                            <span>
                                                ORDER DATE
                                            </span>

                                            <p>
                                                {
                                                    order.orderDate ||
                                                    order.createdAt ||
                                                    "N/A"
                                                }
                                            </p>

                                        </div>


                                        <span
                                            className={
                                                `order-status ${order.displayStatus
                                                    .toLowerCase()
                                                    .replace(
                                                        /\s+/g,
                                                        "-"
                                                    )}`
                                            }
                                        >
                                            {order.displayStatus}
                                        </span>

                                    </div>


                                    {/*================================
                                            PRODUCTS
                                    =================================*/}

                                    <div className="order-products">

                                        {order.items.map(
                                            (item, index) => (

                                                <div
                                                    className="ordered-product"
                                                    key={
                                                        item.id ||
                                                        item.productId ||
                                                        index
                                                    }
                                                >

                                                    <div className="ordered-product-image">

                                                        <img
                                                            src={
                                                                item.image
                                                            }
                                                            alt={
                                                                item.name
                                                            }
                                                        />

                                                    </div>


                                                    <div className="product-info">

                                                        <h4>
                                                            {
                                                                item.name ||
                                                                "Baby Product"
                                                            }
                                                        </h4>

                                                        <p>
                                                            Qty:
                                                            {" "}
                                                            {
                                                                item.quantity ||
                                                                1
                                                            }
                                                        </p>

                                                        <strong>
                                                            ₹
                                                            {
                                                                Number(
                                                                    item.price ||
                                                                    0
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>


                                    {/*================================
                                            SUMMARY
                                    =================================*/}

                                    <div className="order-summary">

                                        <div>

                                            <span>
                                                Payment Method
                                            </span>

                                            <strong>
                                                {
                                                    order.paymentMethod ||
                                                    "N/A"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Payment Status
                                            </span>

                                            <strong className="payment-success">
                                                {
                                                    order.paymentStatus
                                                }
                                            </strong>

                                        </div>


                                        <div className="order-total">

                                            <span>
                                                Total
                                            </span>

                                            <strong>
                                                ₹
                                                {
                                                    order.total.toLocaleString(
                                                        "en-IN"
                                                    )
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    {/*================================
                                            ADDRESS
                                    =================================*/}

                                    <div className="delivery-address">

                                        <div className="address-title">
                                            Delivery Address
                                        </div>

                                        <p>
                                            {
                                                order.address?.fullName ||
                                                order.customer?.fullName ||
                                                currentUser?.name ||
                                                ""
                                            }
                                        </p>

                                        <p>
                                            {
                                                order.address?.house ||
                                                order.address?.houseNo ||
                                                ""
                                            }
                                            {", "}
                                            {
                                                order.address?.street ||
                                                ""
                                            }
                                        </p>

                                        <p>
                                            {
                                                order.address?.city ||
                                                ""
                                            }
                                            {", "}
                                            {
                                                order.address?.state ||
                                                ""
                                            }
                                            {" - "}
                                            {
                                                order.address?.pincode ||
                                                ""
                                            }
                                        </p>

                                    </div>


                                    {/*================================
                                            ACTIONS
                                    =================================*/}

                                    <div className="order-actions">

                                        <Link
                                            to={`/orders/${order.id}`}
                                            className="action-btn view-btn"
                                        >
                                            <FaEye />
                                            View Details
                                        </Link>


                                        <Link
                                            to={`/invoice/${order.id}`}
                                            className="action-btn invoice-btn"
                                        >
                                            <FaFileInvoice />
                                            Invoice
                                        </Link>


                                        <Link
                                            to={`/track-order/${order.id}`}
                                            className="action-btn track-btn"
                                        >
                                            <FaTruck />
                                            Track Order
                                        </Link>


                                        {
                                            order.displayStatus !==
                                                "Cancelled"
                                            &&
                                            order.displayStatus !==
                                                "Delivered"
                                            && (

                                                <button
                                                    type="button"
                                                    className="action-btn cancel-btn"
                                                    onClick={() =>
                                                        openCancelModal(
                                                            order
                                                        )
                                                    }
                                                >
                                                    <FaTimesCircle />
                                                    Cancel
                                                </button>

                                            )
                                        }


                                        {
                                            order.displayStatus ===
                                                "Delivered"
                                            &&
                                            order.items.length > 0
                                            &&
                                            !hasReviewed(
                                                order.items[0].productId ||
                                                order.items[0].id
                                            )
                                            && (

                                                <button
                                                    type="button"
                                                    className="action-btn review-btn"
                                                    onClick={() =>
                                                        openReviewModal(
                                                            order
                                                        )
                                                    }
                                                >
                                                    <FaStar />
                                                    Write Review
                                                </button>

                                            )
                                        }


                                        {
                                            order.displayStatus ===
                                                "Delivered"
                                            &&
                                            order.items.length > 0
                                            &&
                                            hasReviewed(
                                                order.items[0].productId ||
                                                order.items[0].id
                                            )
                                            && (

                                                <button
                                                    type="button"
                                                    className="action-btn reviewed-btn"
                                                    disabled
                                                >
                                                    ★ Reviewed
                                                </button>

                                            )
                                        }

                                    </div>

                                </article>

                            )
                        )}

                    </section>

                )}


            </main>


            {/*==========================================
                    REVIEW MODAL
            ==========================================*/}

            {
                showReviewModal &&
                selectedOrder && (

                    <div className="modal-overlay">

                        <div className="review-modal">

                            <button
                                type="button"
                                className="modal-close"
                                onClick={
                                    closeReviewModal
                                }
                            >
                                ×
                            </button>

                            <h2>
                                Write Review
                            </h2>

                            <img
                                src={
                                    selectedOrder.items?.[0]?.image
                                }
                                alt=""
                            />

                            <h3>
                                {
                                    selectedOrder.items?.[0]?.name
                                }
                            </h3>


                            <label>
                                Rating
                            </label>

                            <select
                                value={rating}
                                onChange={(e) =>
                                    setRating(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            >

                                <option value="5">
                                    ★★★★★
                                </option>

                                <option value="4">
                                    ★★★★☆
                                </option>

                                <option value="3">
                                    ★★★☆☆
                                </option>

                                <option value="2">
                                    ★★☆☆☆
                                </option>

                                <option value="1">
                                    ★☆☆☆☆
                                </option>

                            </select>


                            <textarea
                                rows="5"
                                placeholder="Share your experience..."
                                value={comment}
                                onChange={(e) =>
                                    setComment(
                                        e.target.value
                                    )
                                }
                            />


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={
                                        closeReviewModal
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="primary-btn"
                                    onClick={
                                        submitReview
                                    }
                                >
                                    Submit Review
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }


            {/*==========================================
                    CANCEL MODAL
            ==========================================*/}

            {
                showCancelModal &&
                selectedOrder && (

                    <div className="modal-overlay">

                        <div className="cancel-modal">

                            <h2>
                                Cancel Order
                            </h2>

                            <p>
                                Are you sure you want to cancel
                                <strong>
                                    {" "}
                                    {
                                        selectedOrder.displayOrderId
                                    }
                                </strong>
                                ?
                            </p>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={
                                        closeCancelModal
                                    }
                                >
                                    No
                                </button>

                                <button
                                    type="button"
                                    className="danger-btn"
                                    onClick={
                                        cancelOrder
                                    }
                                >
                                    Yes, Cancel Order
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }


            <Footer />

        </>
    );
}


export default MyOrders;