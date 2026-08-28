import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Customer/Review.css";

const Review = () => {
  const { orderId, productId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [product, setProduct] = useState({
    name: "Product",
    image: "",
    price: 0,
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        /*
         * If your productId is available in db.json,
         * this will automatically load the product.
         */
        const response = await fetch(
          `http://localhost:4000/products/${productId}`
        );

        if (response.ok) {
          const data = await response.json();

          setProduct({
            name: data.name || data.title || "Product",
            image: data.image || data.imageUrl || "",
            price: data.price || 0,
          });

          return;
        }
      } catch (error) {
        console.log("Unable to load product:", error);
      }

      /*
       * Fallback:
       * Try to find product information from localStorage.
       */
      try {
        const storedProducts = JSON.parse(
          localStorage.getItem("products") || "[]"
        );

        const foundProduct = storedProducts.find(
          (item) =>
            String(item.id) === String(productId) ||
            String(item.productId) === String(productId)
        );

        if (foundProduct) {
          setProduct({
            name:
              foundProduct.name ||
              foundProduct.title ||
              "Product",
            image:
              foundProduct.image ||
              foundProduct.imageUrl ||
              "",
            price: foundProduct.price || 0,
          });
        }
      } catch (error) {
        console.log("Product fallback failed:", error);
      }
    };

    loadProduct();
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    if (!review.trim()) {
      alert("Please write a review.");
      return;
    }

    const reviewData = {
      id: `REV${Date.now()}`,
      orderId,
      productId,
      productName: product.name,
      rating,
      review: review.trim(),
      createdAt: new Date().toISOString(),
    };

    /*
     * Save reviews locally for now.
     * This avoids breaking the application if your db.json
     * does not have a reviews endpoint yet.
     */
    const existingReviews = JSON.parse(
      localStorage.getItem("reviews") || "[]"
    );

    existingReviews.push(reviewData);

    localStorage.setItem(
      "reviews",
      JSON.stringify(existingReviews)
    );

    setSubmitted(true);
  };

  const handleBackToOrder = () => {
    navigate(`/orders/${orderId}`);
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  if (submitted) {
    return (
      <div className="review-page">
        <div className="review-success-card">
          <div className="success-icon">✓</div>

          <h1>Thank You!</h1>

          <p className="success-title">
            Your review has been submitted successfully.
          </p>

          <p className="success-text">
            Your feedback helps other parents make better
            shopping decisions.
          </p>

          <div className="submitted-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? "star active" : "star"}
              >
                ★
              </span>
            ))}
          </div>

          <div className="success-actions">
            <button
              className="review-primary-btn"
              onClick={handleViewOrders}
            >
              View My Orders
            </button>

            <button
              className="review-secondary-btn"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="review-container">

        {/* Back */}
        <button
          className="review-back-btn"
          onClick={handleBackToOrder}
        >
          ← Back to Order
        </button>

        {/* Header */}
        <div className="review-header">
          <div>
            <span className="review-eyebrow">
              SHARE YOUR EXPERIENCE
            </span>

            <h1>Write a Review</h1>

            <p>
              Tell us what you think about your purchase.
            </p>
          </div>

          <div className="review-order-id">
            <span>Order</span>
            <strong>#{orderId}</strong>
          </div>
        </div>

        <div className="review-content">

          {/* Product Card */}
          <div className="review-product-card">
            <div className="product-image-wrapper">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="review-product-image"
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

              <h2>{product.name}</h2>

              {product.price > 0 && (
                <p className="product-price">
                  ₹{Number(product.price).toFixed(2)}
                </p>
              )}

              <div className="verified-purchase">
                <span>✓</span>
                Verified Purchase
              </div>
            </div>
          </div>

          {/* Review Form */}
          <form
            className="review-form-card"
            onSubmit={handleSubmit}
          >
            <div className="form-section">
              <label>
                How would you rate this product?
              </label>

              <div className="rating-area">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={
                        star <= (hoverRating || rating)
                          ? "rating-star selected"
                          : "rating-star"
                      }
                      onClick={() => setRating(star)}
                      onMouseEnter={() =>
                        setHoverRating(star)
                      }
                      onMouseLeave={() =>
                        setHoverRating(0)
                      }
                      aria-label={`Rate ${star} stars`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <span className="rating-text">
                  {rating === 0
                    ? "Select a rating"
                    : rating === 1
                    ? "Poor"
                    : rating === 2
                    ? "Below Average"
                    : rating === 3
                    ? "Good"
                    : rating === 4
                    ? "Very Good"
                    : "Excellent"}
                </span>
              </div>
            </div>

            <div className="form-section">
              <label htmlFor="review">
                Your Review
              </label>

              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What did you like or dislike about this product?"
                maxLength={500}
                rows={7}
              />

              <div className="character-count">
                {review.length}/500
              </div>
            </div>

            <div className="review-tips">
              <div className="tip-icon">💡</div>

              <div>
                <strong>Review tips</strong>

                <p>
                  Share details about quality, usability,
                  appearance, packaging, and whether you
                  would recommend the product.
                </p>
              </div>
            </div>

            <div className="review-form-actions">
              <button
                type="button"
                className="cancel-review-btn"
                onClick={handleBackToOrder}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-review-btn"
              >
                ★ Submit Review
              </button>
            </div>
          </form>
        </div>

        {/* Trust section */}
        <div className="review-trust">
          <div>
            <span>✓</span>
            Genuine Reviews
          </div>

          <div>
            <span>🔒</span>
            Secure & Private
          </div>

          <div>
            <span>❤</span>
            Helps Other Parents
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;