import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import "./CheckoutSummary.css";

function CheckoutSummary({

    cartItems,

    customer,

    address,

    paymentMethod,

    subtotal,

    shipping,

    discount,

    finalTotal,

    appliedCoupon

}) {

    const navigate = useNavigate();

    /*==========================================
            GST CALCULATION
    ==========================================*/

    const gst = Number(
        (finalTotal * 0.18).toFixed(2)
    );

    const grandTotal =
        Number(finalTotal) + gst;


    /*==========================================
            ORDER DETAILS
    ==========================================*/

    const orderId =
        "ORD" + Date.now();

    const orderDate =
        new Date().toLocaleString();


    /*==========================================
            VALIDATION
    ==========================================*/

    const validateCheckout = () => {

        /*==========================================
                CART VALIDATION
        ==========================================*/

        if (cartItems.length === 0) {

            toast.error(
                "Your cart is empty."
            );

            return false;

        }


        /*==========================================
                CUSTOMER VALIDATION
        ==========================================*/

        if (

            !customer.fullName?.trim() ||

            !customer.phone?.trim() ||

            !customer.email?.trim()

        ) {

            toast.error(
                "Please complete customer information."
            );

            return false;

        }


        /*==========================================
                ADDRESS EXISTENCE
        ==========================================*/

        if (!address) {

            toast.error(
                "Please select a delivery address."
            );

            return false;

        }


        /*==========================================
                ADDRESS VALIDATION
        ==========================================*/

        if (

            !address.fullName?.trim() ||

            !address.mobile?.trim() ||

            !address.house?.trim() ||

            !address.area?.trim() ||

            !address.city?.trim() ||

            !address.state?.trim() ||

            !address.pincode?.trim()

        ) {

            toast.error(
                "Delivery address is incomplete."
            );

            return false;

        }


        return true;

    };


    /*==========================================
            PROCEED TO PAYMENT
    ==========================================*/

    const handleProceedPayment = () => {

        if (!validateCheckout()) {

            return;

        }

        navigate("/payment", {

            state: {

                orderId,

                orderDate,

                customer,

                address,

                paymentMethod,

                cartItems,

                subtotal,

                shipping,

                discount,

                gst,

                total: grandTotal,

                appliedCoupon

            }

        });

    };


    /*==========================================
                    JSX
    ==========================================*/

    return (

        <div className="checkout-summary">

            <h2>
                Order Summary
            </h2>


            {/*==========================================
                    PRODUCTS
            ==========================================*/}

            <div className="summary-products">

                {

                    cartItems.map((item) => (

                        <div
                            key={item.id}
                            className="summary-item"
                        >

                            <div className="summary-left">

                                <img
                                    src={item.image}
                                    alt={item.name}
                                />

                                <div>

                                    <h4>
                                        {item.name}
                                    </h4>

                                    <p>
                                        Qty : {item.quantity}
                                    </p>

                                </div>

                            </div>

                            <span>

                                ₹
                                {
                                    Number(item.price) *
                                    Number(item.quantity)
                                }

                            </span>

                        </div>

                    ))

                }

            </div>


            {/*==========================================
                    BILL DETAILS
            ==========================================*/}

            <div className="bill-details">

                <div className="bill-row">

                    <span>
                        Subtotal
                    </span>

                    <span>
                        ₹{subtotal}
                    </span>

                </div>


                <div className="bill-row">

                    <span>
                        Shipping
                    </span>

                    <span>

                        {

                            shipping === 0

                                ? "FREE"

                                : `₹${shipping}`

                        }

                    </span>

                </div>


                {

                    discount > 0 && (

                        <div className="bill-row">

                            <span>
                                Discount
                            </span>

                            <span className="discount">

                                -₹{discount}

                            </span>

                        </div>

                    )

                }


                {

                    appliedCoupon && (

                        <div className="bill-row">

                            <span>
                                Coupon
                            </span>

                            <span className="coupon-code">

                                {appliedCoupon.code}

                            </span>

                        </div>

                    )

                }


                <div className="bill-row">

                    <span>
                        GST (18%)
                    </span>

                    <span>
                        ₹{gst}
                    </span>

                </div>


                <div className="bill-row total-row">

                    <span>
                        Grand Total
                    </span>

                    <span>
                        ₹{grandTotal}
                    </span>

                </div>

            </div>


            {/*==========================================
                PAYMENT INFORMATION
            ==========================================*/}

            <div className="payment-info">

                <h4>
                    Payment Method
                </h4>

                <p>

                    {

                        paymentMethod === "cod"

                            ? "Cash On Delivery"

                            : paymentMethod === "upi"

                            ? "UPI"

                            : paymentMethod === "card"

                            ? "Credit / Debit Card"

                            : paymentMethod === "netbanking"

                            ? "Net Banking"

                            : paymentMethod === "wallet"

                            ? "Wallet"

                            : paymentMethod

                    }

                </p>

            </div>


            {/*==========================================
                PROCEED TO PAYMENT
            ==========================================*/}

            <button
                className="place-order-btn"
                onClick={handleProceedPayment}
                disabled={cartItems.length === 0}
            >

                {

                    cartItems.length === 0

                        ? "Cart is Empty"

                        : `Proceed to Payment • ₹${grandTotal}`

                }

            </button>

        </div>

    );

}

export default CheckoutSummary;