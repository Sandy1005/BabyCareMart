import {

    FaTrash,

    FaMinus,

    FaPlus

} from "react-icons/fa";

import "./CartItem.css";

function CartItem({

    item,

    removeItem,

    updateQuantity

}) {

    return (

        <div className="cart-item">

            {/*==========================================
                    PRODUCT IMAGE
            ==========================================*/}

            <div className="cart-image">

                <img

                    src={

                        item.image ||

                        "/images/no-image.png"

                    }

                    alt={item.name}

                    onError={(e)=>{

                        e.target.src="/images/no-image.png";

                    }}

                />

            </div>

            {/*==========================================
                    PRODUCT DETAILS
            ==========================================*/}

            <div className="cart-details">

                <h3>

                    {item.name}

                </h3>

                <p className="cart-brand">

                    {item.brand}

                </p>

                <div className="cart-price">

                    <span className="current-price">

                        ₹{item.price}

                    </span>

                    {

                        item.originalPrice >

                        item.price

                        &&

                        (

                            <span className="old-price">

                                ₹{item.originalPrice}

                            </span>

                        )

                    }

                </div>

                {/*==========================================
                        QUANTITY
                ==========================================*/}

                <div className="quantity-controls">

                    <button

                        disabled={

                            item.quantity===1

                        }

                        onClick={()=>

                            updateQuantity(

                                item.id,

                                item.quantity-1

                            )

                        }

                    >

                        <FaMinus/>

                    </button>

                    <span>

                        {item.quantity}

                    </span>

                    <button

                        disabled={

                            item.quantity===item.stock

                        }

                        onClick={()=>

                            updateQuantity(

                                item.id,

                                item.quantity+1

                            )

                        }

                    >

                        <FaPlus/>

                    </button>

                </div>

                {/*==========================================
                        ITEM TOTAL
                ==========================================*/}

                <div className="item-total">

                    Total :

                    <strong>

                        ₹{

                            item.price *

                            item.quantity

                        }

                    </strong>

                </div>

            </div>

            {/*==========================================
                    REMOVE BUTTON
            ==========================================*/}

            <button

                className="remove-button"

                onClick={()=>removeItem(item.id)}

            >

                <FaTrash/>

                Remove

            </button>

        </div>

    );

}

export default CartItem;