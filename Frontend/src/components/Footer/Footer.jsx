import { Link } from "react-router-dom";

import {

    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaYoutube,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaHeart

} from "react-icons/fa";

import "./Footer.css";

function Footer() {

    return (

        <footer className="footer">

            <div className="footer-container">

                {/* Company */}

                <div className="footer-column company">

                    <h2>

                        BabyCareMart

                    </h2>

                    <p>

                        Everything Your Baby Needs,
                        Delivered With Love & Care.

                    </p>

                    <div className="social-icons">

                        <a href="#">

                            <FaFacebookF />

                        </a>

                        <a href="#">

                            <FaInstagram />

                        </a>

                        <a href="#">

                            <FaTwitter />

                        </a>

                        <a href="#">

                            <FaYoutube />

                        </a>

                    </div>

                </div>
                                {/* Quick Links */}

                <div className="footer-column">

                    <h3>

                        Quick Links

                    </h3>

                    <ul>

                        <li>

                            <Link to="/">

                                Home

                            </Link>

                        </li>

                        <li>

                            <Link to="/products">

                                Products

                            </Link>

                        </li>

                        <li>

                            <Link to="/cart">

                                Cart

                            </Link>

                        </li>

                        <li>

                            <Link to="/wishlist">

                                Wishlist

                            </Link>

                        </li>

                        <li>

                            <Link to="/profile">

                                My Profile

                            </Link>

                        </li>

                    </ul>

                </div>

                {/* Customer Care */}

                <div className="footer-column">

                    <h3>

                        Customer Care

                    </h3>

                    <ul>

                        <li>

                            <Link to="/support">

                                Support Center

                            </Link>

                        </li>

                        <li>

                            <Link to="/returns">

                                Returns & Exchange

                            </Link>

                        </li>

                        <li>

                            <Link to="/track-order">

                                Track Order

                            </Link>

                        </li>

                        <li>

                            <Link to="/privacy-policy">

                                Privacy Policy

                            </Link>

                        </li>

                        <li>

                            <Link to="/terms">

                                Terms & Conditions

                            </Link>

                        </li>

                    </ul>

                </div>

                {/* Categories */}

                <div className="footer-column">

                    <h3>

                        Categories

                    </h3>

                    <ul>

                        <li>
                            <Link to="/categories/baby-toys">
                                Baby Toys
                            </Link>
                        </li>

                        <li>

                            <Link to="/categories/baby-clothing">

                                Baby Clothing

                            </Link>

                        </li>

                        <li>

                            <Link to="/categories/feeding">

                                Feeding

                            </Link>

                        </li>

                        <li>

                            <Link to="/categories/diapers">

                                Diapers

                            </Link>

                        </li>

                        <li>

                            <Link to="/categories/baby-care">

                                Baby Care

                            </Link>

                        </li>

                        <li>

                            <Link to="/categories/bath-essentials">

                                Bath Essentials

                            </Link>

                        </li>

                    </ul>

                </div>

                {/* Contact */}

                <div className="footer-column">

                    <h3>

                        Contact Us

                    </h3>

                    <div className="contact-item">

                        <FaPhoneAlt />

                        <span>

                            +91 98765 43210

                        </span>

                    </div>

                    <div className="contact-item">

                        <FaEnvelope />

                        <span>

                            support@babycaremart.com

                        </span>

                    </div>

                    <div className="contact-item">

                        <FaMapMarkerAlt />

                        <span>

                            Hyderabad, Telangana, India

                        </span>

                    </div>

                </div>

            </div>
                            {/* Footer Bottom */}

                <div className="footer-bottom">

                    <div className="footer-line"></div>

                    <p>

                        © {new Date().getFullYear()} BabyCareMart.

                        All Rights Reserved.

                    </p>

                    <p className="made-with">

                        Made with

                        <FaHeart className="heart-icon" />

                        for Every Little Smile.

                    </p>

                </div>

            </footer>

    );

}

export default Footer;