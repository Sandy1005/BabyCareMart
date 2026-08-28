import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    FaBox,
    FaCheckCircle,
    FaShippingFast,
    FaTruck,
    FaHome,
    FaMapMarkerAlt,
    FaPhoneAlt
} from "react-icons/fa";

import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import api from "../../services/api";

import "../../styles/Customer/OrderTracking.css";


function OrderTracking() {

    const { id } = useParams();

    const navigate = useNavigate();


    /*==========================================
                    STATES
    ==========================================*/

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);


    /*==========================================
                TRACKING STEPS
    ==========================================*/

    const steps = [

        "Order Placed",

        "Confirmed",

        "Packed",

        "Shipped",

        "Out For Delivery",

        "Delivered"

    ];


    /*==========================================
                FETCH ORDER
    ==========================================*/

    useEffect(() => {

        fetchOrder();

    }, [id]);


    const fetchOrder = async () => {

        try {

            const user = JSON.parse(

                localStorage.getItem("user")

            );


            if (!user) {

                toast.error(

                    "Please login to view order tracking."

                );

                navigate("/login");

                return;

            }


            const response = await api.get(

                "/orders",

                {

                    params: {

                        orderId: id

                    }

                }

            );


            if (

                !response.data ||

                response.data.length === 0

            ) {

                toast.error(

                    "Order not found."

                );

                navigate("/orders");

                return;

            }


            /*
                Make sure the order belongs
                to the logged-in user.
            */

            const userOrder =

                response.data.find(

                    (item) =>

                        String(item.userId) ===

                        String(user.id)

                );


            if (!userOrder) {

                toast.error(

                    "You are not authorized to view this order."

                );

                navigate("/orders");

                return;

            }


            setOrder(userOrder);

        }

        catch (error) {

            console.log(

                "Order Tracking Error :",

                error

            );

            toast.error(

                "Unable to load tracking details."

            );

            navigate("/orders");

        }

        finally {

            setLoading(false);

        }

    };


    /*==========================================
                STATUS NORMALIZATION
    ==========================================*/

    const getCurrentStep = () => {

        if (!order) {

            return 0;

        }


        const status =

            String(order.status || "")

                .trim()

                .toLowerCase();


        if (status === "delivered") {

            return 5;

        }


        if (

            status === "out for delivery" ||

            status === "out_for_delivery"

        ) {

            return 4;

        }


        if (status === "shipped") {

            return 3;

        }


        if (status === "packed") {

            return 2;

        }


        if (

            status === "confirmed" ||

            status === "processing"

        ) {

            return 1;

        }


        return 0;

    };


    const currentStep = getCurrentStep();


    /*==========================================
                STATUS DISPLAY
    ==========================================*/

    const getDisplayStatus = () => {

        if (!order) {

            return "Order Placed";

        }


        if (order.status === "Cancelled") {

            return "Cancelled";

        }


        return order.status || "Order Placed";

    };


    /*==========================================
                ORDER ITEMS
    ==========================================*/

    const orderItems =

        Array.isArray(order?.items)

            ? order.items

            : [];


    /*==========================================
                DELIVERY ADDRESS
    ==========================================*/

    const address =

        order?.address || {};


    /*==========================================
                LOADING
    ==========================================*/

    if (loading) {

        return (

            <>

                <Navbar />

                <div className="tracking-loading">

                    Loading Order Tracking...

                </div>

                <Footer />

            </>

        );

    }


    /*==========================================
                ORDER NOT FOUND
    ==========================================*/

    if (!order) {

        return null;

    }


    /*==========================================
                CANCELLED ORDER
    ==========================================*/

    const isCancelled =

        String(order.status)

            .toLowerCase() ===

        "cancelled";


    /*==========================================
                    JSX
    ==========================================*/

    return (

        <>

            <Navbar />


            <div className="tracking-page">

                <div className="tracking-card">


                    {/*==========================================
                            HEADER
                    ==========================================*/}

                    <div className="tracking-header">

                        <h2>

                            Order Tracking

                        </h2>

                        <span>

                            Order #

                            {order.orderId}

                        </span>

                    </div>


                    {/*==========================================
                            CURRENT STATUS
                    ==========================================*/}

                    <div className="tracking-status">

                        <h3>

                            Current Status

                        </h3>

                        <div

                            className="status-badge"

                            style={

                                isCancelled

                                    ? {

                                        background:

                                            "#dc2626"

                                    }

                                    : {}

                            }

                        >

                            {getDisplayStatus()}

                        </div>

                    </div>


                    {/*==========================================
                            CANCELLED MESSAGE
                    ==========================================*/}

                    {isCancelled && (

                        <div

                            style={{

                                background: "#fef2f2",

                                border:

                                    "1px solid #fecaca",

                                color: "#991b1b",

                                padding: "18px",

                                borderRadius: "12px",

                                marginBottom: "30px"

                            }}

                        >

                            <strong>

                                This order has been cancelled.

                            </strong>

                            {order.cancellationReason && (

                                <p

                                    style={{

                                        marginTop: "8px"

                                    }}

                                >

                                    Reason:{" "}

                                    {

                                        order.cancellationReason

                                    }

                                </p>

                            )}

                        </div>

                    )}


                    {/*==========================================
                            PROGRESS BAR
                    ==========================================*/}

                    {!isCancelled && (

                        <>

                            <div className="progress-bar">

                                <div

                                    className="progress-fill"

                                    style={{

                                        width:

                                            `${

                                                (

                                                    currentStep /

                                                    (

                                                        steps.length - 1

                                                    )

                                                ) * 100

                                            }%`

                                    }}

                                ></div>

                            </div>


                            {/*==========================================
                                    TIMELINE
                            ==========================================*/}

                            <div className="tracking-timeline">

                                {steps.map(

                                    (step, index) => (

                                        <div

                                            key={step}

                                            className={

                                                index <=

                                                currentStep

                                                    ? "timeline-step active"

                                                    : "timeline-step"

                                            }

                                        >

                                            <div className="step-icon">

                                                <FaCheckCircle />

                                            </div>

                                            <span>

                                                {step}

                                            </span>

                                        </div>

                                    )

                                )}

                            </div>

                        </>

                    )}


                    {/*==========================================
                            TRACKING DETAILS
                    ==========================================*/}

                    <div className="tracking-details">


                        {/*==========================================
                                DELIVERY INFORMATION
                        ==========================================*/}

                        <div className="tracking-section">

                            <h3>

                                <FaTruck />

                                Delivery Information

                            </h3>


                            <div className="info-row">

                                <span>

                                    Courier Partner

                                </span>

                                <strong>

                                    {order.courier ||

                                        "BabyCareMart Delivery"}

                                </strong>

                            </div>


                            <div className="info-row">

                                <span>

                                    Tracking ID

                                </span>

                                <strong>

                                    {order.trackingId ||

                                        "Not Assigned Yet"}

                                </strong>

                            </div>


                            <div className="info-row">

                                <span>

                                    Estimated Delivery

                                </span>

                                <strong>

                                    {order.estimatedDelivery ||

                                        "Delivery date will be updated soon"}

                                </strong>

                            </div>

                        </div>


                        {/*==========================================
                                DELIVERY ADDRESS
                        ==========================================*/}

                        <div className="tracking-section">

                            <h3>

                                <FaMapMarkerAlt />

                                Delivery Address

                            </h3>


                            <p>

                                {

                                    address.fullName ||

                                    order.customer?.fullName ||

                                    order.customerName ||

                                    "Customer"

                                }

                            </p>


                            <p>

                                {

                                    address.house ||

                                    ""

                                }

                            </p>


                            <p>

                                {

                                    address.street ||

                                    ""

                                }

                            </p>


                            {address.landmark && (

                                <p>

                                    {address.landmark}

                                </p>

                            )}


                            <p>

                                {

                                    address.city ||

                                    ""

                                }

                                {address.city &&

                                    address.state

                                    ? ", "

                                    : ""}

                                {

                                    address.state ||

                                    ""

                                }

                            </p>


                            <p>

                                {

                                    address.pincode ||

                                    ""

                                }

                            </p>


                            <p>

                                <FaPhoneAlt />

                                {" "}

                                {

                                    address.mobile ||

                                    order.customer?.phone ||

                                    order.mobile ||

                                    "Not available"

                                }

                            </p>

                        </div>


                        {/*==========================================
                                ORDER SUMMARY
                        ==========================================*/}

                        <div className="tracking-section">

                            <h3>

                                <FaBox />

                                Order Summary

                            </h3>


                            <div className="info-row">

                                <span>

                                    Products

                                </span>

                                <strong>

                                    {orderItems.length}

                                </strong>

                            </div>


                            <div className="info-row">

                                <span>

                                    Total Quantity

                                </span>

                                <strong>

                                    {

                                        orderItems.reduce(

                                            (

                                                total,

                                                item

                                            ) =>

                                                total +

                                                Number(

                                                    item.quantity ||

                                                    0

                                                ),

                                            0

                                        )

                                    }

                                </strong>

                            </div>


                            <div className="info-row">

                                <span>

                                    Payment Method

                                </span>

                                <strong>

                                    {

                                        order.paymentMethod ===

                                        "cod"

                                            ? "Cash On Delivery"

                                            : order.paymentMethod ===

                                              "upi"

                                            ? "UPI"

                                            : order.paymentMethod ===

                                              "card"

                                            ? "Credit / Debit Card"

                                            : order.paymentMethod ||

                                              "Not Available"

                                    }

                                </strong>

                            </div>


                            <div className="info-row">

                                <span>

                                    Total Amount

                                </span>

                                <strong>

                                    ₹{order.total}

                                </strong>

                            </div>

                        </div>

                    </div>


                    {/*==========================================
                            PRODUCT LIST
                    ==========================================*/}

                    {orderItems.length > 0 && (

                        <div

                            className="tracking-section"

                            style={{

                                marginTop: "25px"

                            }}

                        >

                            <h3>

                                <FaBox />

                                Ordered Products

                            </h3>


                            {orderItems.map(

                                (item, index) => (

                                    <div

                                        key={

                                            item.id ||

                                            index

                                        }

                                        style={{

                                            display:

                                                "flex",

                                            alignItems:

                                                "center",

                                            gap: "15px",

                                            padding:

                                                "12px 0",

                                            borderBottom:

                                                "1px solid #e5e7eb"

                                        }}

                                    >

                                        <img

                                            src={

                                                item.image

                                            }

                                            alt={

                                                item.name

                                            }

                                            style={{

                                                width:

                                                    "65px",

                                                height:

                                                    "65px",

                                                objectFit:

                                                    "contain",

                                                borderRadius:

                                                    "10px",

                                                background:

                                                    "#ffffff"

                                            }}

                                        />


                                        <div

                                            style={{

                                                flex: 1

                                            }}

                                        >

                                            <strong>

                                                {item.name}

                                            </strong>


                                            <p

                                                style={{

                                                    margin:

                                                        "5px 0 0",

                                                    color:

                                                        "#6b7280"

                                                }}

                                            >

                                                Qty:{" "}

                                                {

                                                    item.quantity

                                                }

                                            </p>

                                        </div>


                                        <strong>

                                            ₹

                                            {

                                                Number(

                                                    item.price ||

                                                    0

                                                ) *

                                                Number(

                                                    item.quantity ||

                                                    0

                                                )

                                            }

                                        </strong>

                                    </div>

                                )

                            )}

                        </div>

                    )}


                    {/*==========================================
                            ACTION BUTTONS
                    ==========================================*/}

                    <div className="tracking-actions">


                        <button

                            className="orders-btn"

                            onClick={() =>

                                navigate("/orders")

                            }

                        >

                            <FaShippingFast />

                            Back to Orders

                        </button>


                        <button

                            className="shop-btn"

                            onClick={() =>

                                navigate("/products")

                            }

                        >

                            <FaHome />

                            Continue Shopping

                        </button>

                    </div>

                </div>

            </div>


            <Footer />

        </>

    );

}


export default OrderTracking;