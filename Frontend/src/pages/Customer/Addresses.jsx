import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaArrowRight
} from "react-icons/fa";

import { toast } from "react-toastify";

import api from "../../services/api";

import "../../styles/Customer/Addresses.css";

function Addresses() {

    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [addresses, setAddresses] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadAddresses();

    }, []);

    const loadAddresses = async () => {

        try {

            const response = await api.get("/addresses");

            const userAddresses = response.data.filter(

                (address) =>

                    address.userId === currentUser?.id

            );

            setAddresses(userAddresses);

        }

        catch (error) {

            console.log(error);

            toast.error("Failed to load addresses.");

        }

        finally {

            setLoading(false);

        }

    };

    const deleteAddress = async (id) => {

        const confirmDelete = window.confirm(

            "Delete this address?"

        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/addresses/${id}`);

            toast.success("Address deleted.");

            loadAddresses();

        }

        catch (error) {

            console.log(error);

            toast.error("Unable to delete address.");

        }

    };

    const setDefaultAddress = async (selectedAddress) => {

        try {

            for (const address of addresses) {

                await api.put(

                    `/addresses/${address.id}`,

                    {

                        ...address,

                        isDefault:

                            address.id === selectedAddress.id

                    }

                );

            }

            toast.success(

                "Default address updated."

            );

            loadAddresses();

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Unable to update default address."

            );

        }

    };

    if (loading) {

        return (

            <div className="addresses-page">

                <h2>

                    Loading Addresses...

                </h2>

            </div>

        );

    }

    return (

        <div className="addresses-page">

            <div className="addresses-header">

                <div>

                    <h2>

                        My Addresses

                    </h2>

                    <p>

                        Manage your delivery addresses.

                    </p>

                </div>

                <button

                    className="add-address-btn"

                    onClick={() =>

                        navigate("/add-address")

                    }

                >

                    <FaPlus />

                    Add Address

                </button>

            </div>
                        {

                addresses.length === 0 ? (

                    <div className="empty-address">

                        <FaMapMarkerAlt className="empty-icon" />

                        <h3>

                            No Saved Addresses

                        </h3>

                        <p>

                            Add your first delivery address to continue shopping.

                        </p>

                        <button

                            className="add-first-address-btn"

                            onClick={() => navigate("/add-address")}

                        >

                            <FaPlus />

                            Add Address

                        </button>

                    </div>

                ) : (

                    <div className="address-grid">

                        {

                            addresses.map((address) => (

                                <div

                                    key={address.id}

                                    className="address-card"

                                >

                                    <div className="address-card-header">

                                        <div className="address-type">

                                            {

                                                address.addressType

                                            }

                                        </div>

                                        {

                                            address.isDefault && (

                                                <span className="default-badge">

                                                    <FaCheckCircle />

                                                    Default

                                                </span>

                                            )

                                        }

                                    </div>

                                    <h4>

                                        {address.fullName}

                                    </h4>

                                    <p>

                                        {address.house}

                                    </p>

                                    <p>

                                        {address.area}

                                    </p>

                                    <p>

                                        {address.landmark}

                                    </p>

                                    <p>

                                        {address.city},

                                        {" "}

                                        {address.state}

                                    </p>

                                    <p>

                                        {address.pincode}

                                    </p>

                                    <h5>

                                        Mobile :

                                        {" "}

                                        {address.mobile}

                                    </h5>

                                    <div className="address-actions">

                                        <button

                                            className="edit-btn"

                                            onClick={() =>

                                                navigate(

                                                    `/edit-address/${address.id}`

                                                )

                                            }

                                        >

                                            <FaEdit />

                                            Edit

                                        </button>

                                        <button

                                            className="delete-btn"

                                            onClick={() =>

                                                deleteAddress(address.id)

                                            }

                                        >

                                            <FaTrash />

                                            Delete

                                        </button>

                                        {

                                            !address.isDefault && (

                                                <button

                                                    className="default-btn"

                                                    onClick={() =>

                                                        setDefaultAddress(address)

                                                    }

                                                >

                                                    <FaCheckCircle />

                                                    Set Default

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

            {

                addresses.length > 0 && (

                    <div className="checkout-address-section">

                        <button

                            className="continue-checkout-btn"

                            onClick={() => navigate("/checkout")}

                        >

                            Continue to Checkout

                            <FaArrowRight />

                        </button>

                    </div>

                )

            }
        </div>

    );

}

export default Addresses;