import { useState } from "react";
import { toast } from "react-toastify";

import api from "../../../services/api";

import "./AddProductModal.css";

function AddProductModal({

    open,

    onClose,

    onSuccess

}) {

    const initialState = {

        name: "",

        brand: "",

        category: "",

        price: "",

        stock: "",

        image: "",

        description: ""

    };

    const [product, setProduct] = useState(initialState);

    if (!open) return null;

    const handleChange = (e) => {

        setProduct({

            ...product,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (

            !product.name ||

            !product.category ||

            !product.brand ||

            !product.price ||

            !product.stock ||

            !product.image

        ) {

            toast.error(

                "Please fill all required fields."

            );

            return;

        }

        try {

            await api.post(

                "/products",

                product

            );

            toast.success(

                "Product added successfully."

            );

            setProduct(initialState);

            onSuccess();

            onClose();

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Unable to add product."

            );

        }

    };

    return (

        <div className="modal-overlay">

            <div className="add-product-modal">

                <div className="modal-header">

                    <h2>

                        Add Product

                    </h2>

                    <button

                        onClick={onClose}

                    >

                        ✕

                    </button>

                </div>

                <form

                    onSubmit={handleSubmit}

                >

                    <input

                        name="name"

                        placeholder="Product Name"

                        value={product.name}

                        onChange={handleChange}

                    />

                    <input

                        name="brand"

                        placeholder="Brand"

                        value={product.brand}

                        onChange={handleChange}

                    />

                    <input

                        name="category"

                        placeholder="Category"

                        value={product.category}

                        onChange={handleChange}

                    />

                    <input

                        type="number"

                        name="price"

                        placeholder="Price"

                        value={product.price}

                        onChange={handleChange}

                    />

                    <input

                        type="number"

                        name="stock"

                        placeholder="Stock"

                        value={product.stock}

                        onChange={handleChange}

                    />

                    <input

                        name="image"

                        placeholder="Image URL"

                        value={product.image}

                        onChange={handleChange}

                    />

                    {

                        product.image &&

                        <img

                            src={product.image}

                            alt="Preview"

                            className="image-preview"

                        />

                    }

                    <textarea

                        name="description"

                        rows="4"

                        placeholder="Description"

                        value={product.description}

                        onChange={handleChange}

                    />

                    <div className="modal-actions">

                        <button

                            type="button"

                            className="cancel-btn"

                            onClick={onClose}

                        >

                            Cancel

                        </button>

                        <button

                            type="submit"

                            className="save-btn"

                        >

                            Save Product

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddProductModal;