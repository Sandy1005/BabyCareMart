import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaCheckCircle,
    FaStar,
    FaRegStar,
    FaShoppingBag
} from "react-icons/fa";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import api from "../../services/api";

import "../../styles/Customer/ReviewProduct.css";

function ReviewProduct() {

    const { orderId, productId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [product, setProduct] = useState(null);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [alreadyReviewed, setAlreadyReviewed] = useState(false);

    const [error, setError] = useState("");

    /* ==========================================
                    GET CURRENT USER
    ========================================== */

    const getCurrentUser = () => {

        const possibleKeys = [
            "user",
            "currentUser",
            "loggedInUser",
            "authUser"
        ];

        for (const key of possibleKeys) {

            try {

                const stored = localStorage.getItem(key);

                if (stored) {
                    return JSON.parse(stored);
                }

            } catch {
                // Ignore invalid localStorage values
            }
        }

        return null;
    };

    /* ==========================================
                    FETCH ORDER
    ========================================== */

    useEffect(() => {
        fetchOrder();
    }, [orderId, productId]);

    const fetchOrder = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/orders/${orderId}`
            );

            const fetchedOrder = response.data;

            setOrder(fetchedOrder);

            /* ======================================
                    CHECK DELIVERY STATUS
            ====================================== */

            const orderStatus =
                fetchedOrder.status ||
                fetchedOrder.orderStatus ||
                "";

            if (
                orderStatus.toLowerCase() !==
                "delivered"
            ) {

                setError(
                    "You can review a product only after the order has been delivered."
                );

                return;
            }

            /* ======================================
                    FIND PRODUCT INSIDE ORDER
            ====================================== */

            const orderedProducts =
                fetchedOrder.products || [];

            const selectedProduct =
                orderedProducts.find(
                    (item) =>
                        String(item.id) ===
                        String(productId)
                );

            if (!selectedProduct) {

                setError(
                    "This product was not found in the selected order."
                );

                return;
            }

            setProduct(selectedProduct);

            /* ======================================
                    CHECK EXISTING REVIEW
            ====================================== */

            const currentUser = getCurrentUser();

            const userId =
                currentUser?.id ||
                fetchedOrder.userId ||
                "";

            try {

                const reviewResponse =
                    await api.get(
                        `/reviews?orderId=${orderId}&productId=${productId}`
                    );

                const existingReviews =
                    reviewResponse.data || [];

                const userAlreadyReviewed =
                    existingReviews.some(
                        (item) =>
                            String(item.userId) ===
                            String(userId)
                    );

                setAlreadyReviewed(
                    userAlreadyReviewed
                );

            } catch {
                // Reviews collection may not exist yet
                setAlreadyReviewed(false);
            }

        } catch (error) {

            console.error(
                "Unable to load review page:",
                error
            );

            setError(
                "Unable to load the order. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    /* ==========================================
                    SUBMIT REVIEW
    ========================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (rating === 0) {

            setError(
                "Please select a rating before submitting."
            );

            return;
        }

        if (!title.trim()) {

            setError(
                "Please enter a review title."
            );

            return;
        }

        if (!review.trim()) {

            setError(
                "Please write your review."
            );

            return;
        }

        if (review.trim().length < 10) {

            setError(
                "Your review should contain at least 10 characters."
            );

            return;
        }

        if (alreadyReviewed) {

            setError(
                "You have already reviewed this product."
            );

            return;
        }

        try {

            setSubmitting(true);

            const currentUser = getCurrentUser();

            const userId =
                currentUser?.id ||
                order?.userId ||
                "";

            const userName =
                currentUser?.name ||
                currentUser?.fullName ||
                order?.customerName ||
                "Customer";

            /* ======================================
                    FINAL REVIEW OBJECT
            ====================================== */

            const reviewData = {

                id:
                    `REV${Date.now()}`,

                productId:
                    product.id,

                productName:
                    product.name,

                productImage:
                    product.image ||
                    product.images?.[0] ||
                    "",

                orderId:
                    order.id,

                userId:
                    userId,

                userName:
                    userName,

                rating:
                    Number(rating),

                title:
                    title.trim(),

                review:
                    review.trim(),

                verifiedPurchase:
                    true,

                status:
                    "Published",

                reviewDate:
                    new Date().toISOString()
            };

            await api.post(
                "/reviews",
                reviewData
            );

            /* ======================================
                    SUCCESS
            ====================================== */

            alert(
                "Thank you! Your review has been submitted successfully."
            );

            navigate(
                `/orders/${order.id}`
            );

        } catch (error) {

            console.error(
                "Review submission failed:",
                error
            );

            setError(
                "Unable to submit your review. Please try again."
            );

        } finally {

            setSubmitting(false);
        }
    };

    /* ==========================================
                    LOADING
    ========================================== */

    if (loading) {

        return (
            <>
                <Navbar />

                <main className="review-page">

                    <div className="review-loading">

                        <div className="review-loader"></div>

                        <h2>
                            Loading Review...
                        </h2>

                        <p>
                            Preparing your product review.
                        </p>

                    </div>

                </main>

                <Footer />
            </>
        );
    }

    /* ==========================================
                    ERROR
    ========================================== */

    if (error && !product) {

        return (
            <>
                <Navbar />

                <main className="review-page">

                    <div className="review-error-card">

                        <div className="error-icon">
                            !
                        </div>

                        <h2>
                            Unable to Review Product
                        </h2>

                        <p>
                            {error}
                        </p>

                        <Link
                            to={
                                order
                                    ? `/orders/${order.id}`
                                    : "/orders"
                            }
                            className="review-back-btn"
                        >
                            <FaArrowLeft />
                            Back to Order
                        </Link>

                    </div>

                </main>

                <Footer />
            </>
        );
    }

    /* ==========================================
                ALREADY REVIEWED
    ========================================== */

    if (alreadyReviewed) {

        return (
            <>
                <Navbar />

                <main className="review-page">

                    <div className="already-reviewed-card">

                        <div className="success-icon">
                            <FaCheckCircle />
                        </div>

                        <h1>
                            Review Already Submitted
                        </h1>

                        <p>
                            You have already reviewed this
                            product from this order.
                        </p>

                        <div className="already-product">

                            <img
                                src={
                                    product?.image ||
                                    product?.images?.[0]
                                }
                                alt={product?.name}
                            />

                            <div>
                                <strong>
                                    {product?.name}
                                </strong>

                                <span>
                                    Verified Purchase
                                </span>
                            </div>

                        </div>

                        <div className="review-actions">

                            <Link
                                to={`/orders/${order?.id}`}
                                className="primary-review-btn"
                            >
                                <FaArrowLeft />
                                Back to Order
                            </Link>

                            <Link
                                to="/products"
                                className="secondary-review-btn"
                            >
                                <FaShoppingBag />
                                Continue Shopping
                            </Link>

                        </div>

                    </div>

                </main>

                <Footer />
            </>
        );
    }

    /* ==========================================
                    MAIN UI
    ========================================== */

    return (
        <>
            <Navbar />

            <main className="review-page">

                <div className="review-container">

                    {/* ==================================
                            HEADER
                    ================================== */}

                    <div className="review-header">

                        <Link
                            to={`/orders/${order?.id}`}
                            className="review-back-link"
                        >
                            <FaArrowLeft />
                            Back to Order
                        </Link>

                        <div className="review-title">

                            <span className="review-label">
                                VERIFIED PURCHASE
                            </span>

                            <h1>
                                Write a Review
                            </h1>

                            <p>
                                Share your experience with this product
                                and help other parents make better choices.
                            </p>

                        </div>

                    </div>

                    {/* ==================================
                            CONTENT
                    ================================== */}

                    <div className="review-layout">

                        {/* ==================================
                                PRODUCT CARD
                        ================================== */}

                        <section className="review-product-card">

                            <div className="product-image-wrapper">

                                <img
                                    src={
                                        product?.image ||
                                        product?.images?.[0]
                                    }
                                    alt={product?.name}
                                />

                            </div>

                            <div className="review-product-info">

                                <span>
                                    Purchased Product
                                </span>

                                <h2>
                                    {product?.name}
                                </h2>

                                <div className="product-price">
                                    ₹
                                    {Number(
                                        product?.price || 0
                                    ).toFixed(2)}
                                </div>

                                <div className="verified-badge">

                                    <FaCheckCircle />

                                    Verified Purchase

                                </div>

                                <div className="order-reference">

                                    <span>
                                        Order ID
                                    </span>

                                    <strong>
                                        #{order?.id}
                                    </strong>

                                </div>

                            </div>

                        </section>

                        {/* ==================================
                                REVIEW FORM
                        ================================== */}

                        <section className="review-form-card">

                            <div className="form-heading">

                                <span>
                                    YOUR EXPERIENCE
                                </span>

                                <h2>
                                    How was your experience?
                                </h2>

                            </div>

                            {error && (

                                <div className="review-form-error">
                                    {error}
                                </div>

                            )}

                            <form
                                onSubmit={handleSubmit}
                            >

                                {/* =========================
                                        RATING
                                ========================= */}

                                <div className="rating-section">

                                    <label>
                                        Overall Rating
                                    </label>

                                    <div className="star-rating">

                                        {[1, 2, 3, 4, 5].map(
                                            (star) => {

                                                const active =
                                                    star <=
                                                    (
                                                        hoverRating ||
                                                        rating
                                                    );

                                                return (

                                                    <button
                                                        type="button"
                                                        key={star}
                                                        className={
                                                            active
                                                                ? "star active"
                                                                : "star"
                                                        }
                                                        onMouseEnter={() =>
                                                            setHoverRating(
                                                                star
                                                            )
                                                        }
                                                        onMouseLeave={() =>
                                                            setHoverRating(
                                                                0
                                                            )
                                                        }
                                                        onClick={() =>
                                                            setRating(
                                                                star
                                                            )
                                                        }
                                                        aria-label={
                                                            `${star} star`
                                                        }
                                                    >

                                                        {active ? (
                                                            <FaStar />
                                                        ) : (
                                                            <FaRegStar />
                                                        )}

                                                    </button>

                                                );
                                            }
                                        )}

                                    </div>

                                    <div className="rating-text">

                                        {rating === 0
                                            ? "Select your rating"
                                            : rating === 1
                                                ? "Poor"
                                                : rating === 2
                                                    ? "Below Average"
                                                    : rating === 3
                                                        ? "Good"
                                                        : rating === 4
                                                            ? "Very Good"
                                                            : "Excellent"
                                        }

                                    </div>

                                </div>

                                {/* =========================
                                        TITLE
                                ========================= */}

                                <div className="form-group">

                                    <label htmlFor="review-title">
                                        Review Title
                                    </label>

                                    <input
                                        id="review-title"
                                        type="text"
                                        placeholder="Example: Great quality and value"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(
                                                e.target.value
                                            )
                                        }
                                        maxLength={80}
                                    />

                                    <small>
                                        {title.length}/80
                                    </small>

                                </div>

                                {/* =========================
                                        REVIEW
                                ========================= */}

                                <div className="form-group">

                                    <label htmlFor="review">
                                        Your Review
                                    </label>

                                    <textarea
                                        id="review"
                                        rows="7"
                                        placeholder="Tell us what you liked or disliked about the product..."
                                        value={review}
                                        onChange={(e) =>
                                            setReview(
                                                e.target.value
                                            )
                                        }
                                        maxLength={1000}
                                    />

                                    <small>
                                        {review.length}/1000
                                    </small>

                                </div>

                                {/* =========================
                                        SUBMIT
                                ========================= */}

                                <button
                                    type="submit"
                                    className="submit-review-btn"
                                    disabled={submitting}
                                >

                                    {submitting ? (
                                        <>
                                            <span className="button-loader"></span>
                                            Submitting Review...
                                        </>
                                    ) : (
                                        <>
                                            <FaStar />
                                            Submit Review
                                        </>
                                    )}

                                </button>

                            </form>

                            <div className="review-note">

                                <FaCheckCircle />

                                <span>
                                    Your review will be marked as a
                                    <strong> Verified Purchase </strong>
                                    because this product was purchased
                                    through BabyCareMart.
                                </span>

                            </div>

                        </section>

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}

export default ReviewProduct;