import {
    FaCheckCircle,
    FaShoppingBag,
    FaFileInvoice,
    FaClipboardList
} from "react-icons/fa";

import {
    useNavigate,
    useLocation
} from "react-router-dom";

import "../../styles/Customer/PaymentSuccess.css";


function PaymentSuccess() {

    const navigate = useNavigate();

    const { state } = useLocation();


    /*==========================================
                PAYMENT DATA
    ==========================================*/

    const orderId =

        state?.orderId || "N/A";


    const transactionId =

        state?.transactionId || "N/A";


    const total =

        Number(state?.total || 0);


    /*==========================================
                INVALID SESSION
    ==========================================*/

    if (!state) {

        return (

            <div className="payment-success-page">

                <div className="payment-success-card">

                    <FaCheckCircle

                        className="success-icon"

                    />

                    <h1>

                        Payment Completed

                    </h1>

                    <p>

                        Your payment was completed,

                        but the confirmation details

                        are unavailable.

                    </p>

                    <button

                        className="continue-btn"

                        onClick={() =>

                            navigate("/orders")

                        }

                    >

                        <FaClipboardList />

                        View Orders

                    </button>

                </div>

            </div>

        );

    }


    /*==========================================
                    JSX
    ==========================================*/

    return (

        <div className="payment-success-page">

            <div className="payment-success-card">

                {/*==========================================
                        SUCCESS ICON
                ==========================================*/}

                <FaCheckCircle

                    className="success-icon"

                />


                {/*==========================================
                        SUCCESS MESSAGE
                ==========================================*/}

                <h1>

                    Payment Successful

                </h1>

                <p>

                    Thank you for shopping with

                    BabyCareMart.

                </p>

                <p>

                    Your payment has been processed

                    successfully.

                </p>


                {/*==========================================
                        PAYMENT DETAILS
                ==========================================*/}

                <div className="payment-details">

                    <div className="detail-row">

                        <span>

                            Order ID

                        </span>

                        <strong>

                            {orderId}

                        </strong>

                    </div>


                    <div className="detail-row">

                        <span>

                            Transaction ID

                        </span>

                        <strong>

                            {transactionId}

                        </strong>

                    </div>


                    <div className="detail-row">

                        <span>

                            Amount Paid

                        </span>

                        <strong>

                            ₹{total.toFixed(2)}

                        </strong>

                    </div>


                    <div className="detail-row">

                        <span>

                            Payment Status

                        </span>

                        <strong className="status-success">

                            Success

                        </strong>

                    </div>

                </div>


                {/*==========================================
                        ACTION BUTTONS
                ==========================================*/}

                <div className="payment-success-buttons">

                    {/*==========================================
                            CONTINUE SHOPPING
                    ==========================================*/}

                    <button

                        type="button"

                        className="continue-btn"

                        onClick={() =>

                            navigate("/home")

                        }

                    >

                        <FaShoppingBag />

                        Continue Shopping

                    </button>


                    {/*==========================================
                            VIEW ORDERS
                    ==========================================*/}

                    <button

                        type="button"

                        className="orders-btn"

                        onClick={() =>

                            navigate("/orders")

                        }

                    >

                        <FaClipboardList />

                        View Orders

                    </button>


                    {/*==========================================
                            INVOICE
                    ==========================================*/}

                    <button

                        type="button"

                        className="invoice-btn"

                        onClick={() =>

                            navigate(

                                `/invoice/${orderId}`

                            )

                        }

                    >

                        <FaFileInvoice />

                        View Invoice

                    </button>

                </div>

            </div>

        </div>

    );

}


export default PaymentSuccess;