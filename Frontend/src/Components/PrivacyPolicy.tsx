import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <div className="legal-static-container">
      <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>
      <h2>PRIVACY POLICY</h2>
      <div className="legal-content">
        <p><strong>Effective Date: August 2026</strong></p>
        <p>At AUVE, we value your privacy. This policy outlines how we collect, use, and safeguard your personal data when interacting with our e-commerce platform.</p>
        
        <h3>Information Collection</h3>
        <p>We collect your personal details (Full name, address, email) strictly to process your orders and handle delivery logistics. Your account passwords are encrypted using bcrypt hashing before being saved on our servers.</p>
        
        <h3>Coming Soon & Drop Notifications</h3>
        <p>When you register on our "Coming Soon" page to receive updates about new product drops, we collect your email address and phone number. This data is securely stored and used exclusively to send you drop notifications via our marketing automation provider, Brevo. You can unsubscribe from these notifications at any time.</p>
        
        <h3>Payment Processing</h3>
        <p>All credit card transactions are handled entirely and securely by Stripe. We do not store or witness your credit card numbers on our database.</p>
        
        <h3>Data Retention</h3>
        <p>Your data stays securely on our servers as long as your customer profile is active. You may request account and data erasure at any time by contacting our support team.</p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
