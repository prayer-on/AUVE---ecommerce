import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function TermsConditions() {
  return (
    <div className="legal-static-container">
      <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>
      <h2>TERMS & CONDITIONS</h2>
      <div className="legal-content">
        <p>Welcome to AUVE. By browsing this e-commerce store and purchasing our apparel, you agree to comply with the following operational terms.</p>
        
        <h3>Product Pricing & Stock</h3>
        <p>All apparel prices listed on the storefront are subject to change without notice. Stock levels (XS, S, M, L, XL, Onesize) are managed dynamically in real-time. If an item drops to zero stock mid-transaction, the purchase will be securely rejected.</p>
        
        <h3>Intellectual Property</h3>
        <p>All graphic designs, artwork t-shirt configurations, photographic assets, and brand logos featured on this platform are properties of AUVE.</p>
        
        <h3>Limitation of Liability</h3>
        <p>AUVE shall not be held liable for standard postal shipping carrier delays once packages have successfully departed our shipping facilities.</p>
      </div>
    </div>
  );
}

export default TermsConditions;
