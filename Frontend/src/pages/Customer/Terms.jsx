import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import "../../styles/Customer/InfoPage.css";


function Terms() {

    return (

        <>

            <Navbar />

            <main className="info-page">

                <div className="info-container">

                    <span>
                        BABYCARE MART
                    </span>

                    <h1>
                        Terms & Conditions
                    </h1>

                    <p>
                        By using BabyCareMart, you agree to
                        follow these terms and conditions.
                    </p>

                    <h2>
                        Orders
                    </h2>

                    <p>
                        Orders are subject to product availability
                        and successful payment or confirmation
                        through the selected payment method.
                    </p>

                    <h2>
                        Payments
                    </h2>

                    <p>
                        Customers are responsible for providing
                        accurate payment and billing information.
                    </p>

                    <h2>
                        Returns & Exchange
                    </h2>

                    <p>
                        Returns and exchanges are handled according
                        to our applicable return policy and product
                        eligibility requirements.
                    </p>

                    <h2>
                        Contact
                    </h2>

                    <p>
                        For questions about these terms, please
                        contact BabyCareMart customer support.
                    </p>

                </div>

            </main>

            <Footer />

        </>

    );

}


export default Terms;