import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
    FaMapMarkerAlt,
    FaPlus,
    FaEdit,
    FaTrash,
    FaCheckCircle
} from "react-icons/fa";

import api from "../../services/api";

import "../../styles/Customer/SavedAddresses.css";

function SavedAddresses() {

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

            loadAddresses();

        }

        catch (error) {

            console.log(error);

        }

    };

    const setDefaultAddress = async (selected) => {

        try {

            const response = await api.get("/addresses");

            const userAddresses = response.data.filter(

                address =>

                    address.userId === currentUser.id

            );

            for (const address of userAddresses) {

                await api.put(

                    `/addresses/${address.id}`,

                    {

                        ...address,

                        isDefault:

                            address.id === selected.id

                    }

                );

            }

            loadAddresses();

        }

        catch (error) {

            console.log(error);

        }

    };

    if (loading) {

        return (

            <div className="saved-addresses-page">

                <h2>

                    Loading Addresses...

                </h2>

            </div>

        );

    }

    return (

        <div className="saved-addresses-page">

            <div className="address-header">

                <div>

                    <h2>

                        Saved Addresses

                    </h2>

                    <p>

                        Manage your delivery addresses

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

                            You haven't added any delivery address yet.

                        </p>

                        <button

                            className="add-first-address-btn"

                            onClick={() => navigate("/add-address")}

                        >

                            <FaPlus />

                            Add Your First Address

                        </button>

                    </div>

                ) : (

                    <div className="address-grid">

                        {

                            addresses.map((address) => (

                                <div

                                    className="address-card"

                                    key={address.id}

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
        </div>

    );

}

export default SavedAddresses;