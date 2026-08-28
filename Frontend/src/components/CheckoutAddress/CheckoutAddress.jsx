import { useNavigate } from "react-router-dom";
import {
    FaMapMarkerAlt,
    FaExchangeAlt,
    FaPlus
} from "react-icons/fa";

import "./CheckoutAddress.css";

function CheckoutAddress({
    address
}) {

    const navigate = useNavigate();

    /*==========================================
                NO ADDRESS
    ==========================================*/

    if (!address) {

        return (

            <div className="checkout-address">

                <div className="checkout-address-header">

                    <h2>
                        Delivery Address
                    </h2>

                </div>

                <div className="no-address">

                    <FaMapMarkerAlt
                        className="address-icon"
                    />

                    <h3>
                        No Address Found
                    </h3>

                    <p>
                        Please add a delivery address before placing your order.
                    </p>

                    <button
                        className="add-address-btn"
                        onClick={() => navigate("/add-address")}
                    >

                        <FaPlus />

                        Add Address

                    </button>

                </div>

            </div>

        );

    }

    /*==========================================
                ADDRESS DISPLAY
    ==========================================*/

    return (

        <div className="checkout-address">

            <div className="checkout-address-header">

                <h2>
                    Delivery Address
                </h2>

                <button
                    className="change-address-btn"
                    onClick={() => navigate("/addresses")}
                >

                    <FaExchangeAlt />

                    Change

                </button>

            </div>

            <div className="address-box">

                <h3>
                    {address.fullName}
                </h3>

                <p>
                    {address.mobile}
                </p>

                <p>
                    {address.house}
                </p>

                <p>
                    {address.area}
                </p>

                {address.landmark && (

                    <p>
                        {address.landmark}
                    </p>

                )}

                <p>
                    {address.city}, {address.state}
                </p>

                <p>
                    {address.pincode}
                </p>

                <span className="address-type">

                    {address.addressType}

                </span>

            </div>

        </div>

    );

}

export default CheckoutAddress;