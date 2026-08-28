import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import { toast } from "react-toastify";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import api from "../../services/api";

import "../../styles/Customer/Invoice.css";


function Invoice() {

    const { id } = useParams();

    const navigate = useNavigate();


    /*==========================================
                    STATES
    ==========================================*/

    const [loading, setLoading] = useState(true);

    const [order, setOrder] = useState(null);


    /*==========================================
                FETCH INVOICE
    ==========================================*/

    useEffect(() => {

        fetchInvoice();

    }, [id]);


    const fetchInvoice = async () => {

        try {

            const user = JSON.parse(

                localStorage.getItem("user")

            );


            if (!user) {

                toast.error(

                    "Please login to view invoice."

                );

                navigate("/login");

                return;

            }


            /*
                The URL contains the customer-facing
                orderId.

                Example:

                /invoice/BCM123456
            */

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

                    "Invoice not found."

                );

                navigate("/orders");

                return;

            }


            const userOrder =

                response.data.find(

                    (item) =>

                        String(item.userId) ===

                        String(user.id)

                );


            if (!userOrder) {

                toast.error(

                    "You are not authorized to view this invoice."

                );

                navigate("/orders");

                return;

            }


            setOrder(userOrder);

        }

        catch (error) {

            console.log(

                "Invoice Fetch Error :",

                error

            );

            toast.error(

                "Unable to load invoice."

            );

            navigate("/orders");

        }

        finally {

            setLoading(false);

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

                    Loading Invoice...

                </div>

                <Footer />

            </>

        );

    }


    if (!order) {

        return null;

    }


    /*==========================================
                    ORDER DATA
    ==========================================*/

    const items =

        Array.isArray(order.items)

            ? order.items

            : [];


    const subtotal =

        Number(order.subtotal || 0);


    const shipping =

        Number(order.shipping || 0);


    const discount =

        Number(order.discount || 0);


    const gst =

        Number(order.gst || 0);


    const codCharge =

        Number(order.codCharge || 0);


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
                PAYMENT STATUS
    ==========================================*/

    const getPaymentStatus = () => {

        const method =

            String(

                order.paymentMethod || ""

            ).toLowerCase();


        if (

            method === "cod" ||

            method === "cash on delivery"

        ) {

            return "Pay on Delivery";

        }


        return "Paid";

    };


    /*==========================================
                    JSX
    ==========================================*/

    return (

        <>

            <Navbar />


            <section className="invoice-page">

                <div className="invoice-container">


                    {/*==========================================
                            INVOICE HEADER
                    ==========================================*/}

                    <div className="invoice-header">

                        <div>

                            <h1>

                                BabyCareMart

                            </h1>

                            <p>

                                Tax Invoice

                            </p>

                        </div>


                        <button

                            type="button"

                            className="print-btn"

                            onClick={() =>

                                window.print()

                            }

                        >

                            Print Invoice

                        </button>

                    </div>


                    {/*==========================================
                            INVOICE INFORMATION
                    ==========================================*/}

                    <div className="invoice-info">


                        {/*==========================================
                                INVOICE DETAILS
                        ==========================================*/}

                        <div className="info-card">

                            <h3>

                                Invoice Details

                            </h3>


                            <p>

                                <strong>

                                    Invoice No:

                                </strong>

                                {" "}

                                INV-{order.orderId}

                            </p>


                            <p>

                                <strong>

                                    Order ID:

                                </strong>

                                {" "}

                                {order.orderId}

                            </p>


                            <p>

                                <strong>

                                    Order Date:

                                </strong>

                                {" "}

                                {order.orderDate}

                            </p>


                            <p>

                                <strong>

                                    Status:

                                </strong>

                                {" "}

                                {order.status}

                            </p>

                        </div>


                        {/*==========================================
                                CUSTOMER DETAILS
                        ==========================================*/}

                        <div className="info-card">

                            <h3>

                                Customer Details

                            </h3>


                            <p>

                                <strong>

                                    Name:

                                </strong>

                                {" "}

                                {order.customer?.fullName ||

                                    "N/A"}

                            </p>


                            <p>

                                <strong>

                                    Phone:

                                </strong>

                                {" "}

                                {order.customer?.phone ||

                                    "N/A"}

                            </p>


                            <p>

                                <strong>

                                    Email:

                                </strong>

                                {" "}

                                {order.customer?.email ||

                                    "N/A"}

                            </p>

                        </div>

                    </div>


                    {/*==========================================
                            DELIVERY ADDRESS
                    ==========================================*/}

                    <div className="invoice-address">

                        <h3>

                            Delivery Address

                        </h3>


                        <p>

                            <strong>

                                {order.address?.fullName ||

                                    "N/A"}

                            </strong>

                        </p>


                        <p>

                            {order.address?.mobile ||

                                "N/A"}

                        </p>


                        <p>

                            {order.address?.house ||

                                ""}

                        </p>


                        <p>

                            {order.address?.street ||

                                ""}

                        </p>


                        {

                            order.address?.landmark && (

                                <p>

                                    {order.address.landmark}

                                </p>

                            )

                        }


                        <p>

                            {order.address?.city ||

                                ""}

                            {order.address?.city &&

                                order.address?.state

                                ? ", "

                                : ""}

                            {order.address?.state ||

                                ""}

                            {order.address?.pincode

                                ? ` - ${

                                    order.address.pincode

                                }`

                                : ""

                            }

                        </p>

                    </div>


                    {/*==========================================
                            PAYMENT DETAILS
                    ==========================================*/}

                    <div className="payment-card">

                        <h3>

                            Payment Details

                        </h3>


                        <p>

                            <strong>

                                Payment Method:

                            </strong>

                            {" "}

                            {getPaymentMethod()}

                        </p>


                        <p>

                            <strong>

                                Payment Status:

                            </strong>

                            {" "}

                            {getPaymentStatus()}

                        </p>


                        {

                            order.transactionId && (

                                <p>

                                    <strong>

                                        Transaction ID:

                                    </strong>

                                    {" "}

                                    {order.transactionId}

                                </p>

                            )

                        }

                    </div>


                    {/*==========================================
                            ORDER ITEMS
                    ==========================================*/}

                    <div className="invoice-products">

                        <h3>

                            Ordered Products

                        </h3>


                        <table className="invoice-table">

                            <thead>

                                <tr>

                                    <th>

                                        Product

                                    </th>

                                    <th>

                                        Price

                                    </th>

                                    <th>

                                        Qty

                                    </th>

                                    <th>

                                        Total

                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {

                                    items.map(

                                        (item, index) => {

                                            const price =

                                                Number(

                                                    item.price ||

                                                    item.discountPrice ||

                                                    0

                                                );


                                            const quantity =

                                                Number(

                                                    item.quantity ||

                                                    0

                                                );


                                            return (

                                                <tr

                                                    key={

                                                        item.id ||

                                                        item.productId ||

                                                        index

                                                    }

                                                >

                                                    <td>

                                                        <div className="invoice-product">

                                                            <img

                                                                src={

                                                                    item.image

                                                                }

                                                                alt={

                                                                    item.name

                                                                }

                                                                onError={

                                                                    (e) => {

                                                                        e.currentTarget.style.display =

                                                                            "none";

                                                                    }

                                                                }

                                                            />

                                                            <span>

                                                                {item.name}

                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        ₹{

                                                            price.toFixed(2)

                                                        }

                                                    </td>


                                                    <td>

                                                        {quantity}

                                                    </td>


                                                    <td>

                                                        ₹{

                                                            (

                                                                price *

                                                                quantity

                                                            ).toFixed(2)

                                                        }

                                                    </td>

                                                </tr>

                                            );

                                        }

                                    )

                                }

                            </tbody>

                        </table>

                    </div>


                    {/*==========================================
                            BILL SUMMARY
                    ==========================================*/}

                    <div className="invoice-summary">

                        <div className="summary-row">

                            <span>

                                Subtotal

                            </span>

                            <span>

                                ₹{subtotal.toFixed(2)}

                            </span>

                        </div>


                        <div className="summary-row">

                            <span>

                                Shipping Charges

                            </span>

                            <span>

                                {

                                    shipping === 0

                                        ? "FREE"

                                        : `₹${shipping.toFixed(2)}`

                                }

                            </span>

                        </div>


                        {

                            discount > 0 && (

                                <div className="summary-row">

                                    <span>

                                        Discount

                                    </span>

                                    <span className="discount">

                                        -₹{

                                            discount.toFixed(2)

                                        }

                                    </span>

                                </div>

                            )

                        }


                        {

                            order.coupon?.code && (

                                <div className="summary-row">

                                    <span>

                                        Coupon

                                    </span>

                                    <span>

                                        {order.coupon.code}

                                    </span>

                                </div>

                            )

                        }


                        <div className="summary-row">

                            <span>

                                GST (18%)

                            </span>

                            <span>

                                ₹{gst.toFixed(2)}

                            </span>

                        </div>


                        {

                            codCharge > 0 && (

                                <div className="summary-row">

                                    <span>

                                        COD Charge

                                    </span>

                                    <span>

                                        ₹{codCharge.toFixed(2)}

                                    </span>

                                </div>

                            )

                        }


                        <div className="summary-row grand-total">

                            <span>

                                Grand Total

                            </span>

                            <strong>

                                ₹{total.toFixed(2)}

                            </strong>

                        </div>

                    </div>


                    {/*==========================================
                            FOOTER MESSAGE
                    ==========================================*/}

                    <div className="invoice-footer-message">

                        <h3>

                            Thank You for Shopping with BabyCareMart!

                        </h3>

                        <p>

                            We appreciate your trust in BabyCareMart.

                        </p>

                        <p>

                            Everything Your Baby Needs.

                        </p>

                    </div>

                </div>

            </section>


            <Footer />

        </>

    );

}


export default Invoice;