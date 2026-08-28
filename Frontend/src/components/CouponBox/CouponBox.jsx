import { useEffect, useState } from "react";

import { FaTag } from "react-icons/fa";

import { toast } from "react-toastify";

import api from "../../services/api";

import "./CouponBox.css";

function CouponBox({

    subtotal,

    shipping,

    onCouponApplied

}) {

    const [couponCode, setCouponCode] = useState("");

    const [coupons, setCoupons] = useState([]);

    const [loading, setLoading] = useState(false);

    const [appliedCoupon, setAppliedCoupon] = useState(null);

    useEffect(() => {

        loadCoupons();

    }, []);

    const loadCoupons = async () => {

        try {

            const response = await api.get("/coupons");

            setCoupons(response.data);

        }

        catch (error) {

            console.log(error);

            toast.error("Unable to load coupons.");

        }

    };

    const applyCoupon = () => {

        if (!couponCode.trim()) {

            toast.error("Please enter a coupon code.");

            return;

        }

        const coupon = coupons.find(

            item =>

                item.code.toUpperCase() ===

                couponCode.toUpperCase()

        );

        if (!coupon) {

            toast.error("Invalid coupon code.");

            return;

        }

        if (!coupon.active) {

            toast.error("Coupon is inactive.");

            return;

        }

        if (subtotal < coupon.minAmount) {

            toast.error(

                `Minimum order amount is ₹${coupon.minAmount}`

            );

            return;

        }

        let discount = 0;

        let updatedShipping = shipping;
                if (coupon.type === "percentage") {

            discount =

                Math.round(

                    (subtotal * coupon.value) / 100

                );

        }

        else if (coupon.type === "flat") {

            discount = coupon.value;

        }

        else if (coupon.type === "shipping") {

            updatedShipping = 0;

        }

        const total =

            subtotal -

            discount +

            updatedShipping;

        const applied = {

            ...coupon,

            discount,

            shipping: updatedShipping,

            total

        };

        setAppliedCoupon(applied);

        onCouponApplied(applied);

        toast.success(

            `${coupon.code} applied successfully!`

        );

    };

    const removeCoupon = () => {

        setAppliedCoupon(null);

        setCouponCode("");

        onCouponApplied({

            discount: 0,

            shipping,

            total: subtotal + shipping

        });

        toast.info("Coupon removed.");

    };

    return (

        <div className="coupon-box">

            <div className="coupon-header">

                <FaTag />

                <h3>

                    Apply Coupon

                </h3>

            </div>

            {

                !appliedCoupon ? (

                    <>

                        <div className="coupon-input-group">

                            <input

                                type="text"

                                placeholder="Enter coupon code"

                                value={couponCode}

                                onChange={(event) =>

                                    setCouponCode(

                                        event.target.value

                                    )

                                }

                            />

                            <button

                                onClick={applyCoupon}

                                disabled={loading}

                            >

                                Apply

                            </button>

                        </div>

                        <div className="available-coupons">

                            <h4>

                                Available Coupons

                            </h4>

                            <ul>

                                {

                                    coupons.map((coupon) => (

                                        <li

                                            key={coupon.id}

                                        >

                                            <strong>

                                                {coupon.code}

                                            </strong>

                                            {" - "}

                                            {

                                                coupon.type ===

                                                "percentage"

                                                    ? `${coupon.value}% OFF`

                                                    : coupon.type ===

                                                      "flat"

                                                    ? `₹${coupon.value} OFF`

                                                    : "Free Delivery"

                                            }

                                        </li>

                                    ))

                                }

                            </ul>

                        </div>

                    </>

                ) : (
                                        <div className="applied-coupon">

                        <div className="coupon-success">

                            <h4>

                                Coupon Applied Successfully

                            </h4>

                            <p>

                                <strong>

                                    {appliedCoupon.code}

                                </strong>

                            </p>

                        </div>

                        <div className="coupon-summary">

                            <div className="summary-row">

                                <span>

                                    Discount

                                </span>

                                <strong className="discount">

                                    - ₹{appliedCoupon.discount}

                                </strong>

                            </div>

                            <div className="summary-row">

                                <span>

                                    Shipping

                                </span>

                                <strong>

                                    {

                                        appliedCoupon.shipping === 0

                                            ? "FREE"

                                            : `₹${appliedCoupon.shipping}`

                                    }

                                </strong>

                            </div>

                            <div className="summary-row total">

                                <span>

                                    Final Total

                                </span>

                                <strong>

                                    ₹{appliedCoupon.total}

                                </strong>

                            </div>

                        </div>

                        <button

                            className="remove-coupon-btn"

                            onClick={removeCoupon}

                        >

                            Remove Coupon

                        </button>

                    </div>

                )

            }

        </div>

    );

}

export default CouponBox;