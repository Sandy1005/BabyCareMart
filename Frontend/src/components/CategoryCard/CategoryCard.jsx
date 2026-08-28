import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./CategoryCard.css";

function CategoryCard() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to load categories:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="category-section">
                <div className="category-header">
                    <h2>Shop By Category</h2>
                    <p>Everything your little one needs, all in one place.</p>
                </div>

                <div className="category-grid">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div className="category-card category-skeleton" key={item}>
                            <div className="category-image-box skeleton-box"></div>
                            <div className="skeleton-title"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="category-section">

            <div className="category-header">
                <span className="category-label">EXPLORE OUR COLLECTION</span>

                <h2>Shop By Category</h2>

                <p>
                    Everything your little one needs, all in one place.
                </p>
            </div>

            <div className="category-grid">

                {categories.map((category) => (

                        <div
                            key={category.id}
                            className="category-card"
                           onClick={() => {
                            const categoryRoutes = {
                                "Baby Toys": "/categories/baby-toys",
                                "Baby Clothing": "/categories/baby-clothing",
                                "Feeding": "/categories/feeding",
                                "Diapers": "/categories/diapers",
                                "Baby Care": "/categories/baby-care",
                                "Bath Essentials": "/categories/bath-essentials"
                            };

                            navigate(categoryRoutes[category.name]);

                        }}
                        >
                        <div className="category-image-box">

                            <img
                                src={category.image}
                                alt={category.name}
                                className="category-image"
                                loading="lazy"
                            />

                            <div className="category-overlay">
                                <span>Explore</span>
                                <span className="category-arrow">→</span>
                            </div>

                        </div>

                        <div className="category-content">

                            <h3>{category.name}</h3>

                            <span className="category-shop">
                                Shop Now →
                            </span>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default CategoryCard;