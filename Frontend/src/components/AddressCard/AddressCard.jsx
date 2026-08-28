import "./AddressCard.css";

import {

    FaHome,

    FaBuilding,

    FaMapMarkerAlt,

    FaPhone,

    FaEdit,

    FaTrash,

    FaCheckCircle

} from "react-icons/fa";

function AddressCard({

    address,

    onEdit,

    onDelete,

    onSetDefault

}) {

    const getAddressIcon = () => {

        switch (address.type) {

            case "Home":

                return <FaHome />;

            case "Work":

                return <FaBuilding />;

            default:

                return <FaMapMarkerAlt />;

        }

    };

    return (

        <div

            className={`address-card ${

                address.isDefault

                    ? "default"

                    : ""

            }`}

        >

            <div className="address-top">

                <div className="address-type">

                    {getAddressIcon()}

                    <span>

                        {address.type}

                    </span>

                </div>

                {

                    address.isDefault && (

                        <div className="default-badge">

                            <FaCheckCircle />

                            <span>

                                Default

                            </span>

                        </div>

                    )

                }

            </div>

            <div className="address-body">

                <h3>

                    {address.fullName}

                </h3>

                <p>

                    <FaPhone />

                    {address.mobile}

                </p>

                <p>

                    {address.house}

                </p>

                <p>

                    {address.street}

                </p>

                {

                    address.landmark && (

                        <p>

                            {address.landmark}

                        </p>

                    )

                }

                <p>

                    {address.city},

                    {" "}

                    {address.state}

                </p>

                <p>

                    {address.pincode}

                </p>

            </div>
                        {/*==========================================
                    ACTION BUTTONS
            ==========================================*/}

            <div className="address-actions">

                {

                    !address.isDefault && (

                        <button

                            className="default-btn"

                            onClick={() =>

                                onSetDefault(address)

                            }

                        >

                            <FaCheckCircle />

                            <span>

                                Set Default

                            </span>

                        </button>

                    )

                }

                <button

                    className="edit-btn"

                    onClick={() =>

                        onEdit(address)

                    }

                >

                    <FaEdit />

                    <span>

                        Edit

                    </span>

                </button>

                <button

                    className="delete-btn"

                    onClick={() =>

                        onDelete(address.id)

                    }

                >

                    <FaTrash />

                    <span>

                        Delete

                    </span>

                </button>

            </div>
        </div>

    );

}

export default AddressCard;