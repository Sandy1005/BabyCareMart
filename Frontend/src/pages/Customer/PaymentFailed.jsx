import {
    FaTimesCircle,
    FaRedo,
    FaArrowLeft
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "../../styles/Customer/PaymentFailed.css";

function PaymentFailed() {

    const navigate = useNavigate();

    return (

        <div className="payment-failed-page">

            <div className="payment-failed-card">

                <FaTimesCircle className="failed-icon" />

                <h1>

                    Payment Failed

                </h1>

                <p>

                    Unfortunately, we couldn't process your payment.

                </p>

                <p>

                    Please verify your payment details and try again.

                </p>

                <div className="payment-failed-details">

                    <div className="detail-row">

                        <span>

                            Status

                        </span>

                        <strong className="status-failed">

                            Failed

                        </strong>

                    </div>

                    <div className="detail-row">

                        <span>

                            Reason

                        </span>

                        <strong>

                            Transaction Declined

                        </strong>

                    </div>

                    <div className="detail-row">

                        <span>

                            Suggestion

                        </span>

                        <strong>

                            Retry or choose another payment method

                        </strong>

                    </div>

                </div>

                <div className="payment-failed-buttons">

                    <button

                        className="retry-btn"

                        onClick={() => navigate("/payment")}

                    >

                        <FaRedo />

                        Retry Payment

                    </button>

                    <button

                        className="checkout-btn"

                        onClick={() => navigate("/checkout")}

                    >

                        <FaArrowLeft />

                        Back to Checkout

                    </button>

                </div>

            </div>

        </div>

    );

}

export default PaymentFailed;