import { useState } from "react";

import {
    FaStar,
    FaStarHalfAlt,
    FaShoppingCart,
    FaBolt,
    FaHeart,
    FaShareAlt,
    FaMinus,
    FaPlus,
    FaTruck,
    FaShieldAlt,
    FaUndo,
    FaBoxOpen
} from "react-icons/fa";

import { toast } from "react-toastify";

import api from "../../services/api";

import "./ProductInfo.css";


function ProductInfo({ product }) {

    /* =========================================================
       STATES
    ========================================================= */

    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(false);

    const [wishlistLoading, setWishlistLoading] =
        useState(false);

    const [isFavourite, setIsFavourite] =
        useState(false);


    /* =========================================================
       PRODUCT VALUES
    ========================================================= */

    const stock = Number(product?.stock || 0);

    const sellingPrice =
        Number(product?.price || 0);

    const originalPrice =
        Number(
            product?.originalPrice ??
            product?.price ??
            0
        );

    const discount =
        originalPrice > sellingPrice
            ? Math.round(
                (
                    (originalPrice - sellingPrice)
                    / originalPrice
                ) * 100
            )
            : 0;


    /* =========================================================
       QUANTITY
    ========================================================= */

    const increaseQuantity = () => {

        if (quantity < stock) {

            setQuantity(
                previous => previous + 1
            );

        }
    };


    const decreaseQuantity = () => {

        if (quantity > 1) {

            setQuantity(
                previous => previous - 1
            );

        }
    };


    /* =========================================================
       ADD TO CART
    ========================================================= */

    const handleAddToCart = async () => {

        try {

            setLoading(true);

            const user = JSON.parse(
                localStorage.getItem("user") || "null"
            );


            if (!user) {

                toast.error(
                    "Please login first."
                );

                return false;
            }


            /* -------------------------------------------------
               GET EXISTING CART ITEMS
            ------------------------------------------------- */

            const response =
                await api.get("/cart");


            const existingCartItem =
                response.data.find(
                    item =>
                        String(item.userId) ===
                            String(user.id)
                        &&
                        String(item.productId) ===
                            String(product.id)
                );


            /* -------------------------------------------------
               UPDATE EXISTING CART ITEM
            ------------------------------------------------- */

            if (existingCartItem) {

                const currentQuantity =
                    Number(
                        existingCartItem.quantity || 0
                    );

                const newQuantity =
                    currentQuantity + quantity;


                const availableStock =
                    Number(
                        existingCartItem.stock ||
                        stock
                    );


                if (
                    availableStock > 0 &&
                    newQuantity > availableStock
                ) {

                    toast.warning(
                        "Maximum available stock reached."
                    );

                    return false;
                }


                await api.patch(
                    `/cart/${existingCartItem.id}`,
                    {
                        quantity: newQuantity
                    }
                );

            }


            /* -------------------------------------------------
               ADD NEW CART ITEM
            ------------------------------------------------- */

            else {

                await api.post(
                    "/cart",
                    {
                        userId:
                            String(user.id),

                        productId:
                            String(product.id),

                        name:
                            product.name,

                        category:
                            product.category,

                        brand:
                            product.brand,

                        image:
                            product.images?.[0] ||
                            "/images/no-image.png",

                        price:
                            sellingPrice,

                        originalPrice:
                            originalPrice,

                        quantity:
                            quantity,

                        stock:
                            stock
                    }
                );

            }


            /* -------------------------------------------------
               UPDATE NAVBAR CART COUNT
            ------------------------------------------------- */

            window.dispatchEvent(
                new Event("cartUpdated")
            );


            toast.success(
                "Added to Cart"
            );


            return true;

        }
        catch (error) {

            console.error(
                "Add To Cart Error:",
                error
            );

            toast.error(
                "Unable to add product."
            );

            return false;

        }
        finally {

            setLoading(false);

        }

    };


    /* =========================================================
       BUY NOW
    ========================================================= */

    const handleBuyNow = async () => {

        const success =
            await handleAddToCart();


        if (success) {

            window.location.href =
                "/checkout";

        }

    };


    /* =========================================================
       WISHLIST
    ========================================================= */

    const handleWishlist = async () => {

        try {

            setWishlistLoading(true);


            const user = JSON.parse(
                localStorage.getItem("user") || "null"
            );


            if (!user) {

                toast.error(
                    "Please login first."
                );

                return;
            }


            /* -------------------------------------------------
               CHECK EXISTING WISHLIST
            ------------------------------------------------- */

            const response =
                await api.get("/wishlist");


            const existingItem =
                response.data.find(
                    item =>
                        String(item.userId) ===
                            String(user.id)
                        &&
                        String(item.productId) ===
                            String(product.id)
                );


            if (existingItem) {

                setIsFavourite(true);

                toast.info(
                    "Product is already in Wishlist."
                );

                return;

            }


            /* -------------------------------------------------
               ADD TO WISHLIST
            ------------------------------------------------- */

            await api.post(
                "/wishlist",
                {
                    userId:
                        String(user.id),

                    productId:
                        String(product.id),

                    name:
                        product.name,

                    category:
                        product.category,

                    brand:
                        product.brand,

                    image:
                        product.images?.[0] ||
                        "/images/no-image.png",

                    price:
                        sellingPrice,

                    originalPrice:
                        originalPrice,

                    stock:
                        stock,

                    rating:
                        product.rating,

                    reviewCount:
                        product.reviewCount,

                    quantity: 1
                }
            );


            setIsFavourite(true);


            window.dispatchEvent(
                new Event("wishlistUpdated")
            );


            toast.success(
                "Added to Wishlist"
            );

        }
        catch (error) {

            console.error(
                "Wishlist Error:",
                error
            );

            toast.error(
                "Unable to add to Wishlist."
            );

        }
        finally {

            setWishlistLoading(false);

        }

    };


    /* =========================================================
       SHARE PRODUCT
    ========================================================= */

    const handleShare = async () => {

        const shareData = {

            title:
                product.name,

            text:
                product.description ||
                "Check out this product.",

            url:
                window.location.href

        };


        try {

            if (navigator.share) {

                await navigator.share(
                    shareData
                );

            }
            else {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                toast.success(
                    "Product link copied."
                );

            }

        }
        catch (error) {

            console.log(
                "Share cancelled:",
                error
            );

        }

    };


    /* =========================================================
       RATING STARS
    ========================================================= */

    const rating =
        Number(product?.rating || 0);


    /* =========================================================
       JSX
    ========================================================= */

    return (

        <div className="product-info">

            {/* =================================================
                CATEGORY
            ================================================= */}

            <span className="product-category">
                {product.category}
            </span>


            {/* =================================================
                TITLE
            ================================================= */}

            <h1>
                {product.name}
            </h1>


            {/* =================================================
                BRAND
            ================================================= */}

            <p className="product-brand">

                Brand:

                <strong>
                    {product.brand}
                </strong>

            </p>


            {/* =================================================
                RATING
            ================================================= */}

            <div className="product-rating">

                <span className="rating-stars">

                    <FaStar />

                    <FaStar />

                    <FaStar />

                    <FaStar />

                    {rating >= 4.5
                        ? <FaStar />
                        : <FaStarHalfAlt />
                    }

                </span>

                <strong>
                    {rating.toFixed(1)}
                </strong>

                <span className="rating-reviews">
                    ({product.reviewCount || 0} Reviews)
                </span>

            </div>


            {/* =================================================
                PRICE
            ================================================= */}

            <div className="product-price">

                <span className="selling-price">
                    ₹{sellingPrice}
                </span>


                {originalPrice > sellingPrice && (

                    <span className="original-price">
                        ₹{originalPrice}
                    </span>

                )}


                {discount > 0 && (

                    <span className="discount">
                        {discount}% OFF
                    </span>

                )}

            </div>


            {/* =================================================
                SAVINGS
            ================================================= */}

            {originalPrice > sellingPrice && (

                <div className="saving">
                    You Save ₹
                    {originalPrice - sellingPrice}
                </div>

            )}


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p className="product-description">
                {product.description}
            </p>


            {/* =================================================
                STOCK
            ================================================= */}

            <div
                className={
                    stock > 0
                        ? "product-stock in-stock"
                        : "product-stock out-of-stock"
                }
            >

                <span className="stock-dot"></span>

                {stock > 0
                    ? `In Stock · ${stock} available`
                    : "Currently Out of Stock"
                }

            </div>


            {/* =================================================
                QUANTITY
            ================================================= */}

            <div className="quantity-section">

                <div className="quantity-header">

                    <div>

                        <div className="quantity-title">
                            Choose Quantity
                        </div>

                        <div className="quantity-subtitle">
                            Select how many you want to buy
                        </div>

                    </div>

                    <div className="quantity-stock">

                        <FaBoxOpen />

                        {stock > 0
                            ? `${stock} available`
                            : "Out of stock"
                        }

                    </div>

                </div>


                <div className="quantity-control-row">

                    <div className="quantity-control">

                        <button
                            type="button"
                            className="quantity-btn quantity-minus"
                            onClick={
                                decreaseQuantity
                            }
                            disabled={
                                quantity <= 1 ||
                                stock <= 0
                            }
                            aria-label="Decrease quantity"
                        >
                            <FaMinus />
                        </button>


                        <div className="quantity-value">

                            <span>
                                {quantity}
                            </span>

                            <small>
                                item{quantity > 1 ? "s" : ""}
                            </small>

                        </div>


                        <button
                            type="button"
                            className="quantity-btn quantity-plus"
                            onClick={
                                increaseQuantity
                            }
                            disabled={
                                quantity >= stock ||
                                stock <= 0
                            }
                            aria-label="Increase quantity"
                        >
                            <FaPlus />
                        </button>

                    </div>


                    <div className="quantity-summary">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{sellingPrice * quantity}
                        </strong>

                    </div>

                </div>


                {stock > 0 && quantity >= stock && (

                    <div className="quantity-limit-message">
                        Maximum available quantity selected.
                    </div>

                )}

            </div>


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="product-actions">

                <button
                    type="button"
                    className="add-cart-btn"
                    onClick={
                        handleAddToCart
                    }
                    disabled={
                        loading ||
                        stock <= 0
                    }
                >

                    <FaShoppingCart />

                    {loading
                        ? "Adding..."
                        : "Add to Cart"
                    }

                </button>


                <button
                    type="button"
                    className="buy-now-btn"
                    onClick={
                        handleBuyNow
                    }
                    disabled={
                        loading ||
                        stock <= 0
                    }
                >

                    <FaBolt />

                    Buy Now

                </button>

            </div>


            {/* =================================================
                SECONDARY ACTIONS
            ================================================= */}

            <div className="secondary-actions">

                <button
                    type="button"
                    className={
                        isFavourite
                            ? "wishlist-action wishlist-active"
                            : "wishlist-action"
                    }
                    onClick={
                        handleWishlist
                    }
                    disabled={
                        wishlistLoading
                    }
                >

                    <FaHeart />

                    {wishlistLoading
                        ? "Saving..."
                        : isFavourite
                            ? "In Wishlist"
                            : "Add to Wishlist"
                    }

                </button>


                <button
                    type="button"
                    className="share-action"
                    onClick={
                        handleShare
                    }
                >

                    <FaShareAlt />

                    Share Product

                </button>

            </div>


            {/* =================================================
                BENEFITS
            ================================================= */}

            <div className="product-benefits">

                <div className="benefit-item">

                    <span className="benefit-icon">
                        <FaTruck />
                    </span>

                    <div>

                        <strong>
                            Fast Delivery
                        </strong>

                        <span>
                            Quick delivery across India
                        </span>

                    </div>

                </div>


                <div className="benefit-item">

                    <span className="benefit-icon">
                        <FaShieldAlt />
                    </span>

                    <div>

                        <strong>
                            Secure Payment
                        </strong>

                        <span>
                            Safe & secure checkout
                        </span>

                    </div>

                </div>


                <div className="benefit-item">

                    <span className="benefit-icon">
                        <FaUndo />
                    </span>

                    <div>

                        <strong>
                            Easy Returns
                        </strong>

                        <span>
                            Simple return policy
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default ProductInfo;