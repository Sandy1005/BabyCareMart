import React, {
    useEffect,
    useState
} from "react";

import {
    FaPen,
    FaCheckCircle,
    FaLock,
    FaHeart
} from "react-icons/fa";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    toast
} from "react-toastify";

import api from "../../services/api";

import "../../styles/Customer/Review.css";


const Review = () => {

    const {
        orderId,
        productId
    } = useParams();

    const navigate =
        useNavigate();


    /* =========================================================
       CURRENT USER
    ========================================================= */

    const currentUser =
        JSON.parse(
            localStorage.getItem("user") || "null"
        );


    /* =========================================================
       STATES
    ========================================================= */

    const [rating, setRating] =
        useState(0);

    const [hoverRating, setHoverRating] =
        useState(0);

    const [title, setTitle] =
        useState("");

    const [review, setReview] =
        useState("");

    const [submitted, setSubmitted] =
        useState(false);

    const [loadingProduct, setLoadingProduct] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);


    /* =========================================================
       PRODUCT
    ========================================================= */

    const [product, setProduct] =
        useState({
            name: "Product",
            image: "",
            price: 0
        });


    /* =========================================================
       LOAD PRODUCT
    ========================================================= */

    useEffect(() => {

        const loadProduct = async () => {

            try {

                setLoadingProduct(true);


                const response =
                    await api.get(
                        `/products/${productId}`
                    );


                const data =
                    response.data;


                setProduct({

                    name:
                        data.name ||
                        data.title ||
                        "Product",

                    image:
                        data.image ||
                        data.imageUrl ||
                        (
                            Array.isArray(
                                data.images
                            )
                                ? data.images[0]
                                : ""
                        ),

                    price:
                        data.discountPrice ||
                        data.price ||
                        0

                });

            }
            catch (error) {

                console.error(
                    "Unable to load product:",
                    error
                );

                toast.error(
                    "Unable to load product information."
                );

            }
            finally {

                setLoadingProduct(false);

            }

        };


        if (productId) {

            loadProduct();

        }

    }, [productId]);


    /* =========================================================
       RATING TEXT
    ========================================================= */

    const ratingText = {

        0: "Select a rating",

        1: "Poor",

        2: "Below Average",

        3: "Good",

        4: "Very Good",

        5: "Excellent"

    };


    /* =========================================================
       SUBMIT REVIEW
    ========================================================= */

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!currentUser) {

            toast.error(
                "Please login before submitting a review."
            );

            navigate("/login");

            return;

        }


        if (rating === 0) {

            toast.error(
                "Please select a rating."
            );

            return;

        }


        if (!title.trim()) {

            toast.error(
                "Please enter a review title."
            );

            return;

        }


        if (!review.trim()) {

            toast.error(
                "Please write a review."
            );

            return;

        }


        try {

            setSubmitting(true);


            const reviewData = {

                id:
                    `REV${Date.now()}`,

                userId:
                    currentUser.id,

                orderId:
                    orderId,

                productId:
                    productId,

                productName:
                    product.name,

                productImage:
                    product.image,

                title:
                    title.trim(),

                rating:
                    rating,

                review:
                    review.trim(),

                reviewDate:
                    new Date().toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    ),

                createdAt:
                    new Date().toISOString()

            };


            await api.post(
                "/reviews",
                reviewData
            );


            setSubmitted(true);


            toast.success(
                "Review submitted successfully!"
            );

        }
        catch (error) {

            console.error(
                "Unable to submit review:",
                error
            );


            if (error.response) {

                console.error(
                    "Backend response:",
                    error.response.data
                );

            }


            toast.error(
                "Unable to submit review. Please try again."
            );

        }
        finally {

            setSubmitting(false);

        }

    };


    /* =========================================================
       NAVIGATION
    ========================================================= */

    const handleBackToOrder = () => {

        navigate(
            `/orders/${orderId}`
        );

    };


    const handleViewOrders = () => {

        navigate("/orders");

    };


    /* =========================================================
       SUCCESS SCREEN
    ========================================================= */

    if (submitted) {

        return (

            <div className="review-page">

                <div className="review-success-card">

                    <div className="success-icon">

                        <FaCheckCircle />

                    </div>


                    <span className="success-eyebrow">
                        REVIEW SUBMITTED
                    </span>


                    <h1>
                        Thank You!
                    </h1>


                    <p className="success-title">
                        Your review has been submitted successfully.
                    </p>


                    <p className="success-text">
                        Your feedback helps other parents
                        make better shopping decisions.
                    </p>


                    <div className="submitted-rating">

                        {[1, 2, 3, 4, 5].map(
                            star => (

                                <span
                                    key={star}
                                    className={
                                        star <= rating
                                            ? "star active"
                                            : "star"
                                    }
                                >
                                    ★
                                </span>

                            )
                        )}

                    </div>


                    <div className="success-actions">

                        <button
                            type="button"
                            className="review-primary-btn"
                            onClick={
                                handleViewOrders
                            }
                        >
                            View My Orders
                        </button>


                        <button
                            type="button"
                            className="review-secondary-btn"
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    /* =========================================================
       MAIN PAGE
    ========================================================= */

    return (

        <div className="review-page">

            <div className="review-container">


                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <button
                    type="button"
                    className="review-back-btn"
                    onClick={
                        handleBackToOrder
                    }
                >
                    ← Back to Order
                </button>


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="review-header">

                    <div className="review-header-content">

                        <span className="review-eyebrow">
                            SHARE YOUR EXPERIENCE
                        </span>


                        <h1>
                            Write a Review
                        </h1>


                        <p>
                            Tell us what you think about your purchase.
                        </p>

                    </div>


                    <div className="review-order-id">

                        <span>
                            ORDER
                        </span>

                        <strong>
                            #{orderId}
                        </strong>

                    </div>

                </div>


                <div className="review-content">


                    {/* =================================================
                        PRODUCT CARD
                    ================================================= */}

                    <div className="review-product-card">

                        <div className="product-image-wrapper">

                            {loadingProduct ? (

                                <div className="product-placeholder">
                                    Loading...
                                </div>

                            ) : product.image ? (

                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="review-product-image"
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            "none";
                                    }}
                                />

                            ) : (

                                <div className="product-placeholder">
                                    🧸
                                </div>

                            )}

                        </div>


                        <div className="review-product-info">

                            <span className="product-label">
                                PURCHASED PRODUCT
                            </span>


                            <h2>
                                {product.name}
                            </h2>


                            {product.price > 0 && (

                                <p className="product-price">
                                    ₹
                                    {Number(
                                        product.price
                                    ).toFixed(2)}
                                </p>

                            )}


                            <div className="verified-purchase">

                                <FaCheckCircle />

                                Verified Purchase

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        REVIEW FORM
                    ================================================= */}

                    <form
                        className="review-form-card"
                        onSubmit={
                            handleSubmit
                        }
                    >


                        {/* =================================================
                            RATING
                        ================================================= */}

                        <div className="form-section">

                            <div className="form-label-row">

                                <label>
                                    How would you rate this product?
                                </label>

                                <span className="required-mark">
                                    Required
                                </span>

                            </div>


                            <div className="rating-area">

                                <div className="stars">

                                    {[1, 2, 3, 4, 5].map(
                                        star => (

                                            <button
                                                type="button"
                                                key={star}
                                                className={
                                                    star <=
                                                    (
                                                        hoverRating ||
                                                        rating
                                                    )
                                                        ? "rating-star selected"
                                                        : "rating-star"
                                                }
                                                onClick={() =>
                                                    setRating(star)
                                                }
                                                onMouseEnter={() =>
                                                    setHoverRating(star)
                                                }
                                                onMouseLeave={() =>
                                                    setHoverRating(0)
                                                }
                                                aria-label={
                                                    `Rate ${star} stars`
                                                }
                                            >
                                                ★
                                            </button>

                                        )
                                    )}

                                </div>


                                <span
                                    className={
                                        rating
                                            ? "rating-text active"
                                            : "rating-text"
                                    }
                                >
                                    {
                                        ratingText[
                                            hoverRating ||
                                            rating
                                        ]
                                    }
                                </span>

                            </div>

                        </div>


                        {/* =================================================
                            REVIEW TITLE
                        ================================================= */}

                        <div className="form-section">

                            <div className="form-label-row">

                                <label
                                    htmlFor="review-title"
                                >
                                    Review Title
                                </label>

                                <span className="required-mark">
                                    Required
                                </span>

                            </div>


                            <div className="review-title-field">

                                <div className="review-title-icon">

                                    <FaPen />

                                </div>


                                <input
                                    id="review-title"
                                    type="text"
                                    value={title}
                                    onChange={
                                        event =>
                                            setTitle(
                                                event.target.value
                                            )
                                    }
                                    placeholder="Give your review a short title"
                                    maxLength={100}
                                    autoComplete="off"
                                />


                                <div className="title-character-count">
                                    {title.length}/100
                                </div>

                            </div>


                            <p className="field-helper">
                                Keep it short and specific — for example,
                                "Excellent quality and very useful".
                            </p>

                        </div>


                        {/* =================================================
                            REVIEW DESCRIPTION
                        ================================================= */}

                        <div className="form-section">

                            <div className="form-label-row">

                                <label htmlFor="review">
                                    Your Review
                                </label>

                                <span className="required-mark">
                                    Required
                                </span>

                            </div>


                            <div className="review-textarea-wrapper">

                                <textarea
                                    id="review"
                                    value={review}
                                    onChange={
                                        event =>
                                            setReview(
                                                event.target.value
                                            )
                                    }
                                    placeholder="What did you like or dislike about this product?"
                                    maxLength={500}
                                    rows={7}
                                />


                                <div className="textarea-character-count">
                                    {review.length}/500
                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            REVIEW TIPS
                        ================================================= */}

                        <div className="review-tips">

                            <div className="tip-icon">
                                💡
                            </div>


                            <div>

                                <strong>
                                    Review tips
                                </strong>


                                <p>
                                    Share details about quality,
                                    usability, appearance, packaging,
                                    and whether you would recommend
                                    the product.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div className="review-form-actions">

                            <button
                                type="button"
                                className="cancel-review-btn"
                                onClick={
                                    handleBackToOrder
                                }
                                disabled={
                                    submitting
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="submit-review-btn"
                                disabled={
                                    submitting
                                }
                            >

                                {submitting
                                    ? "Submitting..."
                                    : "★ Submit Review"
                                }

                            </button>

                        </div>

                    </form>

                </div>


                {/* =================================================
                    TRUST SECTION
                ================================================= */}

                <div className="review-trust">

                    <div>

                        <FaCheckCircle />

                        <span>
                            Genuine Reviews
                        </span>

                    </div>


                    <div>

                        <FaLock />

                        <span>
                            Secure & Private
                        </span>

                    </div>


                    <div>

                        <FaHeart />

                        <span>
                            Helps Other Parents
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

};


export default Review;