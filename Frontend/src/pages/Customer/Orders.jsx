import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import OrderCard from "../../components/OrderCard/OrderCard";

import api from "../../services/api";

import "../../styles/Customer/Orders.css";

function Orders() {

    /*==========================================
                    STATES
    ==========================================*/

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);


    /*==========================================
                    FETCH ORDERS
    ==========================================*/

    useEffect(() => {

        fetchOrders();

    }, []);


    const fetchOrders = async () => {

        try {

            const user = JSON.parse(
                localStorage.getItem("user")
            );


            /*==========================================
                    CHECK LOGIN
            ==========================================*/

            if (!user) {

                setOrders([]);

                return;

            }


            /*==========================================
                    FETCH ALL ORDERS
            ==========================================*/

            const response = await api.get(
                "/orders"
            );


            const allOrders = Array.isArray(
                response.data
            )
                ? response.data
                : [];


            /*==========================================
                    FILTER CURRENT USER ORDERS
            ==========================================*/

            const userOrders = allOrders.filter(
                (order) => {

                    return (
                        String(order.userId) ===
                        String(user.id)
                    );

                }
            );


            /*==========================================
                    SORT ORDERS
                    NEWEST FIRST
            ==========================================*/

            const sortedOrders = [
                ...userOrders
            ].sort(
                (a, b) => {

                    const dateA = new Date(
                        a.orderDate ||
                        a.createdAt ||
                        0
                    ).getTime();


                    const dateB = new Date(
                        b.orderDate ||
                        b.createdAt ||
                        0
                    ).getTime();


                    return dateB - dateA;

                }
            );


            /*==========================================
                    SAVE ORDERS
            ==========================================*/

            setOrders(sortedOrders);

        }

        catch (error) {

            console.error(
                "Orders Fetch Error:",
                error
            );

            setOrders([]);

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

                    Loading Orders...

                </div>

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


            <section className="orders-page">


                {/*==========================================
                        PAGE HEADER
                ==========================================*/}

                <div className="orders-header">

                    <h1>
                        My Orders
                    </h1>

                    <p>
                        View your order history and
                        track your purchases.
                    </p>

                </div>


                {/*==========================================
                        EMPTY ORDERS
                ==========================================*/}

                {orders.length === 0 ? (

                    <div className="empty-orders">

                        <img
                            src="/images/empty-orders.png"
                            alt="No Orders"
                            onError={(e) => {

                                e.currentTarget.style.display =
                                    "none";

                            }}
                        />


                        <h2>
                            No Orders Yet
                        </h2>


                        <p>

                            You haven't placed any
                            orders yet. Start shopping
                            to see your orders here.

                        </p>

                    </div>

                ) : (


                    /*==========================================
                            ORDERS LIST
                    ==========================================*/

                    <div className="orders-container">

                        {orders.map(
                            (order) => (

                                <OrderCard
                                    key={
                                        order.id ||
                                        order.orderId
                                    }
                                    order={order}
                                />

                            )
                        )}

                    </div>

                )}

            </section>


            <Footer />

        </>

    );

}


export default Orders;