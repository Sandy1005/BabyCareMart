import { Link } from "react-router-dom";

import {
    FaBoxOpen,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaCreditCard,
    FaEye
} from "react-icons/fa";

import "./OrderCard.css";


function OrderCard({ order }) {

    /*==========================================
                ORDER DATA
    ==========================================*/

    // Display order number
    const orderNumber =
        order.orderId ||
        order.id ||
        "N/A";


    // IMPORTANT:
    // Use JSON Server's actual ID for navigation.
    const orderResourceId =
        order.id ||
        order.orderId;


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    const total =
        Number(order.total || 0);


    /*==========================================
                PAYMENT METHOD
    ==========================================*/

    const getPaymentMethod = () => {

        const method =
            String(
                order.paymentMethod || ""
            ).toLowerCase();


        if (
            method === "cod" ||
            method === "cash on delivery"
        ) {
            return "Cash On Delivery";
        }


        if (method === "upi") {
            return "UPI";
        }


        if (
            method === "card" ||
            method === "credit card"
        ) {
            return "Credit / Debit Card";
        }


        if (
            method === "netbanking" ||
            method === "net banking"
        ) {
            return "Net Banking";
        }


        if (method === "wallet") {
            return "Wallet";
        }


        return order.paymentMethod || "N/A";
    };


    /*==========================================
                PRODUCT PREVIEW
    ==========================================*/

    const firstItem = items[0];


    return (

        <div className="order-card">

            {/*==========================================
                    ORDER HEADER
            ==========================================*/}

            <div className="order-header">

                <div>

                    <h3>
                        Order #{orderNumber}
                    </h3>

                    <p>

                        <FaCalendarAlt />

                        {order.orderDate || "N/A"}

                    </p>

                </div>


                <span className="order-status">

                    {order.status || "Order Placed"}

                </span>

            </div>


            {/*==========================================
                    ORDER BODY
            ==========================================*/}

            <div className="order-body">

                <div className="order-info">

                    {/* ITEMS */}

                    <p>

                        <FaBoxOpen />

                        <strong>
                            Items :
                        </strong>

                        {items.length}

                    </p>


                    {/* TOTAL */}

                    <p>

                        <FaMoneyBillWave />

                        <strong>
                            Total :
                        </strong>

                        ₹{total.toFixed(2)}

                    </p>


                    {/* PAYMENT */}

                    <p>

                        <FaCreditCard />

                        <strong>
                            Payment :
                        </strong>

                        {getPaymentMethod()}

                    </p>

                </div>


                {/*==========================================
                        PRODUCT PREVIEW
                ==========================================*/}

                <div className="order-preview">

                    {
                        firstItem?.image && (

                            <img
                                src={firstItem.image}
                                alt={
                                    firstItem.name ||
                                    "Product"
                                }
                                onError={(e) => {

                                    e.currentTarget.style.display =
                                        "none";

                                }}
                            />

                        )
                    }


                    <div>

                        <h4>

                            {firstItem?.name ||
                                "Order Products"}

                        </h4>


                        {
                            items.length > 1 && (

                                <p>

                                    +
                                    {items.length - 1}
                                    {" "}
                                    more item(s)

                                </p>

                            )
                        }

                    </div>

                </div>

            </div>


            {/*==========================================
                    ORDER FOOTER
            ==========================================*/}

            <div className="order-footer">

                <Link

                    to={`/orders/${orderResourceId}`}

                    className="view-order-btn"

                >

                    <FaEye />

                    View Details

                </Link>

            </div>

        </div>

    );

}


export default OrderCard;