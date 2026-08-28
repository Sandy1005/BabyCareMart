import { useEffect, useState } from "react";

import {
    FaStar,
    FaEdit,
    FaTrash,
    FaPlus
} from "react-icons/fa";

import { toast } from "react-toastify";

import api from "../../services/api";

import "../../styles/Customer/Reviews.css";

function Reviews() {

    const currentUser = JSON.parse(

        localStorage.getItem("user")

    );

    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadReviews();

    }, []);

    const loadReviews = async () => {

        try {

            const response = await api.get("/reviews");

            const userReviews = response.data.filter(

                (review) =>

                    review.userId === currentUser?.id

            );

            setReviews(userReviews);

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Unable to load reviews."

            );

        }

        finally {

            setLoading(false);

        }

    };

    const deleteReview = async (id) => {

        const confirmDelete = window.confirm(

            "Delete this review?"

        );

        if (!confirmDelete) return;

        try {

            await api.delete(

                `/reviews/${id}`

            );

            toast.success(

                "Review deleted successfully."

            );

            loadReviews();

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Unable to delete review."

            );

        }

    };

    if (loading) {

        return (

            <div className="reviews-page">

                <h2>

                    Loading Reviews...

                </h2>

            </div>

        );

    }

    return (

        <div className="reviews-page">

            <div className="reviews-header">

                <div>

                    <h2>

                        My Reviews

                    </h2>

                    <p>

                        Manage your product reviews and ratings.

                    </p>

                </div>

                <button

                    className="write-review-btn"

                >

                    <FaPlus />

                    Write Review

                </button>

            </div>
                        {

                reviews.length === 0 ? (

                    <div className="empty-reviews">

                        <FaStar className="empty-icon" />

                        <h3>

                            No Reviews Yet

                        </h3>

                        <p>

                            You haven't reviewed any products yet.

                        </p>

                    </div>

                ) : (

                    <div className="reviews-grid">

                        {

                            reviews.map((review) => (

                                <div

                                    key={review.id}

                                    className="review-card"

                                >

                                    <div className="review-top">

                                        <img

                                            src={review.productImage}

                                            alt={review.productName}

                                            className="review-product-image"

                                        />

                                        <div className="review-info">

                                            <h3>

                                                {review.productName}

                                            </h3>

                                            <p>

                                                {review.reviewDate}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="review-rating">

                                        {

                                            [...Array(5)].map((_, index) => (

                                                <FaStar

                                                    key={index}

                                                    className={

                                                        index < review.rating

                                                            ? "star filled"

                                                            : "star"

                                                    }

                                                />

                                            ))

                                        }

                                    </div>

                                    <h4 className="review-title">

                                        {review.title}

                                    </h4>

                                    <p className="review-description">

                                        {review.review}

                                    </p>

                                    <div className="review-actions">

                                        <button

                                            className="edit-btn"

                                        >

                                            <FaEdit />

                                            Edit

                                        </button>

                                        <button

                                            className="delete-btn"

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

    );

}

export default Reviews;