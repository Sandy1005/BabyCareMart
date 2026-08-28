import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import CheckoutAddress from "../../components/CheckoutAddress/CheckoutAddress";
import CheckoutSummary from "../../components/CheckoutSummary/CheckoutSummary";
import PaymentMethod from "../../components/PaymentMethod/PaymentMethod";
import CouponBox from "../../components/CouponBox/CouponBox";

import api from "../../services/api";

import "../../styles/Customer/Checkout.css";

function Checkout() {

    /*==========================================
                    NAVIGATION
    ==========================================*/

    const navigate = useNavigate();

    /*==========================================
                    STATES
    ==========================================*/

    const [cartItems, setCartItems] = useState([]);

    const [loading, setLoading] = useState(true);

    const [customer, setCustomer] = useState({

        fullName: "",

        phone: "",

        email: ""

    });

    const [addresses, setAddresses] = useState([]);

    const [address, setAddress] = useState(null);

    const [paymentMethod, setPaymentMethod] =

        useState("cod");

    /*==========================================
                    BILL DETAILS
    ==========================================*/

    const [subtotal, setSubtotal] =

        useState(0);

    const [shipping, setShipping] =

        useState(99);

    const [discount, setDiscount] =

        useState(0);

    const [finalTotal, setFinalTotal] =

        useState(0);

    const [appliedCoupon, setAppliedCoupon] =

        useState(null);

    /*==========================================
                    INITIAL LOAD
    ==========================================*/

    useEffect(() => {

        const initializeCheckout = async () => {

            try {

                const user = JSON.parse(
                    localStorage.getItem("user")
                );

                if (!user) {

                    navigate("/login");

                    return;

                }

                fetchUser();

                await Promise.all([
                    fetchCart(),
                    fetchAddresses()
                ]);

            }

            catch (error) {

                console.log(
                    "Checkout Initialization Error:",
                    error
                );

            }

            finally {

                setLoading(false);

            }

        };

        initializeCheckout();

    }, [navigate]);

    /*==========================================
                CALCULATE SUBTOTAL
    ==========================================*/

    useEffect(() => {

        const total = cartItems.reduce(

            (sum, item) => {

                const price = Number(

                    item.price || 0

                );

                const quantity = Number(

                    item.quantity || 0

                );

                return (

                    sum +

                    price *

                    quantity

                );

            },

            0

        );

        setSubtotal(total);

    }, [cartItems]);

    /*==========================================
                CALCULATE SHIPPING
    ==========================================*/

    useEffect(() => {

        const delivery =

            subtotal >= 999

                ?

                0

                :

                99;

        setShipping(delivery);

    }, [subtotal]);

    /*==========================================
                CALCULATE FINAL TOTAL
    ==========================================*/

    useEffect(() => {

        setFinalTotal(

            Math.max(

                0,

                subtotal -

                Number(discount || 0) +

                Number(shipping || 0)

            )

        );

    }, [

        subtotal,

        shipping,

        discount

    ]);

    /*==========================================
                    FETCH USER
    ==========================================*/

    const fetchUser = () => {

        try {

            const user = JSON.parse(

                localStorage.getItem("user")

            );

            if (!user) {

                return;

            }

            setCustomer({

                fullName:

                    user.fullName ||

                    user.name ||

                    "",

                phone:

                    user.phone ||

                    "",

                email:

                    user.email ||

                    ""

            });

        }

        catch (error) {

            console.log(

                "User Fetch Error :",

                error

            );

        }

    };

    /*==========================================
                    FETCH CART
    ==========================================*/

    const fetchCart = async () => {

        try {

            const user = JSON.parse(

                localStorage.getItem("user")

            );

            if (!user) {

                navigate("/login");

                return;

            }

            /*
                Fetch all cart records and filter
                them for the logged-in user.

                We intentionally don't use:

                /cart?userId=1

                because that query was returning
                an empty result in this project.
            */

            const response = await api.get(

                "/cart"

            );

            const userCart = response.data.filter(

                (item) =>

                    String(item.userId) ===

                    String(user.id)

            );

            setCartItems(userCart);

        }

        catch (error) {

            console.log(

                "Checkout Cart Error :",

                error

            );

            setCartItems([]);

        }

    };

    /*==========================================
                FETCH ADDRESSES
    ==========================================*/

    const fetchAddresses = async () => {

        try {

            const user = JSON.parse(

                localStorage.getItem("user")

            );

            if (!user) {

                return;

            }

            /*
                Fetch all addresses and filter locally
                for consistency with Cart/Wishlist.
            */

            const response = await api.get(

                "/addresses"

            );

            const userAddresses =

                response.data.filter(

                    (item) =>

                        String(item.userId) ===

                        String(user.id)

                );

            setAddresses(userAddresses);

            if (

                userAddresses.length >

                0

            ) {

                const defaultAddress =

                    userAddresses.find(

                        (item) =>

                            item.isDefault === true

                    )

                    ||

                    userAddresses[0];

                setAddress(defaultAddress);

            }

        }

        catch (error) {

            console.log(

                "Address Fetch Error :",

                error

            );

        }

    };

    /*==========================================
                COUPON CALLBACK
    ==========================================*/

    const handleCouponApplied = (coupon) => {

        if (!coupon) {

            setAppliedCoupon(null);

            setDiscount(0);

            return;

        }

        setAppliedCoupon(coupon);

        setDiscount(

            Number(coupon.discount || 0)

        );

        /*
            CouponBox may provide a shipping
            value. Use it when available.
        */

        if (

            coupon.shipping !== undefined

        ) {

            setShipping(

                Number(coupon.shipping)

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

                <div className="loading-text">

                    Loading Checkout...

                </div>

                <Footer />

            </>

        );

    }

    /*==========================================
                    EMPTY CART
    ==========================================*/

    if (cartItems.length === 0) {

        return (

            <>

                <Navbar />

                <section className="checkout-page">

                    <div className="checkout-header">

                        <h1>

                            Checkout

                        </h1>

                        <p>

                            Your cart is empty.

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

                    </div>

                </section>

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

            <section className="checkout-page">

                {/*==========================================
                        PAGE HEADER
                ==========================================*/}

                <div className="checkout-header">

                    <h1>

                        Checkout

                    </h1>

                    <p>

                        Complete your purchase by

                        filling your delivery details.

                    </p>

                </div>

                {/*==========================================
                        CHECKOUT CONTAINER
                ==========================================*/}

                <div className="checkout-container">

                    {/*==========================================
                            LEFT SIDE
                    ==========================================*/}

                    <div className="checkout-left">

                        {/*==========================================
                                CUSTOMER INFORMATION
                        ==========================================*/}

                        <div className="customer-section">

                            <h2>

                                Customer Information

                            </h2>

                            <div className="customer-grid">

                                <div className="form-group">

                                    <label>

                                        Full Name

                                    </label>

                                    <input

                                        type="text"

                                        placeholder="Enter Full Name"

                                        value={

                                            customer.fullName

                                        }

                                        onChange={(e) =>

                                            setCustomer({

                                                ...customer,

                                                fullName:

                                                    e.target.value

                                            })

                                        }

                                    />

                                </div>

                                <div className="form-group">

                                    <label>

                                        Phone Number

                                    </label>

                                    <input

                                        type="tel"

                                        placeholder="Enter Phone Number"

                                        value={

                                            customer.phone

                                        }

                                        onChange={(e) =>

                                            setCustomer({

                                                ...customer,

                                                phone:

                                                    e.target.value

                                            })

                                        }

                                    />

                                </div>

                                <div className="form-group full-width">

                                    <label>

                                        Email Address

                                    </label>

                                    <input

                                        type="email"

                                        placeholder="Enter Email"

                                        value={

                                            customer.email

                                        }

                                        onChange={(e) =>

                                            setCustomer({

                                                ...customer,

                                                email:

                                                    e.target.value

                                            })

                                        }

                                    />

                                </div>

                            </div>

                        </div>

                        {/*==========================================
                                ADDRESS
                        ==========================================*/}

                        <CheckoutAddress

                            addresses={addresses}

                            address={address}

                            setAddress={setAddress}

                        />

                        {/*==========================================
                                PAYMENT METHOD
                        ==========================================*/}

                        <PaymentMethod

                            paymentMethod={paymentMethod}

                            setPaymentMethod={

                                setPaymentMethod

                            }

                        />

                    </div>

                    {/*==========================================
                            RIGHT SIDE
                    ==========================================*/}

                    <div className="checkout-right">

                        {/*==========================================
                                COUPON
                        ==========================================*/}

                        <CouponBox

                            subtotal={subtotal}

                            shipping={shipping}

                            onCouponApplied={

                                handleCouponApplied

                            }

                        />

                        {/*==========================================
                                ORDER SUMMARY
                        ==========================================*/}

                        <CheckoutSummary

                            cartItems={cartItems}

                            customer={customer}

                            address={address}

                            paymentMethod={

                                paymentMethod

                            }

                            subtotal={subtotal}

                            shipping={shipping}

                            discount={discount}

                            finalTotal={finalTotal}

                            appliedCoupon={

                                appliedCoupon

                            }

                        />

                    </div>

                </div>

            </section>

            <Footer />

        </>

    );

}

export default Checkout;