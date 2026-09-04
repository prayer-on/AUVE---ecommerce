import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function ShippingReturns() {
  return (
    <div className="legal-static-container">
      <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>
      <h2>SHIPPING & RETURNS</h2>
      <div className="legal-content">
        <h3>Shipping Information</h3>
        <p>We ship worldwide. All orders are packed securely and dispatched within 48 hours of successful payment confirmation. Shipping prices are calculated at checkout based on your country destination.</p>
        
        <h3>Track Your Order</h3>
        <p>Once your order leaves our warehouse, a confirmation status update will be logged inside your "My Orders" profile area on our platform.</p>
        
        <h3>Returns Policy</h3>
        <p>We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached. Return shipping fees are covered by the customer unless the product arrived damaged.</p>
      </div>
    </div>
  );
}

export default ShippingReturns;
