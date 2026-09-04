import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function CookiePolicy() {
  return (
    <div className="legal-static-container">
      <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>
      <h2>COOKIE POLICY</h2>
      <div className="legal-content">
        <p><strong>AUVE</strong></p>
        <p>This e-commerce platform uses exclusively technical and session cookies, which are strictly necessary for the proper functioning of the website. In accordance with the GDPR Regulation (EU 2016/679), prior user consent is not required for the use of these cookies, as the store could not function without them.</p>
        <p>We do not use profiling, advertising tracking, or third-party marketing cookies in any way.</p>
        
        <h3>List of cookies used on this website:</h3>
        
        <p><strong>Shopping Cart Management (Local):</strong> The website temporarily stores the products you add to your shopping cart on your browser (via localStorage). This ensures your clothes do not disappear from the cart if you refresh the page.</p>
        
        <p><strong>User and Admin Session (Local):</strong> When you log in, the system saves a security code (JWT Token) to recognize your profile, allow you to access your orders, and enable the Administrator control panel.</p>
        
        <p><strong>Payment Processing (Third-Party):</strong> During the checkout phase, integrated payment gateways (Stripe, PayPal, Klarna) drop functionality cookies that are strictly necessary to process the transaction in total security, verify card identity, and prevent banking fraud.</p>
      </div>
    </div>
  );
}

export default CookiePolicy;
