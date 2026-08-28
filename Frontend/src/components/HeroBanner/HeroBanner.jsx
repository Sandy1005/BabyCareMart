
import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";

import api from "../../services/api";

import "./HeroBanner.css";



function HeroBanner() {

    const [banners, setBanners] = useState([]);

    const [currentSlide, setCurrentSlide] = useState(0);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleBannerClick = () => {

        const currentBanner =
            banners[currentSlide];

        if (currentBanner.buttonText === "Shop Now") {

            navigate("/products");

            return;
        }


        if (currentBanner.buttonText === "Explore") {

            navigate("/categories/baby-care");

            return;
        }


        if (currentBanner.buttonText === "Buy Now") {

            navigate("/new-arrivals");

            return;
        }

    };

    useEffect(() => {

        fetchBanners();

    }, []);

    const fetchBanners = async () => {

        try {

            setLoading(true);

            const response = await api.get("/banners");

            setBanners(response.data);

        } catch (err) {

            console.error(err);

            setError("Failed to load banners.");

        } finally {

            setLoading(false);

        }

    };
        useEffect(() => {

        if (banners.length === 0) return;

        const interval = setInterval(() => {

            setCurrentSlide((prev) =>

                prev === banners.length - 1 ? 0 : prev + 1

            );

        }, 4000);

        return () => clearInterval(interval);

    }, [banners]);

    const nextSlide = () => {

        setCurrentSlide((prev) =>

            prev === banners.length - 1 ? 0 : prev + 1

        );

    };

    const previousSlide = () => {

        setCurrentSlide((prev) =>

            prev === 0 ? banners.length - 1 : prev - 1

        );

    };

    if (loading) {

        return (

            <section className="hero-loading">

                Loading Banners...

            </section>

        );

    }

    if (error) {

        return (

            <section className="hero-loading">

                {error}

            </section>

        );

    }

    if (banners.length === 0) {

        return null;

    }
        return (

        <section className="hero-banner">

            <div
                className="hero-slide"
                style={{
                    backgroundImage: `url(${banners[currentSlide].image})`
                }}
            >

                <div className="hero-overlay">

                    <span className="hero-tag">

                        BabyCareMart

                    </span>

                    <h1>

                        {banners[currentSlide].title}

                    </h1>

                    <p>

                        {banners[currentSlide].subtitle}

                    </p>

                    <button
                        type="button"
                        className="hero-btn"
                        onClick={handleBannerClick}
                    >

                        {banners[currentSlide].buttonText}

                    </button>

                </div>

                <button
                    className="hero-arrow left-arrow"
                    onClick={previousSlide}
                >

                    <FaChevronLeft />

                </button>

                <button
                    className="hero-arrow right-arrow"
                    onClick={nextSlide}
                >

                    <FaChevronRight />

                </button>

                <div className="hero-dots">

                    {banners.map((banner, index) => (

                        <span

                            key={banner.id}

                            className={
                                currentSlide === index
                                    ? "dot active-dot"
                                    : "dot"
                            }

                            onClick={() => setCurrentSlide(index)}

                        />

                    ))}

                </div>

            </div>

        </section>

    );

}

export default HeroBanner;