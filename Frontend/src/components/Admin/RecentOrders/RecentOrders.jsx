import { useNavigate } from "react-router-dom";

import "./RecentOrders.css";

function RecentOrders({ orders }) {

    const navigate = useNavigate();

    const recentOrders = [...orders]

        .reverse()

        .slice(0, 5);

    return (

        <div className="recent-orders">

            <div className="recent-orders-header">

                <h2>

                    Recent Orders

                </h2>

            </div>

            {

                recentOrders.length === 0 ? (

                    <div className="no-orders">

                        No orders found.

                    </div>

                ) : (

                    recentOrders.map((order) => (

                        <div

                            key={order.id}

                            className="recent-order-card"

                        >

                            <div className="recent-order-info">

                                <h4>

                                    #{order.orderId || order.id}

                                </h4>

                                <p>

                                    {order.customer?.fullName || "Customer"}

                                </p>

                            </div>

                            <div className="recent-order-status">

                                <span

                                    className={`status-badge ${

                                        order.status

                                            ?.toLowerCase()

                                            .replace(/\s+/g, "-")

                                    }`}

                                >

                                    {order.status}

                                </span>

                            </div>

                            <div className="recent-order-total">

                                ₹{Number(order.total || 0).toLocaleString()}

                            </div>

                            <button

                                className="view-order-btn"

                                onClick={() =>

                                    navigate(

                                        `/orders/${order.id}`

                                    )

                                }

                            >

                                View

                            </button>

                        </div>

                    ))

                )

            }

        </div>

    );

}

export default RecentOrders;