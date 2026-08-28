import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import CartItem from "../../components/CartItem/CartItem";
import CartSummary from "../../components/CartSummary/CartSummary";

import api from "../../services/api";

import "../../styles/Customer/Cart.css";


function Cart() {

    /*==========================================
                    STATES
    ==========================================*/

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);

    const [loading, setLoading] = useState(true);


    /*==========================================
                    LOAD CART
    ==========================================*/

    useEffect(() => {

        fetchCartItems();

    }, []);


    const fetchCartItems = async () => {

        try {

            setLoading(true);

            const user = JSON.parse(
                localStorage.getItem("user")
            );


            /*
                User must be logged in
            */

            if (!user) {

                setCartItems([]);

                return;

            }


            /*
                Fetch all cart records.

                We intentionally fetch /cart
                and filter by userId because
                JSON Server is being used.
            */

            const response = await api.get("/cart");


            /*
                Show only current user's cart.
            */

            const userCart = response.data.filter(
                (item) =>
                    String(item.userId) ===
                    String(user.id)
            );


            setCartItems(userCart);

        }

        catch (error) {

            console.log(
                "Cart Fetch Error :",
                error
            );

            setCartItems([]);

        }

        finally {

            setLoading(false);

        }

    };


    /*==========================================
                    REMOVE ITEM
    ==========================================*/

    const removeItem = async (id) => {

        try {

            await api.delete(
                `/cart/${id}`
            );


            setCartItems(
                (previousItems) =>
                    previousItems.filter(
                        (item) =>
                            item.id !== id
                    )
            );


            /*
                Update Navbar cart count.
            */

            window.dispatchEvent(
                new Event("cartUpdated")
            );

        }

        catch (error) {

            console.log(
                "Remove Cart Item Error :",
                error
            );

        }

    };


    /*==========================================
                    UPDATE QUANTITY
    ==========================================*/

    const updateQuantity = async (
        id,
        quantity
    ) => {

        /*
            Quantity cannot be below 1.
        */

        if (quantity < 1) {

            return;

        }


        const currentItem =
            cartItems.find(
                (item) =>
                    item.id === id
            );


        if (!currentItem) {

            return;

        }


        /*
            Don't allow quantity
            above available stock.
        */

        if (
            currentItem.stock &&
            quantity >
            currentItem.stock
        ) {

            return;

        }


        try {

            await api.patch(
                `/cart/${id}`,
                {
                    quantity
                }
            );


            setCartItems(
                (previousItems) =>
                    previousItems.map(
                        (item) =>
                            item.id === id
                                ?
                                {
                                    ...item,
                                    quantity
                                }
                                :
                                item
                    )
            );


            /*
                Update Navbar cart count.
            */

            window.dispatchEvent(
                new Event("cartUpdated")
            );

        }

        catch (error) {

            console.log(
                "Update Cart Quantity Error :",
                error
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

                <div className="cart-loading">

                    <div className="cart-loading-spinner"></div>

                    <p>
                        Loading Cart...
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


            <section className="cart-page">


                {/*==========================================
                            PAGE HEADER
                ==========================================*/}

                <div className="cart-header">

                    <span className="cart-label">
                        🛒 YOUR SHOPPING BAG
                    </span>

                    <h1>
                        Shopping Cart
                    </h1>

                    <p>
                        Review your selected baby products
                        before checkout.
                    </p>

                </div>


                {/*==========================================
                            EMPTY CART
                ==========================================*/}

                {
                    cartItems.length === 0

                    ?

                    (

                        <div className="empty-cart">


                            {/*==========================================
                                    ANIMATED CART ILLUSTRATION
                            ==========================================*/}

                            <div className="empty-cart-animation">

                                <div className="cart-circle">

                                    <svg
                                        className="animated-cart"
                                        viewBox="0 0 180 150"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >

                                        {/* Cart handle */}

                                        <path
                                            className="cart-handle"
                                            d="M35 30 H50 L65 95 H135"
                                        />


                                        {/* Cart basket */}

                                        <path
                                            className="cart-basket"
                                            d="M55 45 H155 L140 95 H65 Z"
                                        />


                                        {/* Basket inner line */}

                                        <path
                                            className="cart-line"
                                            d="M62 60 H150"
                                        />


                                        {/* Small decorative heart */}

                                        <path
                                            className="cart-heart"
                                            d="M100 72
                                               C94 64 80 68 80 78
                                               C80 87 100 96 100 96
                                               C100 96 120 87 120 78
                                               C120 68 106 64 100 72 Z"
                                        />


                                        {/* Left wheel */}

                                        <circle
                                            className="cart-wheel"
                                            cx="78"
                                            cy="112"
                                            r="9"
                                        />


                                        {/* Right wheel */}

                                        <circle
                                            className="cart-wheel"
                                            cx="130"
                                            cy="112"
                                            r="9"
                                        />

                                    </svg>


                                    {/* Floating hearts */}

                                    <span className="floating-heart heart-one">
                                        ♥
                                    </span>

                                    <span className="floating-heart heart-two">
                                        ♥
                                    </span>

                                    <span className="floating-star star-one">
                                        ✦
                                    </span>

                                    <span className="floating-star star-two">
                                        ✦
                                    </span>

                                </div>

                            </div>


                            {/*==========================================
                                    EMPTY CART CONTENT
                            ==========================================*/}

                            <h2>
                                Your Cart Is Empty
                            </h2>


                            <p>
                                Looks like you haven't added
                                any products yet.
                            </p>


                            <button
                                className="continue-shopping"
                                onClick={() =>
                                    navigate("/products")
                                }
                            >
                                Continue Shopping
                            </button>


                        </div>

                    )

                    :

                    (

                        /*==========================================
                                CART WITH PRODUCTS
                        ==========================================*/

                        <div className="cart-container">


                            {/*==========================================
                                    CART ITEMS
                            ==========================================*/}

                            <div className="cart-items">

                                {

                                    cartItems.map(
                                        (item) => (

                                            <CartItem

                                                key={item.id}

                                                item={item}

                                                removeItem={
                                                    removeItem
                                                }

                                                updateQuantity={
                                                    updateQuantity
                                                }

                                            />

                                        )
                                    )

                                }

                            </div>


                            {/*==========================================
                                    CART SUMMARY
                            ==========================================*/}

                            <div className="cart-summary-wrapper">

                                <CartSummary
                                    cartItems={cartItems}
                                />

                            </div>


                        </div>

                    )

                }

            </section>


            <Footer />

        </>

    );

}


export default Cart;


