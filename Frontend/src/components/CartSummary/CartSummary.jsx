import { useMemo } from "react";

import { useNavigate } from "react-router-dom";

import "./CartSummary.css";

function CartSummary({

    cartItems

}) {

    const navigate = useNavigate();

    /*==========================================
                CALCULATIONS
    ==========================================*/

    const {

        subtotal,

        discount,

        shipping,

        tax,

        total

    } = useMemo(() => {

        let subtotal = 0;

        let discount = 0;

        cartItems.forEach((item) => {

            subtotal +=

                item.price *

                item.quantity;

            if (

                item.originalPrice >

                item.price

            ) {

                discount +=

                    (

                        item.originalPrice -

                        item.price

                    )

                    *

                    item.quantity;

            }

        });

        const shipping =

            subtotal >= 999

            ?

            0

            :

            99;

        const tax =

            Math.round(

                subtotal * 0.05

            );

        const total =

            subtotal +

            shipping +

            tax;

        return {

            subtotal,

            discount,

            shipping,

            tax,

            total

        };

    }, [cartItems]);

    /*==========================================
                    JSX
    ==========================================*/

    return (

        <div className="cart-summary">

            <h2>

                Order Summary

            </h2>

            {/*==========================================
                    SUMMARY ROWS
            ==========================================*/}

            <div className="summary-row">

                <span>

                    Subtotal

                </span>

                <span>

                    ₹{subtotal}

                </span>

            </div>

            <div className="summary-row">

                <span>

                    Discount

                </span>

                <span className="discount-text">

                    -₹{discount}

                </span>

            </div>

            <div className="summary-row">

                <span>

                    Shipping

                </span>

                <span>

                    {

                        shipping === 0

                        ?

                        "FREE"

                        :

                        `₹${shipping}`

                    }

                </span>

            </div>

            <div className="summary-row">

                <span>

                    GST (5%)

                </span>

                <span>

                    ₹{tax}

                </span>

            </div>

            <hr />

            {/*==========================================
                    TOTAL
            ==========================================*/}

            <div className="summary-total">

                <span>

                    Grand Total

                </span>

                <span>

                    ₹{total}

                </span>

            </div>

            {/*==========================================
                    CHECKOUT BUTTON
            ==========================================*/}

            <button

                className="checkout-btn"

                disabled={

                    cartItems.length === 0

                }

                onClick={() =>

                    navigate("/checkout")

                }

            >

                Proceed To Checkout

            </button>

        </div>

    );

}

export default CartSummary;