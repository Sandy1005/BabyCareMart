import {

    FaMoneyBillWave,

    FaMobileAlt,

    FaCreditCard

} from "react-icons/fa";

import "./PaymentMethod.css";

function PaymentMethod({

    paymentMethod,

    setPaymentMethod

}){

    return(

        <div className="payment-method">

            {/*==========================================
                    SECTION TITLE
            ==========================================*/}

            <h2>

                Payment Method

            </h2>

            <div className="payment-options">

                {/*==========================================
                    CASH ON DELIVERY
                ==========================================*/}

                <label

                    className={`payment-card ${

                        paymentMethod==="cod"

                        ?

                        "active"

                        :

                        ""

                    }`}

                >

                    <input

                        type="radio"

                        name="payment"

                        value="cod"

                        checked={paymentMethod==="cod"}

                        onChange={(e)=>

                            setPaymentMethod(e.target.value)

                        }

                    />

                    <FaMoneyBillWave />

                    <div>

                        <h3>

                            Cash On Delivery

                        </h3>

                        <p>

                            Pay when your order is delivered.

                        </p>

                    </div>

                </label>

                {/*==========================================
                        UPI
                ==========================================*/}

                <label

                    className={`payment-card ${

                        paymentMethod==="upi"

                        ?

                        "active"

                        :

                        ""

                    }`}

                >

                    <input

                        type="radio"

                        name="payment"

                        value="upi"

                        checked={paymentMethod==="upi"}

                        onChange={(e)=>

                            setPaymentMethod(e.target.value)

                        }

                    />

                    <FaMobileAlt />

                    <div>

                        <h3>

                            UPI Payment

                        </h3>

                        <p>

                            Google Pay, PhonePe, Paytm, BHIM.

                        </p>

                    </div>

                </label>
                                {/*==========================================
                    CREDIT / DEBIT CARD
                ==========================================*/}

                <label

                    className={`payment-card ${

                        paymentMethod==="card"

                        ?

                        "active"

                        :

                        ""

                    }`}

                >

                    <input

                        type="radio"

                        name="payment"

                        value="card"

                        checked={paymentMethod==="card"}

                        onChange={(e)=>

                            setPaymentMethod(e.target.value)

                        }

                    />

                    <FaCreditCard />

                    <div>

                        <h3>

                            Credit / Debit Card

                        </h3>

                        <p>

                            Visa, MasterCard, RuPay & American Express.

                        </p>

                    </div>

                </label>

            </div>

            {/*==========================================
                    PAYMENT NOTE
            ==========================================*/}

            <div className="payment-note">

                <h4>

                    Secure Payments

                </h4>

                <p>

                    Your payment information is encrypted and securely processed.
                    BabyCareMart never stores your card or UPI credentials.

                </p>

            </div>
         </div>
    );
}
export default PaymentMethod;