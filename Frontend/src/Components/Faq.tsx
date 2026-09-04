import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


function FAQ() {
  return (
    <div className="legal-static-container">
      <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>
      <h2>FREQUENTLY ASKED QUESTIONS</h2>
      <div className="legal-content">
        <div className="faq-item">
          <h4>How long does delivery take?</h4>
          <p>Delivery typically takes between 7 to 14 working days, depending on your location and country destination.</p>
        </div>
        <div className="faq-item">
          <h4>Can I change or cancel my order?</h4>
          <p>Once an order is placed and processed through our payment gateways (Stripe, Apple Pay, or credit cards), it cannot be modified. Please contact support immediately if you need assistance.</p>
        </div>
        <div className="faq-item">
          <h4>What materials do you use?</h4>
          <p>We focus on high-quality streetwear blanks. Most of our t-shirts are made from premium heavy cotton, ranging from 190 GSM to 320 GSM.</p>
        </div>
        <div className="faq-item">
          <h4>Are the fits oversized?</h4>
          <p>Yes, products like our tees feature a comfortable, oversized streetwear fit. Check individual product descriptions for exact fit styles.</p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
