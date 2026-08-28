import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    FaUndoAlt,
    FaEye,
    FaTrashAlt,
    FaBoxOpen
} from "react-icons/fa";

import { toast } from "react-toastify";

import api from "../../services/api";

import "../../styles/Customer/Returns.css";

function Returns() {

    const navigate = useNavigate();

    const currentUser = JSON.parse(

        localStorage.getItem("user")

    );

    const [returns, setReturns] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadReturns();

    }, []);

    const loadReturns = async () => {

        try {

            const response = await api.get("/returns");

            const userReturns = response.data.filter(

                item =>

                    item.userId === currentUser?.id

            );

            userReturns.sort(

                (a, b) => b.id - a.id

            );

            setReturns(userReturns);

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Unable to load return requests."

            );

        }

        finally {

            setLoading(false);

        }

    };

    const cancelReturn = async (id) => {

        const confirmCancel = window.confirm(

            "Cancel this return request?"

        );

        if (!confirmCancel) return;

        try {

            await api.delete(

                `/returns/${id}`

            );

            toast.success(

                "Return request cancelled."

            );

            loadReturns();

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Unable to cancel return."

            );

        }

    };

    if (loading) {

        return (

            <div className="returns-loading">

                Loading Returns...

            </div>

        );

    }

    return (

        <div className="returns-page">

            <div className="returns-header">

                <div>

                    <h2>

                        My Returns

                    </h2>

                    <p>

                        Track your return and refund requests.

                    </p>

                </div>

            </div>
                        {

                returns.length === 0 ? (

                    <div className="empty-returns">

                        <FaBoxOpen className="empty-icon" />

                        <h3>

                            No Return Requests

                        </h3>

                        <p>

                            You haven't submitted any return requests yet.

                        </p>

                    </div>

                ) : (

                    <div className="returns-grid">

                        {

                            returns.map((item) => (

                                <div

                                    key={item.id}

                                    className="return-card"

                                >

                                    <div className="return-card-header">

                                        <div>

                                            <h3>

                                                Order #

                                                {item.orderId}

                                            </h3>

                                            <p>

                                                Requested on

                                                {" "}

                                                {item.requestedDate}

                                            </p>

                                        </div>

                                        <span

                                            className={`status-badge ${

                                                item.status

                                                    .toLowerCase()

                                                    .replace(/\s+/g, "-")

                                            }`}

                                        >

                                            {item.status}

                                        </span>

                                    </div>

                                    <div className="return-details">

                                        <div className="detail-row">

                                            <span>

                                                Reason

                                            </span>

                                            <strong>

                                                {item.reason}

                                            </strong>

                                        </div>

                                        <div className="detail-row">

                                            <span>

                                                Refund Method

                                            </span>

                                            <strong>

                                                {item.refundMethod}

                                            </strong>

                                        </div>

                                        <div className="detail-row">

                                            <span>

                                                Refund Status

                                            </span>

                                            <strong>

                                                {

                                                    item.refundStatus ||

                                                    "Pending"

                                                }

                                            </strong>

                                        </div>

                                    </div>

                                    {

                                        item.description && (

                                            <div className="return-description">

                                                <h4>

                                                    Description

                                                </h4>

                                                <p>

                                                    {item.description}

                                                </p>

                                            </div>

                                        )

                                    }

                                    <div className="return-actions">

                                        <button

                                            className="view-btn"

                                            onClick={() =>

                                                navigate(

                                                    `/order-tracking/${item.orderId}`

                                                )

                                            }

                                        >

                                            <FaEye />

                                            View Order

                                        </button>

                                        {

                                            item.status ===

                                                "Requested" && (

                                                <button

                                                    className="cancel-btn"

                                                    onClick={() =>

                                                        cancelReturn(

                                                            item.id

                                                        )

                                                    }

                                                >

                                                    <FaTrashAlt />

                                                    Cancel Request

                                                </button>

                                            )

                                        }

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }
        </div>

    );

}

export default Returns;