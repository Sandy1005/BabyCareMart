import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import api from "../../services/api";

import "../../styles/Customer/EditAddress.css";

function EditAddress() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        fullName: "",

        mobile: "",

        house: "",

        area: "",

        landmark: "",

        city: "",

        state: "",

        pincode: "",

        addressType: "Home",

        isDefault: false

    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadAddress();

    }, []);

    const loadAddress = async () => {

        try {

            const response = await api.get(`/addresses/${id}`);

            setFormData(response.data);

        }

        catch (error) {

            console.log(error);

            toast.error("Failed to load address.");

        }

        finally {

            setLoading(false);

        }

    };

    const handleChange = (event) => {

        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({

            ...previous,

            [name]:

                type === "checkbox"

                    ? checked

                    : value

        }));

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            await api.put(

                `/addresses/${id}`,

                formData

            );

            toast.success("Address updated successfully.");

            navigate("/saved-addresses");

        }

        catch (error) {

            console.log(error);

            toast.error("Unable to update address.");

        }

    };

    if (loading) {

        return (

            <div className="edit-address-page">

                <h2>Loading Address...</h2>

            </div>

        );

    }

    return (

        <div className="edit-address-page">

            <div className="edit-address-header">

                <h2>Edit Address</h2>

                <p>

                    Update your delivery address.

                </p>

            </div>

            <form

                className="edit-address-form"

                onSubmit={handleSubmit}

            >
                                <div className="form-row">

                    <div className="form-group">

                        <label>Full Name</label>

                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter Full Name"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Mobile Number</label>

                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Enter Mobile Number"
                            required
                        />

                    </div>

                </div>

                <div className="form-row">

                    <div className="form-group full-width">

                        <label>House No / Flat / Building</label>

                        <input
                            type="text"
                            name="house"
                            value={formData.house}
                            onChange={handleChange}
                            placeholder="House No / Flat / Building"
                            required
                        />

                    </div>

                </div>

                <div className="form-row">

                    <div className="form-group">

                        <label>Area / Street</label>

                        <input
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            placeholder="Area / Street"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Landmark</label>

                        <input
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            placeholder="Nearby Landmark"
                        />

                    </div>

                </div>

                <div className="form-row">

                    <div className="form-group">

                        <label>City</label>

                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>State</label>

                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="State"
                            required
                        />

                    </div>

                </div>

                <div className="form-row">

                    <div className="form-group">

                        <label>Pincode</label>

                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="Pincode"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Address Type</label>

                        <select
                            name="addressType"
                            value={formData.addressType}
                            onChange={handleChange}
                        >

                            <option value="Home">

                                Home

                            </option>

                            <option value="Office">

                                Office

                            </option>

                            <option value="Other">

                                Other

                            </option>

                        </select>

                    </div>

                </div>

                <div className="default-checkbox">

                    <input
                        type="checkbox"
                        id="defaultAddress"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                    />

                    <label htmlFor="defaultAddress">

                        Set as Default Address

                    </label>

                </div>

                <div className="form-buttons">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate("/saved-addresses")}
                    >

                        Cancel

                    </button>

                    <button
                        type="submit"
                        className="save-btn"
                    >

                        Update Address

                    </button>

                </div>
            </form>

        </div>

    );

}

export default EditAddress;