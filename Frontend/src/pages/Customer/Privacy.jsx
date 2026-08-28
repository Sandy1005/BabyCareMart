import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import "../../styles/Customer/InfoPage.css";


function PrivacyPolicy() {

    return (

        <>

            <Navbar />

            <main className="info-page">

                <div className="info-container">

                    <span>
                        BABYCARE MART
                    </span>

                    <h1>
                        Privacy Policy
                    </h1>

                    <p>
                        At BabyCareMart, we respect your
                        privacy and are committed to protecting
                        your personal information.
                    </p>

                    <h2>
                        Information We Collect
                    </h2>

                    <p>
                        We may collect information such as
                        your name, email address, phone number,
                        delivery address and order details when
                        you use our services.
                    </p>

                    <h2>
                        How We Use Your Information
                    </h2>

                    <p>
                        Your information is used to process
                        orders, provide customer support,
                        improve our services and communicate
                        important updates.
                    </p>

                    <h2>
                        Data Security
                    </h2>

                    <p>
                        We take reasonable measures to protect
                        your information from unauthorized access,
                        misuse or disclosure.
                    </p>

                </div>

            </main>

            <Footer />

        </>

    );

}


export default PrivacyPolicy;