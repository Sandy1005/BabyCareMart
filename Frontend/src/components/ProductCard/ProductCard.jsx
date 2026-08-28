import { useState } from "react";

import { Link } from "react-router-dom";

import {
    FaHeart,
    FaRegHeart,
    FaShoppingCart,
    FaEye,
    FaStar,
    FaStarHalfAlt
} from "react-icons/fa";

import { toast } from "react-toastify";

import api from "../../services/api";

import "./ProductCard.css";

function ProductCard({

    product,

    onWishlistUpdate,

    onCartUpdate

}) {

    /*==========================================
                    STATES
    ==========================================*/

    const [

        isFavourite,

        setIsFavourite

    ] = useState(false);

    const [

        loading,

        setLoading

    ] = useState(false);

    const [

        wishlistLoading,

        setWishlistLoading

    ] = useState(false);

    /*==========================================
                PRICE CALCULATIONS
    ==========================================*/

    const originalPrice = Number(

        product.originalPrice ??

        product.price

    );

    const sellingPrice = Number(

        product.price

    );

    const saving =

        originalPrice > sellingPrice

            ?

            originalPrice - sellingPrice

            :

            0;

    const discount =

        originalPrice > sellingPrice

            ?

            Math.round(

                (

                    saving /

                    originalPrice

                ) * 100

            )

            :

            0;

    /*==========================================
                PRODUCT IMAGE
    ==========================================*/

    const productImage =

        product.images?.length > 0

            ?

            product.images[0]

            :

            "/images/no-image.png";

    /*==========================================
                PRODUCT STOCK
    ==========================================*/

    const inStock =

        Number(product.stock) > 0;

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

                    "Please login to continue."

                );

                return;

            }

            /*==========================================
                    REMOVE FROM WISHLIST
            ==========================================*/

            if (isFavourite) {

                const response = await api.get(

                    "/wishlist"

                );

                const existingItem =

                    response.data.find(

                        (item) =>

                            String(item.userId) ===

                                String(user.id)

                            &&

                            String(item.productId) ===

                                String(product.id)

                    );

                if (existingItem) {

                    await api.delete(

                        `/wishlist/${existingItem.id}`

                    );

                }

                setIsFavourite(false);

                window.dispatchEvent(

                    new Event("wishlistUpdated")

                );

                toast.info(

                    "Removed from Wishlist"

                );

                if (onWishlistUpdate) {

                    onWishlistUpdate();

                }

                return;

            }

            /*==========================================
                    CHECK EXISTING WISHLIST ITEM
            ==========================================*/

            const response = await api.get(

                "/wishlist"

            );

            const existingItem =

                response.data.find(

                    (item) =>

                        String(item.userId) ===

                            String(user.id)

                        &&

                        String(item.productId) ===

                            String(product.id)

                );

            if (existingItem) {

                setIsFavourite(true);

                toast.info(

                    "Product is already in Wishlist"

                );

                return;

            }

            /*==========================================
                    ADD TO WISHLIST
            ==========================================*/

            await api.post(

                "/wishlist",

                {

                    userId: String(user.id),

                    productId: String(product.id),

                    name: product.name,

                    category: product.category,

                    brand: product.brand,

                    image: productImage,

                    price: sellingPrice,

                    originalPrice: originalPrice,

                    stock: Number(product.stock),

                    rating: product.rating,

                    reviewCount: product.reviewCount,

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

            if (onWishlistUpdate) {

                onWishlistUpdate();

            }

        }

        catch (error) {

            console.log(

                "Wishlist Error :",

                error

            );

            toast.error(

                "Wishlist Failed"

            );

        }

        finally {

            setWishlistLoading(false);

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

                    "Please login to continue."

                );

                return;

            }

            /*==========================================
                    FETCH CART
            ==========================================*/

            const response = await api.get(

                "/cart"

            );

            /*
                JSON Server is returning an empty
                response when using the userId query.

                Therefore we fetch all cart records
                and filter them in React.
            */

            const existingCartItem =

                response.data.find(

                    (cartItem) =>

                        String(cartItem.userId) ===

                            String(user.id)

                        &&

                        String(cartItem.productId) ===

                            String(product.id)

                );

            /*==========================================
                    EXISTING CART ITEM
            ==========================================*/

            if (existingCartItem) {

                const newQuantity =

                    Number(

                        existingCartItem.quantity

                    ) + 1;

                if (

                    existingCartItem.stock &&

                    newQuantity >

                    Number(existingCartItem.stock)

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

            /*==========================================
                    NEW CART ITEM
            ==========================================*/

            else {

                await api.post(

                    "/cart",

                    {

                        userId: String(user.id),

                        productId: String(product.id),

                        name: product.name,

                        category: product.category,

                        brand: product.brand,

                        image: productImage,

                        price: sellingPrice,

                        originalPrice: originalPrice,

                        quantity: 1,

                        stock: Number(product.stock)

                    }

                );

            }

            window.dispatchEvent(

                new Event("cartUpdated")

            );

            toast.success(

                "Added To Cart"

            );

            if (onCartUpdate) {

                onCartUpdate();

            }

        }

        catch (error) {

            console.log(

                "Cart Error :",

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
                    QUICK VIEW
    ==========================================*/

    const productLink =

        `/products/${product.id}`;

    /*==========================================
                        JSX
    ==========================================*/

    return (

        <div className="product-card">

            {/*==========================================
                    DISCOUNT BADGE
            ==========================================*/}

            {

                discount > 0 && (

                    <span className="discount-badge">

                        {discount}% OFF

                    </span>

                )

            }

            {/*==========================================
                    WISHLIST BUTTON
            ==========================================*/}

            <button

                className="wishlist-btn"

                onClick={handleWishlist}

                disabled={wishlistLoading}

                aria-label={

                    isFavourite

                        ?

                        "Remove from wishlist"

                        :

                        "Add to wishlist"

                }

            >

                {

                    isFavourite

                        ?

                        <FaHeart />

                        :

                        <FaRegHeart />

                }

            </button>

            {/*==========================================
                    PRODUCT IMAGE
            ==========================================*/}

            <Link

                to={productLink}

                className="product-image"

            >

                <img

                    src={productImage}

                    alt={product.name}

                    loading="lazy"

                    onError={(e) => {

                        e.target.src =

                            "/images/no-image.png";

                    }}

                />

            </Link>

            {/*==========================================
                    PRODUCT CONTENT
            ==========================================*/}

            <div className="product-content">

                <span className="category-chip">

                    {product.category}

                </span>

                <h3>

                    {product.name}

                </h3>

                {/*==========================================
                        RATING
                ==========================================*/}

                <div className="rating">

                    <FaStar />

                    <FaStar />

                    <FaStar />

                    <FaStar />

                    <FaStarHalfAlt />

                    <span>

                        {product.rating}

                        {" "}

                        ({product.reviewCount || 0})

                    </span>

                </div>

                {/*==========================================
                        PRICE
                ==========================================*/}

                <div className="price-box">

                    <span className="price">

                        ₹{sellingPrice}

                    </span>

                    {

                        discount > 0 && (

                            <span className="original-price">

                                ₹{originalPrice}

                            </span>

                        )

                    }

                </div>

                {/*==========================================
                        SAVING
                ==========================================*/}

                {

                    discount > 0 && (

                        <p className="saving">

                            Save ₹{saving}

                        </p>

                    )

                }

                {/*==========================================
                        STOCK
                ==========================================*/}

                <div

                    className={

                        `stock ${

                            inStock

                                ?

                                ""

                                :

                                "out-of-stock"

                        }`

                    }

                >

                    {

                        inStock

                            ?

                            `✅ In Stock (${product.stock})`

                            :

                            "❌ Out Of Stock"

                    }

                </div>

                {/*==========================================
                        ADD TO CART
                ==========================================*/}

                <button

                    className="cart-btn"

                    onClick={handleAddToCart}

                    disabled={

                        !inStock ||

                        loading

                    }

                >

                    <FaShoppingCart />

                    {

                        loading

                            ?

                            " Adding..."

                            :

                            " Add To Cart"

                    }

                </button>

                {/*==========================================
                        QUICK VIEW
                ==========================================*/}

                <Link

                    to={productLink}

                    className="details-btn"

                >

                    <FaEye />

                    Quick View

                </Link>

            </div>

        </div>

    );

}

export default ProductCard;