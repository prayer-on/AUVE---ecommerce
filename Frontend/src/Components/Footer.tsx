import { Link } from "react-router-dom";
import { payments } from "./Payments";

function Footer () {

    return(
        <footer>
            <ul>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/contact">CONTACT US</Link></li>
                <li><Link to="/shipping-returns">SHIPPING & RETURNS</Link></li>
                <li><Link to="/cookie-policy">COOKIE POLICY</Link></li>
                <li><Link to="/privacy-policy">PRIVACY POLICY</Link></li>
                <li><Link to="/terms-conditions">TERMS & CONDITIONS</Link></li>
            </ul>
            <div className="payments">{payments.map((payment, index) => (
                <img src={payment} 
                     key={index} 
                     alt="method of payment"
                     />
                     ))}
            </div>
            <span>
                &copy; {new Date().getFullYear()}, AUVE
            </span>
        </footer>
    );
}

export default Footer