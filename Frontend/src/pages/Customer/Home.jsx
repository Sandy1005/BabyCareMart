import { useSelector, useDispatch } from "react-redux";

import Navbar from "../../components/Navbar/Navbar";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import Footer from "../../components/Footer/Footer";



import "../../styles/Customer/Home.css";
import api from "../../services/api";

function Home() {
  return (
   <>
    <Navbar />

    <HeroBanner />

    <CategoryCard />

    <FeaturedProducts />

    <Footer />
  </>
  );
}

export default Home;