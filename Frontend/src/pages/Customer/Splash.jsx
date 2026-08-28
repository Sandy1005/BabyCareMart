import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBaby, FaHeart } from "react-icons/fa";
import "../../styles/Customer/Splash.css";
// import api from "../../services/api";

const SPLASH_DURATION = 3000;

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash">

      {/* Floating Background Shapes */}

      <span className="shape shape1">🧸</span>
      <span className="shape shape2">🍼</span>
      <span className="shape shape3">☁️</span>
      <span className="shape shape4">⭐</span>
      <span className="shape shape5">🎈</span>

      <div className="logo-wrapper">

        <div className="logo-circle">
          <FaBaby />
        </div>

        <h1>BabyCareMart</h1>

        <p>Everything Your Baby Needs</p>

        <div className="features">

          <span>
            <FaHeart />
            Safe
          </span>

          <span>🍼 Care</span>

          <span>🧸 Love</span>

        </div>

        <div className="loader">

          <span></span>
          <span></span>
          <span></span>
          <span></span>

        </div>

      </div>

    </div>
  );
}

export default Splash;