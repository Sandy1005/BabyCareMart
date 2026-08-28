import { useEffect, useMemo, useState } from "react";

import {
    FaSearch,
    FaStar,
    FaTrash,
    FaComments
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import api from "../../services/api";

import "../../styles/Admin/Reviews.css";

function Reviews() {

    /* ==========================================
                    STATES
    ========================================== */

    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [ratingFilter, setRatingFilter] = useState("All");

    /* ==========================================
                LOAD REVIEWS
    ========================================== */

    useEffect(() => {

        fetchReviews();

    }, []);

    const fetchReviews = async () => {

        try {

            const response = await api.get("/reviews");

            const sortedReviews = response.data.sort(

                (a, b) =>

                    new Date(b.reviewDate) -

                    new Date(a.reviewDate)

            );

            setReviews(sortedReviews);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    /* ==========================================
                SEARCH + FILTER
    ========================================== */

    const filteredReviews = useMemo(() => {

        return reviews.filter(review => {

            const matchesSearch =

                review.productName
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                review.customerName
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                review.comment
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesRating =

                ratingFilter === "All"

                ||

                Number(review.rating) === Number(ratingFilter);

            return matchesSearch && matchesRating;

        });

    }, [

        reviews,

        search,

        ratingFilter

    ]);

    /* ==========================================
                DELETE REVIEW
    ========================================== */

    const deleteReview = async (id) => {

        const confirmDelete = window.confirm(

            "Delete this review?"

        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/reviews/${id}`);

            fetchReviews();

        }

        catch (error) {

            console.log(error);

        }

    };

    /* ==========================================
                STATISTICS
    ========================================== */

    const totalReviews = reviews.length;

    const averageRating =

        totalReviews === 0

            ? 0

            : (

                reviews.reduce(

                    (sum, review) =>

                        sum + Number(review.rating),

                    0

                ) / totalReviews

            ).toFixed(1);

    const fiveStarReviews =

        reviews.filter(

            review =>

                Number(review.rating) === 5

        ).length;

    /* ==========================================
                LOADING
    ========================================== */

    if (loading) {

        return (

            <div className="admin-loading">

                Loading Reviews...

            </div>

        );

    }

    /* ==========================================
                PAGE START
    ========================================== */

    return (
            
        <AdminLayout>
                <div className="reviews-page">

                    <div className="reviews-header">

                        <div>

                            <h1>

                                Customer Reviews

                            </h1>

                            <p>

                                Manage customer ratings and feedback.

                            </p>

                        </div>

                    </div>

                    {/* ==========================================
                            STATISTICS
                    ========================================== */}

                    <div className="review-stats">

                        <div className="stat-card">

                            <FaComments />

                            <div>

                                <h2>

                                    {totalReviews}

                                </h2>

                                <p>

                                    Total Reviews

                                </p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaStar />

                            <div>

                                <h2>

                                    {averageRating}

                                </h2>

                                <p>

                                    Average Rating

                                </p>

                            </div>

                        </div>

                        <div className="stat-card">

                            <FaStar />

                            <div>

                                <h2>

                                    {fiveStarReviews}

                                </h2>

                                <p>

                                    5 Star Reviews

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* ==========================================
                            SEARCH & FILTER
                    ========================================== */}

                    <div className="reviews-toolbar">

                        <div className="reviews-search">

                            <FaSearch />

                            <input

                                type="text"

                                placeholder="Search Product, Customer or Review..."

                                value={search}

                                onChange={(e) =>

                                    setSearch(e.target.value)

                                }

                            />

                        </div>

                        <select

                            value={ratingFilter}

                            onChange={(e) =>

                                setRatingFilter(

                                    e.target.value

                                )

                            }

                        >

                            <option value="All">

                                All Ratings

                            </option>

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

                    </div>
                                        {/* ==========================================
                            REVIEWS LIST
                    ========================================== */}

                    {

                        filteredReviews.length === 0 ?

                        (

                            <div className="no-reviews">

                                <FaComments />

                                <h2>

                                    No Reviews Found

                                </h2>

                                <p>

                                    No customer reviews match your search.

                                </p>

                            </div>

                        )

                        :

                        (

                            <div className="reviews-grid">

                                {

                                    filteredReviews.map((review) => (

                                        <div

                                            className="review-card"

                                            key={review.id}

                                        >

                                            {/* =========================
                                                    PRODUCT
                                            ========================= */}

                                            <div className="review-product">

                                                <img

                                                    src={review.productImage}

                                                    alt={review.productName}

                                                />

                                                <div>

                                                    <h3>

                                                        {review.productName}

                                                    </h3>

                                                    <span>

                                                        Product ID :

                                                        {" "}

                                                        {review.productId}

                                                    </span>

                                                </div>

                                            </div>

                                            {/* =========================
                                                    CUSTOMER
                                            ========================= */}

                                            <div className="review-customer">

                                                <h4>

                                                    {review.customerName}

                                                </h4>

                                                <span>

                                                    {review.reviewDate}

                                                </span>

                                            </div>

                                            {/* =========================
                                                    RATING
                                            ========================= */}

                                            <div className="review-rating">

                                                {

                                                    Array.from(

                                                        {

                                                            length: 5

                                                        }

                                                    ).map((_, index) => (

                                                        <FaStar

                                                            key={index}

                                                            className={

                                                                index < review.rating

                                                                ?

                                                                "star filled"

                                                                :

                                                                "star"

                                                            }

                                                        />

                                                    ))

                                                }

                                            </div>

                                            {/* =========================
                                                    COMMENT
                                            ========================= */}

                                            <div className="review-comment">

                                                <p>

                                                    {review.comment}

                                                </p>

                                            </div>

                                            {/* =========================
                                                    FOOTER
                                            ========================= */}

                                            <div className="review-footer">

                                                <span>

                                                    Rating :

                                                    {" "}

                                                    <strong>

                                                        {review.rating}

                                                        /5

                                                    </strong>

                                                </span>

                                                <button

                                                    className="delete-review-btn"

                                                    onClick={() =>

                                                        deleteReview(review.id)

                                                    }

                                                >

                                                    <FaTrash />

                                                    Delete

                                                </button>

                                            </div>

                                        </div>

                                    ))

                                }

                            </div>

                        )
                    }
                </div>

            
            </AdminLayout>
    );

}

export default Reviews;