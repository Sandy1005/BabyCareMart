import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import WishlistItem from "../../components/WishlistItem/WishlistItem";

import api from "../../services/api";

import { toast } from "react-toastify";

import "../../styles/Customer/Wishlist.css";


function Wishlist() {

    /*==========================================
                    STATES
    ==========================================*/

    const navigate = useNavigate();

    const [wishlistItems, setWishlistItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    /*==========================================
                FETCH WISHLIST
    ==========================================*/

    useEffect(() => {

        fetchWishlist();

    }, []);


    const fetchWishlist = async () => {

        try {

            setLoading(true);


            const user = JSON.parse(
                localStorage.getItem("user") ||
                "null"
            );


            if (!user) {

                setWishlistItems([]);

                return;
            }


            const response =
                await api.get("/wishlist");


            const userWishlist =
                response.data.filter(
                    (item) =>
                        String(item.userId) ===
                        String(user.id)
                );


            setWishlistItems(
                userWishlist
            );

        }
        catch (error) {

            console.log(
                "Wishlist Fetch Error:",
                error
            );

            setWishlistItems([]);

            toast.error(
                "Unable to load wishlist."
            );

        }
        finally {

            setLoading(false);

        }

    };


    /*==========================================
            REMOVE WISHLIST ITEM
    ==========================================*/

    const removeWishlistItem = async (id) => {

        try {

            await api.delete(
                `/wishlist/${id}`
            );


            setWishlistItems(
                (previousItems) =>
                    previousItems.filter(
                        (item) =>
                            item.id !== id
                    )
            );


            window.dispatchEvent(
                new Event(
                    "wishlistUpdated"
                )
            );


            toast.success(
                "Removed from wishlist!"
            );

        }
        catch (error) {

            console.log(
                "Remove Wishlist Error:",
                error
            );

            toast.error(
                "Unable to remove item."
            );

        }

    };


    /*==========================================
                    MOVE TO CART
    ==========================================*/

    const moveToCart = async (item) => {

        try {

            const user = JSON.parse(
                localStorage.getItem("user") ||
                "null"
            );


            if (!user) {

                toast.error(
                    "Please login to continue."
                );

                navigate("/login");

                return;
            }


            const cartResponse =
                await api.get("/cart");


            const existingCartItem =
                cartResponse.data.find(
                    (cartItem) =>
                        String(
                            cartItem.userId
                        ) ===
                        String(user.id)
                        &&
                        String(
                            cartItem.productId
                        ) ===
                        String(item.productId)
                );


            /*======================================
                    EXISTING CART ITEM
            ======================================*/

            if (existingCartItem) {

                const newQuantity =
                    Number(
                        existingCartItem.quantity ||
                        0
                    ) + 1;


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
                        quantity:
                            newQuantity
                    }
                );

            }


            /*======================================
                    NEW CART ITEM
            ======================================*/

            else {

                await api.post(
                    "/cart",
                    {

                        userId:
                            String(user.id),

                        productId:
                            String(
                                item.productId
                            ),

                        name:
                            item.name,

                        category:
                            item.category,

                        brand:
                            item.brand,

                        image:
                            item.image,

                        price:
                            item.price,

                        originalPrice:
                            item.originalPrice,

                        quantity:
                            1,

                        stock:
                            item.stock

                    }
                );

            }


            /*======================================
                REMOVE FROM WISHLIST
            ======================================*/

            await api.delete(
                `/wishlist/${item.id}`
            );


            setWishlistItems(
                (previousItems) =>
                    previousItems.filter(
                        (wishlistItem) =>
                            wishlistItem.id !==
                            item.id
                    )
            );


            /*======================================
                    UPDATE NAVBAR COUNTS
            ======================================*/

            window.dispatchEvent(
                new Event(
                    "wishlistUpdated"
                )
            );


            window.dispatchEvent(
                new Event(
                    "cartUpdated"
                )
            );


            toast.success(
                "Moved to cart!"
            );

        }
        catch (error) {

            console.log(
                "Move To Cart Error:",
                error
            );

            toast.error(
                "Unable to move item to cart."
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

                <div className="wishlist-loading">

                    <div className="wishlist-spinner"></div>

                    <p>
                        Loading Wishlist...
                    </p>

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


            <main className="wishlist-page">


                {/*==========================================
                            PAGE HEADER
                ==========================================*/}

                <section className="wishlist-header">

                    <span className="wishlist-eyebrow">
                        YOUR FAVOURITES
                    </span>

                    <h1>
                        My Wishlist
                    </h1>

                    <p>
                        Save your favourite baby products
                        and buy them anytime.
                    </p>

                </section>


                {/*==========================================
                        EMPTY WISHLIST
                ==========================================*/}

                {
                    wishlistItems.length === 0
                        ? (

                            <section className="empty-wishlist">


                                {/*================================
                                    EMPTY WISHLIST ILLUSTRATION
                                =================================*/}

                                <div className="empty-wishlist-art">

                                    <svg
                                        viewBox="0 0 300 220"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-label="Your Wishlist Is Empty"
                                        role="img"
                                    >

                                        {/* Background Circle */}

                                        <circle
                                            cx="150"
                                            cy="110"
                                            r="82"
                                            fill="#fff2f7"
                                        />


                                        <circle
                                            cx="150"
                                            cy="110"
                                            r="64"
                                            fill="#ffe7ef"
                                        />


                                        {/* Shopping Bag */}

                                        <path
                                            d="M95 105
                                               C95 97 101 91 109 91
                                               H191
                                               C199 91 205 97 205 105
                                               L198 164
                                               C197 172 191 177 183 177
                                               H117
                                               C109 177 103 172 102 164
                                               Z"
                                            fill="#ffffff"
                                            stroke="#ff5b91"
                                            strokeWidth="5"
                                        />


                                        {/* Bag Handle */}

                                        <path
                                            d="M123 93
                                               C123 68 177 68 177 93"
                                            fill="none"
                                            stroke="#ff5b91"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                        />


                                        {/* Heart */}

                                        <path
                                            d="M150 139
                                               C144 132 127 122 127 110
                                               C127 101 137 96 144 103
                                               L150 109
                                               L156 103
                                               C163 96 173 101 173 110
                                               C173 122 156 132 150 139
                                               Z"
                                            fill="#ff5b91"
                                        />


                                        {/* Small Hearts */}

                                        <path
                                            d="M79 76
                                               C75 71 66 73 66 80
                                               C66 87 79 94 79 94
                                               C79 94 92 87 92 80
                                               C92 73 83 71 79 76
                                               Z"
                                            fill="#ffb3ca"
                                        />


                                        <path
                                            d="M221 82
                                               C217 77 208 79 208 86
                                               C208 93 221 100 221 100
                                               C221 100 234 93 234 86
                                               C234 79 225 77 221 82
                                               Z"
                                            fill="#ffb3ca"
                                        />


                                        {/* Stars */}

                                        <path
                                            d="M91 143
                                               L94 150
                                               L102 153
                                               L94 156
                                               L91 164
                                               L88 156
                                               L80 153
                                               L88 150
                                               Z"
                                            fill="#ffd45c"
                                        />


                                        <path
                                            d="M211 132
                                               L214 139
                                               L222 142
                                               L214 145
                                               L211 153
                                               L208 145
                                               L200 142
                                               L208 139
                                               Z"
                                            fill="#ffd45c"
                                        />

                                    </svg>

                                </div>


                                <h2>
                                    Your Wishlist Is Empty
                                </h2>


                                <p>
                                    Save products you love to your
                                    wishlist and shop later.
                                </p>


                                <button
                                    type="button"
                                    className="continue-shopping"
                                    onClick={() =>
                                        navigate("/products")
                                    }
                                >
                                    Continue Shopping
                                </button>

                            </section>

                        )
                        : (

                            /*==========================================
                                    WISHLIST ITEMS
                            ==========================================*/

                            <section className="wishlist-container">

                                <div className="wishlist-items">

                                    {
                                        wishlistItems.map(
                                            (item) => (

                                                <WishlistItem
                                                    key={item.id}
                                                    item={item}
                                                    removeWishlistItem={
                                                        removeWishlistItem
                                                    }
                                                    moveToCart={
                                                        moveToCart
                                                    }
                                                />

                                            )
                                        )
                                    }

                                </div>

                            </section>

                        )
                }

            </main>


            <Footer />

        </>
    );
}


export default Wishlist;
