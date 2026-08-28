import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import api from "../../services/api";

import "../../styles/Customer/AddAddress.css";

function AddAddress() {

    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [formData, setFormData] = useState({

        userId: currentUser?.id || 1,

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

            if (formData.isDefault) {

                const response = await api.get("/addresses");

                const userAddresses = response.data.filter(

                    address =>

                        address.userId === currentUser?.id

                );

                for (const address of userAddresses) {

                    await api.put(

                        `/addresses/${address.id}`,

                        {

                            ...address,

                            isDefault: false

                        }

                    );

                }

            }

            await api.post(

                "/addresses",

                formData

            );

            toast.success(

                "Address Added Successfully."

            );

            navigate("/saved-addresses");

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Unable to save address."

            );

        }

    };

    return (

        <div className="edit-address-page">

            <div className="edit-address-header">

                <h2>

                    Add New Address

                </h2>

                <p>

                    Enter your delivery address details.

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

                        Save Address

                    </button>

                </div>
            </form>

        </div>

    );

}

export default AddAddress;