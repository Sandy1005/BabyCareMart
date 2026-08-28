import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Lock,
  Bell,
  Camera,
  Pencil,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

import "../../styles/Customer/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const savedImage = localStorage.getItem("profileImage");

      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error("Unable to load profile:", error);
    }
  }, []);

  const getUserName = () => {
    if (!user) return "Customer";

    return (
      user.name ||
      user.fullName ||
      user.username ||
      "Customer"
    );
  };

  const getUserEmail = () => {
    if (!user) return "No email added";

    return user.email || "No email added";
  };

  const getUserPhone = () => {
    if (!user) return "Not added";

    return user.phone ||
      user.phoneNumber ||
      user.mobile ||
      "Not added";
  };

  const getInitial = () => {
    const name = getUserName();

    return name.charAt(0).toUpperCase();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Profile picture must be less than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result;

      setProfileImage(image);
      localStorage.setItem("profileImage", image);
    };

    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("user");

    navigate("/login");
  };

  const overviewItems = [
    {
      title: "My Orders",
      description: "View your purchases and track deliveries.",
      icon: ShoppingBag,
      route: "/orders",
    },
    {
      title: "Wishlist",
      description: "View products you saved for later.",
      icon: Heart,
      route: "/wishlist",
    },
    {
      title: "Saved Addresses",
      description: "Manage your delivery addresses.",
      icon: MapPin,
      route: "/addresses",
    },
    {
      title: "Security",
      description: "Manage your password and account security.",
      icon: Lock,
      route: "/change-password",
    },
  ];

  const sidebarItems = [
    {
      label: "My Profile",
      icon: User,
      active: true,
      action: () => navigate("/profile"),
    },
    {
      label: "My Orders",
      icon: ShoppingBag,
      action: () => navigate("/orders"),
    },
    {
      label: "Wishlist",
      icon: Heart,
      action: () => navigate("/wishlist"),
    },
    {
      label: "Saved Addresses",
      icon: MapPin,
      action: () => navigate("/addresses"),
    },
    {
      label: "Change Password",
      icon: Lock,
      action: () => navigate("/change-password"),
    },
    {
      label: "Notifications",
      icon: Bell,
      action: () => navigate("/notifications"),
    },
  ];

  return (
    <div className="profile-page">

      {/* ================= PROFILE HEADER ================= */}

      <section className="profile-header">

        <div className="profile-header-content">

          <div className="profile-avatar-wrapper">

            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="profile-avatar-image"
              />
            ) : (
              <div className="profile-avatar">
                {getInitial()}
              </div>
            )}

            <label
              htmlFor="profile-image-upload"
              className="profile-camera-button"
              title="Change profile picture"
            >
              <Camera size={17} />

              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>

          </div>

          <div className="profile-header-info">

            <div className="profile-welcome">
              Welcome back
            </div>

            <h1>{getUserName()}</h1>

            <p>{getUserEmail()}</p>

          </div>

          <div className="profile-header-actions">

            <button
              className="profile-edit-button"
              onClick={() => navigate("/edit-profile")}
            >
              <Pencil size={17} />
              Edit Profile
            </button>

          </div>

        </div>

      </section>


      {/* ================= MAIN CONTENT ================= */}

      <main className="profile-container">

        {/* ================= SIDEBAR ================= */}

        <aside className="profile-sidebar">

          <div className="sidebar-title">
            My Account
          </div>

          <div className="sidebar-menu">

            {sidebarItems.map((item) => {

              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  className={`sidebar-item ${
                    item.active ? "active" : ""
                  }`}
                  onClick={item.action}
                >
                  <Icon size={18} />

                  <span>{item.label}</span>

                  <ChevronRight
                    size={15}
                    className="sidebar-arrow"
                  />
                </button>
              );
            })}

          </div>

          <div className="sidebar-divider" />

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </aside>


        {/* ================= PROFILE CONTENT ================= */}

        <section className="profile-content">

          {/* PERSONAL INFORMATION */}

          <div className="profile-card">

            <div className="card-heading">

              <div>
                <h2>Personal Information</h2>

                <p>
                  Your basic account information
                </p>
              </div>

              <button
                className="small-edit-button"
                onClick={() => navigate("/edit-profile")}
              >
                <Pencil size={15} />
                Edit
              </button>

            </div>


            <div className="personal-info-grid">

              <div className="info-item">

                <span className="info-label">
                  Full Name
                </span>

                <strong>
                  {getUserName()}
                </strong>

              </div>


              <div className="info-item">

                <span className="info-label">
                  Email Address
                </span>

                <strong>
                  {getUserEmail()}
                </strong>

              </div>


              <div className="info-item">

                <span className="info-label">
                  Phone Number
                </span>

                <strong>
                  {getUserPhone()}
                </strong>

              </div>


              <div className="info-item">

                <span className="info-label">
                  Account Type
                </span>

                <strong>
                  Customer
                </strong>

              </div>

            </div>

          </div>


          {/* ACCOUNT OVERVIEW */}

          <div className="profile-card">

            <div className="card-heading">

              <div>
                <h2>Account Overview</h2>

                <p>
                  Quick access to your account
                </p>
              </div>

            </div>


            <div className="overview-grid">

              {overviewItems.map((item) => {

                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    className="overview-item"
                    onClick={() => navigate(item.route)}
                  >

                    <div className="overview-icon">
                      <Icon size={21} />
                    </div>

                    <div className="overview-content">

                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.description}
                      </p>

                    </div>

                    <ChevronRight
                      size={18}
                      className="overview-arrow"
                    />

                  </button>
                );
              })}

            </div>

          </div>


          {/* ACCOUNT STATUS */}

          <div className="profile-bottom-grid">

            <div className="profile-card status-card">

              <div className="status-icon">
                <ShieldCheck size={23} />
              </div>

              <div className="status-content">

                <h2>Account Status</h2>

                <p>
                  Your account is active and secure.
                </p>

                <div className="status-badge">
                  <CheckCircle size={14} />
                  Active
                </div>

              </div>

            </div>


            <div className="profile-card completion-card">

              <div className="completion-top">

                <div>
                  <h2>Profile Completion</h2>

                  <p>
                    Complete your profile for a better experience.
                  </p>
                </div>

                <strong>
                  85%
                </strong>

              </div>

              <div className="progress-container">

                <div
                  className="progress-bar"
                  style={{ width: "85%" }}
                />

              </div>

              <span className="completion-text">
                Almost there — complete the remaining details.
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Profile;