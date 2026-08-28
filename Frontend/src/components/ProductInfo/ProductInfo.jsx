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
    FaUndo
} from "react-icons/fa";

import { toast } from "react-toastify";

import api from "../../services/api";

import "./ProductInfo.css";

function ProductInfo({ product }) {

    /*==========================================
                    STATES
    ==========================================*/

    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(false);

    const [wishlistLoading, setWishlistLoading] =
        useState(false);

    const [isFavourite, setIsFavourite] =
        useState(false);


    /*==========================================
                    QUANTITY
    ==========================================*/

    const increaseQuantity = () => {

        if (
            quantity <
            Number(product.stock)
        ) {
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


    /*==========================================
                    ADD TO CART
    ==========================================*/

    const handleAddToCart = async () => {

        try {

            setLoading(true);

            const user = JSON.parse(
                localStorage.getItem("user")
            );

            if (!user) {

                toast.error(
                    "Please login first."
                );

                return;
            }


            /*======================================
                    GET EXISTING CART ITEMS
            ======================================*/

            const response = await api.get(
                "/cart"
            );


            const existingCartItem =
                response.data.find(
                    item =>
                        String(item.userId) ===
                            String(user.id)
                        &&
                        String(item.productId) ===
                            String(product.id)
                );


            /*======================================
                    UPDATE EXISTING ITEM
            ======================================*/

            if (existingCartItem) {

                const newQuantity =
                    Number(
                        existingCartItem.quantity || 0
                    ) + quantity;


                if (
                    existingCartItem.stock &&
                    newQuantity >
                        Number(
                            existingCartItem.stock
                        )
                ) {

                    toast.warning(
                        "Maximum available stock reached."
                    );

                    return;
                }


                await api.patch(
                    `/cart/${existingCartItem.id}`,
                    {
                        quantity: newQuantity
                    }
                );

            }

            /*======================================
                    ADD NEW ITEM
            ======================================*/

            else {

                await api.post(
                    "/cart",
                    {
                        userId: String(
                            user.id
                        ),

                        productId: String(
                            product.id
                        ),

                        name: product.name,

                        category:
                            product.category,

                        brand:
                            product.brand,

                        image:
                            product.images?.[0] ||
                            "/images/no-image.png",

                        price:
                            Number(product.price),

                        originalPrice:
                            Number(
                                product.originalPrice ??
                                product.price
                            ),

                        quantity: quantity,

                        stock:
                            Number(product.stock)
                    }
                );
            }


            /*======================================
                    UPDATE NAVBAR CART COUNT
            ======================================*/

            window.dispatchEvent(
                new Event("cartUpdated")
            );


            toast.success(
                "Added to Cart"
            );

        }

        catch (error) {

            console.log(
                "Add To Cart Error:",
                error
            );

            toast.error(
                "Unable to add product."
            );

        }

        finally {

            setLoading(false);
        }
    };


    /*==========================================
                    BUY NOW
    ==========================================*/

    const handleBuyNow = async () => {

        await handleAddToCart();

        window.location.href =
            "/checkout";
    };


    /*==========================================
                    WISHLIST
    ==========================================*/

    const handleWishlist = async () => {

        try {

            setWishlistLoading(true);

            const user = JSON.parse(
                localStorage.getItem("user")
            );


            if (!user) {

                toast.error(
                    "Please login first."
                );

                return;
            }


            /*======================================
                    FETCH EXISTING WISHLIST
            ======================================*/

            const response =
                await api.get(
                    "/wishlist"
                );


            const existingItem =
                response.data.find(
                    item =>
                        String(item.userId) ===
                            String(user.id)
                        &&
                        String(item.productId) ===
                            String(product.id)
                );


            /*======================================
                    ALREADY EXISTS
            ======================================*/

            if (existingItem) {

                setIsFavourite(true);

                toast.info(
                    "Product is already in Wishlist."
                );

                return;
            }


            /*======================================
                    ADD TO WISHLIST
            ======================================*/

            await api.post(
                "/wishlist",
                {
                    userId: String(
                        user.id
                    ),

                    productId: String(
                        product.id
                    ),

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
                        Number(product.price),

                    originalPrice:
                        Number(
                            product.originalPrice ??
                            product.price
                        ),

                    stock:
                        Number(product.stock),

                    rating:
                        product.rating,

                    reviewCount:
                        product.reviewCount,

                    quantity: 1
                }
            );


            setIsFavourite(true);


            /*======================================
                UPDATE NAVBAR WISHLIST COUNT
            ======================================*/

            window.dispatchEvent(
                new Event(
                    "wishlistUpdated"
                )
            );


            toast.success(
                "Added to Wishlist"
            );

        }

        catch (error) {

            console.log(
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


    /*==========================================
                    SHARE PRODUCT
    ==========================================*/

    const handleShare = async () => {

        const shareData = {

            title:
                product.name,

            text:
                product.description,

            url:
                window.location.href
        };


        try {

            if (
                navigator.share
            ) {

                await navigator.share(
                    shareData
                );

            }

            else {

                await navigator.clipboard
                    .writeText(
                        window.location.href
                    );

                toast.success(
                    "Product link copied."
                );
            }

        }

        catch (error) {

            console.log(
                "Share Error:",
                error
            );
        }
    };


    /*==========================================
                    PRICE
    ==========================================*/

    const originalPrice =
        Number(
            product.originalPrice ??
            product.price
        );


    const sellingPrice =
        Number(product.price);


    const discount =
        originalPrice > sellingPrice
            ?
            Math.round(
                (
                    (
                        originalPrice -
                        sellingPrice
                    )
                    /
                    originalPrice
                ) * 100
            )
            :
            0;


    /*==========================================
                    JSX
    ==========================================*/

    return (

        <div className="product-info">

            {/* CATEGORY */}

            <span className="product-category">
                {product.category}
            </span>


            {/* TITLE */}

            <h1>
                {product.name}
            </h1>


            {/* BRAND */}

            <p className="product-brand">

                Brand :

                <strong>
                    {product.brand}
                </strong>

            </p>


            {/* RATING */}

            <div className="product-rating">

                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />

                <span>
                    {product.rating}
                    {" "}
                    (
                    {product.reviewCount}
                    {" "}
                    Reviews
                    )
                </span>

            </div>


            {/* PRICE */}

            <div className="product-price">

                <span className="selling-price">

                    ₹
                    {sellingPrice}

                </span>


                {originalPrice >
                    sellingPrice && (

                    <span className="original-price">

                        ₹
                        {originalPrice}

                    </span>

                )}


                {discount > 0 && (

                    <span className="discount">

                        {discount}% OFF

                    </span>

                )}

            </div>


            {/* DESCRIPTION */}

            <p className="product-description">

                {product.description}

            </p>


            {/* STOCK */}

            <div className="product-stock">

                {Number(product.stock) > 0
                    ?
                    "✓ In Stock"
                    :
                    "✕ Out of Stock"
                }

            </div>


            {/* QUANTITY */}

            <div className="quantity-section">

                <span>
                    Quantity
                </span>


                <div className="quantity-control">

                    <button
                        onClick={
                            decreaseQuantity
                        }
                        disabled={
                            quantity <= 1
                        }
                    >
                        <FaMinus />
                    </button>


                    <span>
                        {quantity}
                    </span>


                    <button
                        onClick={
                            increaseQuantity
                        }
                        disabled={
                            quantity >=
                            Number(
                                product.stock
                            )
                        }
                    >
                        <FaPlus />
                    </button>

                </div>

            </div>


            {/* ACTION BUTTONS */}

            <div className="product-actions">

                <button
                    className="add-cart-btn"
                    onClick={
                        handleAddToCart
                    }
                    disabled={
                        loading ||
                        Number(product.stock) <= 0
                    }
                >

                    <FaShoppingCart />

                    {
                        loading
                            ?
                            "Adding..."
                            :
                            "Add to Cart"
                    }

                </button>


                <button
                    className="buy-now-btn"
                    onClick={
                        handleBuyNow
                    }
                    disabled={
                        loading ||
                        Number(product.stock) <= 0
                    }
                >

                    <FaBolt />

                    Buy Now

                </button>

            </div>


            {/* SECONDARY ACTIONS */}

            <div className="secondary-actions">

                <button
                    className={
                        isFavourite
                            ?
                            "wishlist-active"
                            :
                            "wishlist-action"
                    }
                    onClick={
                        handleWishlist
                    }
                    disabled={
                        wishlistLoading
                    }
                >

                    <FaHeart />

                    {
                        wishlistLoading
                            ?
                            "Saving..."
                            :
                            isFavourite
                                ?
                                "In Wishlist"
                                :
                                "Add to Wishlist"
                    }

                </button>


                <button
                    className="share-action"
                    onClick={
                        handleShare
                    }
                >

                    <FaShareAlt />

                    Share

                </button>

            </div>


            {/* BENEFITS */}

            <div className="product-benefits">

                <div>

                    <FaTruck />

                    <span>
                        Fast Delivery
                    </span>

                </div>


                <div>

                    <FaShieldAlt />

                    <span>
                        Secure Payment
                    </span>

                </div>


                <div>

                    <FaUndo />

                    <span>
                        Easy Returns
                    </span>

                </div>

            </div>

        </div>
    );
}

export default ProductInfo;