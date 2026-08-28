import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Customer/Support.css";

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "Go to My Orders, open the order you want to track, and click the Track Order button. You can see the current order status and delivery progress there.",
  },
  {
    question: "How can I cancel my order?",
    answer:
      "Open My Orders, select the order, and click Cancel Order. Cancellation is available only while the order is eligible for cancellation.",
  },
  {
    question: "How can I return or exchange a product?",
    answer:
      "Open the delivered order from My Orders and select Return / Exchange. Choose the product, select a reason, and submit your request.",
  },
  {
    question: "What payment methods are available?",
    answer:
      "BabyCareMart supports Cash on Delivery, UPI, Credit/Debit Card, Net Banking and Wallet payments.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery time depends on your location and the product. You can check the latest delivery status from the Track Order section.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can contact our support team using the contact form on this page or use the phone and email details provided below.",
  },
];

function Support() {
  const [openFaq, setOpenFaq] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    category: "General Query",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      return;
    }

    const ticket = {
      id: `TKT${Date.now()}`,
      ...formData,
      status: "Open",
      createdAt: new Date().toISOString(),
    };

    const existingTickets = JSON.parse(
      localStorage.getItem("babycaremart_support_tickets") || "[]"
    );

    localStorage.setItem(
      "babycaremart_support_tickets",
      JSON.stringify([ticket, ...existingTickets])
    );

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      orderId: "",
      category: "General Query",
      message: "",
    });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="support-page">
      {/* ================= HERO ================= */}
      <section className="support-hero">
        <div className="support-container">
          <div className="support-hero-content">
            <span className="support-badge">Customer Support</span>

            <h1>How can we help you?</h1>

            <p>
              We're here to help with orders, payments, returns, exchanges and
              anything else you need.
            </p>

            <div className="support-hero-actions">
              <a href="#contact-support" className="support-primary-btn">
                Contact Support
              </a>

              <a href="#faq" className="support-secondary-btn">
                View FAQs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK HELP ================= */}
      <section className="support-section">
        <div className="support-container">
          <div className="support-section-heading">
            <span>Quick Help</span>
            <h2>What do you need help with?</h2>
            <p>
              Select a category to quickly access the most useful section.
            </p>
          </div>

          <div className="support-help-grid">
            <Link to="/orders" className="support-help-card">
              <div className="support-help-icon order-icon">📦</div>

              <div>
                <h3>Orders</h3>
                <p>View orders, order details and purchase history.</p>
              </div>

              <span className="support-card-arrow">→</span>
            </Link>

            <Link to="/orders" className="support-help-card">
              <div className="support-help-icon tracking-icon">🚚</div>

              <div>
                <h3>Track Order</h3>
                <p>Check the latest status and delivery progress.</p>
              </div>

              <span className="support-card-arrow">→</span>
            </Link>

            <Link to="/returns" className="support-help-card">
              <div className="support-help-icon return-icon">↩</div>

              <div>
                <h3>Returns & Exchange</h3>
                <p>Manage your return and exchange requests.</p>
              </div>

              <span className="support-card-arrow">→</span>
            </Link>

            <Link to="/orders" className="support-help-card">
              <div className="support-help-icon payment-icon">💳</div>

              <div>
                <h3>Payments</h3>
                <p>Get help with payment methods and transactions.</p>
              </div>

              <span className="support-card-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CONTACT CARDS ================= */}
      <section className="support-contact-strip">
        <div className="support-container">
          <div className="support-contact-grid">
            <div className="support-contact-card">
              <div className="support-contact-icon">📞</div>

              <div>
                <span>Call Us</span>
                <h3>+91 98765 43210</h3>
                <p>Mon - Sat, 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="support-contact-card">
              <div className="support-contact-icon">✉</div>

              <div>
                <span>Email Us</span>
                <h3>support@babycaremart.com</h3>
                <p>We'll respond as soon as possible.</p>
              </div>
            </div>

            <div className="support-contact-card">
              <div className="support-contact-icon">💬</div>

              <div>
                <span>Customer Support</span>
                <h3>We're here to help</h3>
                <p>Get assistance with your shopping experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section
        className="support-section support-contact-section"
        id="contact-support"
      >
        <div className="support-container">
          <div className="support-contact-layout">
            <div className="support-contact-info">
              <span className="support-mini-label">GET IN TOUCH</span>

              <h2>Send us a message</h2>

              <p>
                Having a problem with your order or need assistance? Tell us
                what happened and our support team will help you.
              </p>

              <div className="support-info-list">
                <div className="support-info-item">
                  <span>✓</span>
                  <div>
                    <strong>Order Assistance</strong>
                    <p>Help with orders, tracking and cancellations.</p>
                  </div>
                </div>

                <div className="support-info-item">
                  <span>✓</span>
                  <div>
                    <strong>Returns & Exchanges</strong>
                    <p>Get assistance with return and exchange requests.</p>
                  </div>
                </div>

                <div className="support-info-item">
                  <span>✓</span>
                  <div>
                    <strong>Payment Support</strong>
                    <p>Resolve payment and checkout related problems.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="support-form-card">
              <div className="support-form-header">
                <h3>Contact Support</h3>
                <p>Fill in the details below.</p>
              </div>

              {submitted && (
                <div className="support-success-message">
                  <span>✓</span>

                  <div>
                    <strong>Request submitted successfully!</strong>
                    <p>
                      Our support team will review your request and contact you
                      soon.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="support-form-row">
                  <div className="support-form-group">
                    <label htmlFor="support-name">
                      Full Name <span>*</span>
                    </label>

                    <input
                      id="support-name"
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="support-form-group">
                    <label htmlFor="support-email">
                      Email Address <span>*</span>
                    </label>

                    <input
                      id="support-email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="support-form-row">
                  <div className="support-form-group">
                    <label htmlFor="support-order">
                      Order ID
                    </label>

                    <input
                      id="support-order"
                      type="text"
                      name="orderId"
                      placeholder="Example: ORD123456789"
                      value={formData.orderId}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="support-form-group">
                    <label htmlFor="support-category">
                      Issue Type
                    </label>

                    <select
                      id="support-category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="General Query">
                        General Query
                      </option>

                      <option value="Order Issue">Order Issue</option>

                      <option value="Payment Issue">
                        Payment Issue
                      </option>

                      <option value="Delivery Issue">
                        Delivery Issue
                      </option>

                      <option value="Return / Exchange">
                        Return / Exchange
                      </option>

                      <option value="Product Issue">
                        Product Issue
                      </option>

                      <option value="Account Issue">
                        Account Issue
                      </option>
                    </select>
                  </div>
                </div>

                <div className="support-form-group">
                  <label htmlFor="support-message">
                    Message <span>*</span>
                  </label>

                  <textarea
                    id="support-message"
                    name="message"
                    rows="6"
                    placeholder="Describe your problem..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="support-submit-btn"
                >
                  Send Message
                  <span>→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="support-section support-faq-section" id="faq">
        <div className="support-container support-faq-container">
          <div className="support-section-heading">
            <span>FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <p>
              Find quick answers to common questions about BabyCareMart.
            </p>
          </div>

          <div className="support-faq-list">
            {faqs.map((faq, index) => (
              <div
                className={`support-faq-item ${
                  openFaq === index ? "active" : ""
                }`}
                key={index}
              >
                <button
                  type="button"
                  className="support-faq-question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>

                  <span className="support-faq-plus">
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>

                {openFaq === index && (
                  <div className="support-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="support-final-cta">
        <div className="support-container">
          <div className="support-final-content">
            <div>
              <span>Need more help?</span>

              <h2>We're always happy to help.</h2>

              <p>
                Our support team is ready to assist you with your BabyCareMart
                experience.
              </p>
            </div>

            <a href="#contact-support" className="support-final-btn">
              Contact Us →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Support;