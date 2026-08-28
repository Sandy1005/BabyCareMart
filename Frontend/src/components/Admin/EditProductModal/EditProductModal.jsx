import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../../../services/api";

import "./EditProductModal.css";

function EditProductModal({

    open,

    onClose,

    product,

    onSuccess

}) {

    const [formData, setFormData] = useState({

        name: "",

        brand: "",

        category: "",

        price: "",

        stock: "",

        image: "",

        description: ""

    });

    useEffect(() => {

        if (product) {

            setFormData({

                name: product.name || "",

                brand: product.brand || "",

                category: product.category || "",

                price: product.price || "",

                stock: product.stock || "",

                image: product.image || "",

                description: product.description || ""

            });

        }

    }, [product]);

    if (!open) return null;

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };
        const handleSubmit = async (e) => {

        e.preventDefault();

        if (

            !formData.name ||

            !formData.brand ||

            !formData.category ||

            !formData.price ||

            !formData.stock ||

            !formData.image

        ) {

            toast.error(

                "Please fill all required fields."

            );

            return;

        }

        try {

            await api.put(

                `/products/${product.id}`,

                formData

            );

            toast.success(

                "Product updated successfully."

            );

            onSuccess();

            onClose();

        }

        catch (error) {

            console.log(error);

            toast.error(

                "Unable to update product."

            );

        }

    };

    return (

        <div className="modal-overlay">

            <div className="edit-product-modal">

                <div className="modal-header">

                    <h2>

                        Edit Product

                    </h2>

                    <button

                        type="button"

                        onClick={onClose}

                    >

                        ✕

                    </button>

                </div>

                <form

                    onSubmit={handleSubmit}

                >
                                        <input

                        type="text"

                        name="name"

                        placeholder="Product Name"

                        value={formData.name}

                        onChange={handleChange}

                    />

                    <input

                        type="text"

                        name="brand"

                        placeholder="Brand"

                        value={formData.brand}

                        onChange={handleChange}

                    />

                    <input

                        type="text"

                        name="category"

                        placeholder="Category"

                        value={formData.category}

                        onChange={handleChange}

                    />

                    <input

                        type="number"

                        name="price"

                        placeholder="Price"

                        value={formData.price}

                        onChange={handleChange}

                    />

                    <input

                        type="number"

                        name="stock"

                        placeholder="Stock"

                        value={formData.stock}

                        onChange={handleChange}

                    />

                    <input

                        type="text"

                        name="image"

                        placeholder="Image URL"

                        value={formData.image}

                        onChange={handleChange}

                    />

                    {

                        formData.image && (

                            <img

                                src={formData.image}

                                alt="Preview"

                                className="image-preview"

                            />

                        )

                    }

                    <textarea

                        name="description"

                        rows="4"

                        placeholder="Description"

                        value={formData.description}

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

                            Update Product

                        </button>

                    </div>
                </form>

            </div>

        </div>

    );

}

export default EditProductModal;