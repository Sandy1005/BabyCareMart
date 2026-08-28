import {

    FaTrash,

    FaShoppingCart

} from "react-icons/fa";

import "./WishlistItem.css";

function WishlistItem({

    item,

    removeWishlistItem,

    moveToCart

}) {

    return (

        <div className="wishlist-item">

            {/*==========================================
                    PRODUCT IMAGE
            ==========================================*/}

            <div className="wishlist-image">

                <img

                    src={

                        item.image ||

                        "/images/no-image.png"

                    }

                    alt={item.name}

                    onError={(e) => {

                        e.target.src =

                            "/images/no-image.png";

                    }}

                />

            </div>

            {/*==========================================
                    PRODUCT DETAILS
            ==========================================*/}

            <div className="wishlist-details">

                <span className="wishlist-brand">

                    {item.brand || "BabyCareMart"}

                </span>

                <h2 className="wishlist-name">

                    {item.name}

                </h2>

                <p className="wishlist-category">

                    {item.category || "Baby Products"}

                </p>

                {/*==========================================
                        PRICE
                ==========================================*/}

                <div className="wishlist-price">

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
                        STOCK
                ==========================================*/}

                <div className="wishlist-stock">

                    {

                        item.stock > 0

                        ?

                        (

                            <span className="in-stock">

                                ✓ In Stock

                            </span>

                        )

                        :

                        (

                            <span className="out-stock">

                                ✕ Out Of Stock

                            </span>

                        )

                    }

                </div>

            </div>

            {/*==========================================
                    ACTIONS
            ==========================================*/}

            <div className="wishlist-actions">

                <button

                    className="move-cart-btn"

                    onClick={() =>

                        moveToCart(item)

                    }

                    disabled={

                        !item.stock ||

                        item.stock <= 0

                    }

                >

                    <FaShoppingCart />

                    {

                        item.stock > 0

                        ?

                        "Move To Cart"

                        :

                        "Out Of Stock"

                    }

                </button>

                <button

                    className="remove-btn"

                    onClick={() =>

                        removeWishlistItem(

                            item.id

                        )

                    }

                >

                    <FaTrash />

                    Remove

                </button>

            </div>

        </div>

    );

}

export default WishlistItem;