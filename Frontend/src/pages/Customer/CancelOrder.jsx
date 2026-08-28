import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaBan,
    FaExclamationTriangle,
    FaCheckCircle
} from "react-icons/fa";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import api from "../../services/api";

import "../../styles/Customer/CancelOrder.css";


function CancelOrder() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [reason, setReason] = useState("");


    /*==================================================
                        FETCH ORDER
    ==================================================*/

    useEffect(() => {

        fetchOrder();

    }, [id]);


    const fetchOrder = async () => {
        try {
            setLoading(true);

            let response;

            try {
                response = await api.get(`/orders/${id}`);
            } catch (directError) {

                response = await api.get(
                    `/orders?orderId=${id}`
                );

                if (
                    !response.data ||
                    response.data.length === 0
                ) {
                    throw new Error("Order not found");
                }

                setOrder(response.data[0]);

                return;
            }

            setOrder(response.data);

        } catch (error) {

            console.error(
                "Unable to load order:",
                error
            );

            toast.error(
                "Order not found."
            );

            navigate("/orders");

        } finally {

            setLoading(false);

        }
    };


    /*==================================================
                    CANCEL ORDER
    ==================================================*/

    const handleCancelOrder = async () => {

        if (!reason) {

            toast.error(

                "Please select a cancellation reason."

            );

            return;

        }


        if (order.status === "Cancelled") {

            toast.error(

                "This order is already cancelled."

            );

            return;

        }


        if (order.status === "Delivered") {

            toast.error(

                "Delivered orders cannot be cancelled."

            );

            return;

        }


        try {

            setSubmitting(true);


            const updatedOrder = {

                ...order,

                status: "Cancelled",

                cancellationReason: reason,

                cancellationDate:
                    new Date().toLocaleString()

            };


            /*
                IMPORTANT:

                Use order.id for the PUT request.

                order.orderId is the customer-facing ID.
            */

            await api.put(

                `/orders/${order.id}`,

                updatedOrder

            );


            toast.success(

                "Order cancelled successfully."

            );


            navigate("/orders");

        }

        catch (error) {

            console.error(

                "Cancel order error:",

                error

            );

            toast.error(

                "Unable to cancel order."

            );

        }

        finally {

            setSubmitting(false);

        }

    };


    /*==================================================
                        LOADING
    ==================================================*/

    if (loading) {

        return (

            <>

                <Navbar />

                <div className="loading-text">

                    Loading Order...

                </div>

                <Footer />

            </>

        );

    }


    /*==================================================
                    ORDER NOT FOUND
    ==================================================*/

    if (!order) {

        return null;

    }


    /*==================================================
                        JSX
    ==================================================*/

    return (

        <>

            <Navbar />


            <section className="cancel-order-page">

                <div className="cancel-order-container">


                    {/*==================================
                            HEADER
                    ==================================*/}

                    <div className="cancel-header">

                        <button

                            type="button"

                            className="back-orders-btn"

                            onClick={() =>

                                navigate(

                                    `/orders/${order.orderId}`

                                )

                            }

                        >

                            <FaArrowLeft />

                            Back to Order

                        </button>


                        <div className="cancel-title">

                            <div className="cancel-title-icon">

                                <FaBan />

                            </div>


                            <div>

                                <h1>

                                    Cancel Order

                                </h1>


                                <p>

                                    Order ID:{" "}

                                    <strong>

                                        {order.orderId}

                                    </strong>

                                </p>

                            </div>

                        </div>

                    </div>


                    {/*==================================
                            WARNING
                    ==================================*/}

                    <div className="cancel-warning">

                        <FaExclamationTriangle />


                        <div>

                            <strong>

                                Cancel your order

                            </strong>


                            <p>

                                Please select a reason

                                before confirming

                                cancellation.

                            </p>

                        </div>

                    </div>


                    {/*==================================
                            ORDER SUMMARY
                    ==================================*/}

                    <div className="cancel-order-card">

                        <div className="section-title">

                            <h2>

                                Order Summary

                            </h2>


                            <span className="order-status">

                                {order.status}

                            </span>

                        </div>


                        <div className="cancel-product-list">

                            {

                                order.items &&

                                order.items.map(

                                    (item) => (

                                        <div

                                            className="cancel-product"

                                            key={item.id}

                                        >

                                            <img

                                                src={item.image}

                                                alt={item.name}

                                            />


                                            <div className="cancel-product-info">

                                                <h3>

                                                    {item.name}

                                                </h3>


                                                <p>

                                                    Quantity:{" "}

                                                    {item.quantity}

                                                </p>

                                            </div>


                                            <strong>

                                                ₹

                                                {

                                                    (

                                                        Number(

                                                            item.price

                                                        ) *

                                                        Number(

                                                            item.quantity

                                                        )

                                                    ).toFixed(2)

                                                }

                                            </strong>

                                        </div>

                                    )

                                )

                            }

                        </div>


                        <div className="cancel-total">

                            <span>

                                Order Total

                            </span>


                            <strong>

                                ₹

                                {

                                    Number(

                                        order.total

                                    ).toFixed(2)

                                }

                            </strong>

                        </div>

                    </div>


                    {/*==================================
                        CANCELLATION REASON
                    ==================================*/}

                    <div className="cancel-card">

                        <div className="section-title">

                            <h2>

                                Why are you cancelling?

                            </h2>


                            <p>

                                Select one reason below.

                            </p>

                        </div>


                        <div className="reason-list">


                            <label

                                className={

                                    reason ===

                                    "Ordered by mistake"

                                        ? "reason-option selected"

                                        : "reason-option"

                                }

                            >

                                <input

                                    type="radio"

                                    name="reason"

                                    value="Ordered by mistake"

                                    checked={

                                        reason ===

                                        "Ordered by mistake"

                                    }

                                    onChange={(e) =>

                                        setReason(

                                            e.target.value

                                        )

                                    }

                                />

                                <span>

                                    Ordered by mistake

                                </span>

                            </label>


                            <label

                                className={

                                    reason ===

                                    "Found a better price"

                                        ? "reason-option selected"

                                        : "reason-option"

                                }

                            >

                                <input

                                    type="radio"

                                    name="reason"

                                    value="Found a better price"

                                    checked={

                                        reason ===

                                        "Found a better price"

                                    }

                                    onChange={(e) =>

                                        setReason(

                                            e.target.value

                                        )

                                    }

                                />

                                <span>

                                    Found a better price elsewhere

                                </span>

                            </label>


                            <label

                                className={

                                    reason ===

                                    "Delivery is taking too long"

                                        ? "reason-option selected"

                                        : "reason-option"

                                }

                            >

                                <input

                                    type="radio"

                                    name="reason"

                                    value="Delivery is taking too long"

                                    checked={

                                        reason ===

                                        "Delivery is taking too long"

                                    }

                                    onChange={(e) =>

                                        setReason(

                                            e.target.value

                                        )

                                    }

                                />

                                <span>

                                    Delivery is taking too long

                                </span>

                            </label>


                            <label

                                className={

                                    reason ===

                                    "Changed my mind"

                                        ? "reason-option selected"

                                        : "reason-option"

                                }

                            >

                                <input

                                    type="radio"

                                    name="reason"

                                    value="Changed my mind"

                                    checked={

                                        reason ===

                                        "Changed my mind"

                                    }

                                    onChange={(e) =>

                                        setReason(

                                            e.target.value

                                        )

                                    }

                                />

                                <span>

                                    Changed my mind

                                </span>

                            </label>


                            <label

                                className={

                                    reason ===

                                    "Incorrect address"

                                        ? "reason-option selected"

                                        : "reason-option"

                                }

                            >

                                <input

                                    type="radio"

                                    name="reason"

                                    value="Incorrect address"

                                    checked={

                                        reason ===

                                        "Incorrect address"

                                    }

                                    onChange={(e) =>

                                        setReason(

                                            e.target.value

                                        )

                                    }

                                />

                                <span>

                                    Incorrect delivery address

                                </span>

                            </label>


                            <label

                                className={

                                    reason === "Other"

                                        ? "reason-option selected"

                                        : "reason-option"

                                }

                            >

                                <input

                                    type="radio"

                                    name="reason"

                                    value="Other"

                                    checked={

                                        reason === "Other"

                                    }

                                    onChange={(e) =>

                                        setReason(

                                            e.target.value

                                        )

                                    }

                                />

                                <span>

                                    Other

                                </span>

                            </label>

                        </div>

                    </div>


                    {/*==================================
                            ACTION BUTTONS
                    ==================================*/}

                    <div className="cancel-actions">

                        <button

                            type="button"

                            className="keep-order-btn"

                            disabled={submitting}

                            onClick={() =>

                                navigate(

                                    `/orders/${order.orderId}`

                                )

                            }

                        >

                            <FaArrowLeft />

                            Keep Order

                        </button>


                        <button

                            type="button"

                            className="confirm-cancel-btn"

                            disabled={submitting}

                            onClick={handleCancelOrder}

                        >

                            {

                                submitting

                                    ? "Cancelling..."

                                    : (

                                        <>

                                            <FaCheckCircle />

                                            Confirm Cancellation

                                        </>

                                    )

                            }

                        </button>

                    </div>

                </div>

            </section>


            <Footer />

        </>

    );

}


export default CancelOrder;