import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaExchangeAlt,
    FaUndo,
    FaBoxOpen,
    FaCheckCircle
} from "react-icons/fa";
import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import api from "../../services/api";

import "../../styles/Customer/ReturnRequest.css";


function ReturnRequest() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [requestType, setRequestType] = useState("");

    const [reason, setReason] = useState("");

    const [description, setDescription] = useState("");


    /* =====================================================
                    LOAD ORDER
    ===================================================== */

    useEffect(() => {

        loadOrder();

    }, [id]);


    const loadOrder = async () => {

        try {

            setLoading(true);

            const response = await api.get(
                `/orders/${id}`
            );

            setOrder(response.data);

        }
        catch (error) {

            console.log(error);

            toast.error(
                "Unable to load order."
            );

            navigate("/orders");

        }
        finally {

            setLoading(false);

        }

    };


    /* =====================================================
                    SUBMIT REQUEST
    ===================================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!requestType) {

            toast.error(
                "Please select Return or Exchange."
            );

            return;

        }


        if (!reason) {

            toast.error(
                "Please select a reason."
            );

            return;

        }


        try {

            setSubmitting(true);


            const updatedOrder = {

                ...order,

                returnRequest: {

                    type: requestType,

                    reason: reason,

                    description: description,

                    requestedAt:
                        new Date().toLocaleString(),

                    status: "Requested"

                }

            };


            await api.put(

                `/orders/${id}`,

                updatedOrder

            );


            toast.success(

                `${requestType} request submitted successfully.`

            );


            navigate(`/orders/${id}`);

        }
        catch (error) {

            console.log(error);

            toast.error(

                "Unable to submit request."

            );

        }
        finally {

            setSubmitting(false);

        }

    };


    /* =====================================================
                    LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="return-loading">

                Loading Order...

            </div>

        );

    }


    if (!order) {

        return null;

    }


    /* =====================================================
                    ELIGIBILITY
    ===================================================== */

    if (order.status !== "Delivered") {

        return (

            <>

                <Navbar />

                <main className="return-page">

                    <div className="return-container">

                        <div className="return-not-eligible">

                            <div className="not-eligible-icon">

                                <FaBoxOpen />

                            </div>


                            <h1>

                                Return / Exchange Not Available

                            </h1>


                            <p>

                                This order has not been delivered yet.

                                You can request a return or exchange

                                after the order is delivered.

                            </p>


                            <button

                                className="back-orders-btn"

                                onClick={() =>
                                    navigate(
                                        `/orders/${order.id}`
                                    )
                                }

                            >

                                <FaArrowLeft />

                                Back to Order

                            </button>

                        </div>

                    </div>

                </main>

                <Footer />

            </>

        );

    }


    /* =====================================================
                    EXISTING REQUEST
    ===================================================== */

    if (order.returnRequest) {

        return (

            <>

                <Navbar />

                <main className="return-page">

                    <div className="return-container">

                        <div className="request-success-card">

                            <div className="success-icon">

                                <FaCheckCircle />

                            </div>


                            <h1>

                                Request Already Submitted

                            </h1>


                            <p>

                                A return/exchange request already

                                exists for this order.

                            </p>


                            <div className="existing-request">

                                <div>

                                    <span>
                                        Request Type
                                    </span>

                                    <strong>
                                        {order.returnRequest.type}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Reason
                                    </span>

                                    <strong>
                                        {order.returnRequest.reason}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {order.returnRequest.status}
                                    </strong>

                                </div>

                            </div>


                            <button

                                className="back-orders-btn"

                                onClick={() =>
                                    navigate(
                                        `/orders/${order.id}`
                                    )
                                }

                            >

                                <FaArrowLeft />

                                Back to Order

                            </button>

                        </div>

                    </div>

                </main>

                <Footer />

            </>

        );

    }


    /* =====================================================
                    MAIN PAGE
    ===================================================== */

    return (

        <>

            <Navbar />


            <main className="return-page">

                <div className="return-container">


                    {/* HEADER */}

                    <div className="return-header">

                        <button

                            className="back-link"

                            onClick={() =>
                                navigate(
                                    `/orders/${order.id}`
                                )
                            }

                        >

                            <FaArrowLeft />

                            Back to Order

                        </button>


                        <h1>

                            Return / Exchange

                        </h1>


                        <p>

                            Order #{order.orderId || order.id}

                        </p>

                    </div>



                    {/* ORDER CARD */}

                    <div className="return-order-card">

                        <div className="return-order-header">

                            <div>

                                <h2>

                                    Your Order

                                </h2>

                                <p>

                                    Delivered successfully

                                </p>

                            </div>


                            <span className="delivered-badge">

                                <FaCheckCircle />

                                Delivered

                            </span>

                        </div>


                        <div className="return-products">

                            {order.items?.map(
                                (item, index) => (

                                    <div
                                        className="return-product"
                                        key={
                                            item.id ||
                                            item.productId ||
                                            index
                                        }
                                    >

                                        <img

                                            src={item.image}

                                            alt={item.name}

                                        />


                                        <div>

                                            <h3>

                                                {item.name}

                                            </h3>


                                            <p>

                                                Quantity:
                                                {" "}
                                                {item.quantity}

                                            </p>


                                            <strong>

                                                ₹
                                                {item.price}

                                            </strong>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>



                    {/* FORM */}

                    <form

                        className="return-form-card"

                        onSubmit={handleSubmit}

                    >

                        <div className="form-heading">

                            <h2>

                                What would you like to do?

                            </h2>

                            <p>

                                Select one option below.

                            </p>

                        </div>


                        {/* TYPE */}

                        <div className="request-type-grid">


                            <label

                                className={

                                    requestType === "Return"

                                        ? "request-type selected"

                                        : "request-type"

                                }

                            >

                                <input

                                    type="radio"

                                    name="requestType"

                                    value="Return"

                                    checked={
                                        requestType === "Return"
                                    }

                                    onChange={(e) =>
                                        setRequestType(
                                            e.target.value
                                        )
                                    }

                                />


                                <div className="type-icon return-icon">

                                    <FaUndo />

                                </div>


                                <div>

                                    <strong>
                                        Return
                                    </strong>

                                    <span>
                                        Get a refund for your product.
                                    </span>

                                </div>

                            </label>



                            <label

                                className={

                                    requestType === "Exchange"

                                        ? "request-type selected"

                                        : "request-type"

                                }

                            >

                                <input

                                    type="radio"

                                    name="requestType"

                                    value="Exchange"

                                    checked={
                                        requestType === "Exchange"
                                    }

                                    onChange={(e) =>
                                        setRequestType(
                                            e.target.value
                                        )
                                    }

                                />


                                <div className="type-icon exchange-icon">

                                    <FaExchangeAlt />

                                </div>


                                <div>

                                    <strong>
                                        Exchange
                                    </strong>

                                    <span>
                                        Replace the product with another one.
                                    </span>

                                </div>

                            </label>

                        </div>



                        {/* REASON */}

                        <div className="form-group">

                            <label>

                                Why are you requesting
                                a return/exchange?

                            </label>


                            <select

                                value={reason}

                                onChange={(e) =>
                                    setReason(
                                        e.target.value
                                    )
                                }

                            >

                                <option value="">

                                    Select a reason

                                </option>

                                <option value="Damaged Product">

                                    Damaged Product

                                </option>

                                <option value="Wrong Product">

                                    Wrong Product Received

                                </option>

                                <option value="Defective Product">

                                    Product is Defective

                                </option>

                                <option value="Product Not As Described">

                                    Product Not As Described

                                </option>

                                <option value="Size Issue">

                                    Size / Fit Issue

                                </option>

                                <option value="Missing Parts">

                                    Missing Parts / Accessories

                                </option>

                                <option value="Changed Mind">

                                    Changed My Mind

                                </option>

                                <option value="Other">

                                    Other

                                </option>

                            </select>

                        </div>



                        {/* DESCRIPTION */}

                        <div className="form-group">

                            <label>

                                Additional Details

                                <span>
                                    (Optional)
                                </span>

                            </label>


                            <textarea

                                rows="5"

                                value={description}

                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }

                                placeholder="Tell us more about the issue..."

                            />

                        </div>



                        {/* ACTIONS */}

                        <div className="return-actions">

                            <button

                                type="button"

                                className="cancel-return-btn"

                                onClick={() =>
                                    navigate(
                                        `/orders/${order.id}`
                                    )
                                }

                            >

                                Cancel

                            </button>


                            <button

                                type="submit"

                                className="submit-return-btn"

                                disabled={submitting}

                            >

                                {submitting

                                    ? "Submitting..."

                                    : "Submit Request"

                                }

                            </button>

                        </div>

                    </form>

                </div>

            </main>


            <Footer />

        </>

    );

}


export default ReturnRequest;