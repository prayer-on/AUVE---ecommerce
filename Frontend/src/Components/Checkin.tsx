import { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { ALL_COUNTRIES } from "./Countries";

function InfoCheck() {
  
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "", 
    country: "Germany"
  });


  const { cart, clearCart } = useCart();
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getShippingCost = () => {
  const currentCountry = shippingDetails.country.trim().toUpperCase();

  if (currentCountry === "GERMANY") {
    return subtotal >= 50 ? 0 : 5.00; 
  }

const europeanZone = [
  "ALBANIA",
  "ANDORRA",
  "ARMENIA",
  "AUSTRIA",
  "BELARUS",
  "BELGIUM",
  "BOSNIA AND HERZEGOVINA",
  "BULGARIA",
  "CROATIA",
  "CYPRUS",
  "CZECHIA",
  "DENMARK",
  "ESTONIA",
  "FINLAND",
  "FRANCE",
  "GERMANY",
  "GREECE",
  "HUNGARY",
  "ICELAND",
  "IRELAND",
  "KOSVO",
  "LATVIA",
  "LIECHTENSTEIN",
  "LITHUANIA",
  "LUXEMBOURG",
  "MALTA",
  "MOLDOVA",
  "MONACO",
  "MONTENEGRO",
  "NETHERLANDS",
  "NORTH MACEDONIA",
  "NORWAY",
  "POLAND",
  "PORTUGAL",
  "ROMANIA",
  "SAN MARINO",
  "SERBIA",
  "SLOVAKIA",
  "SLOVENIA",
  "SPAIN",
  "SWEDEN",
  "SWITZERLAND",
  "UKRAINE",
  "UNITED KINGDOM",
  "VATICAN CITY"
];
  if (europeanZone.includes(currentCountry)) {
    return subtotal >= 90 ? 0 : 12.00; 
  }

  return subtotal >= 150 ? 0 : 20.00; 
};

const shippingCost = getShippingCost();
const totalPrice = subtotal + shippingCost;

const getThreshold = () => {
  const currentCountry = shippingDetails.country.trim().toUpperCase();
  if (currentCountry === "GERMANY") return 50;
  if ([
  "ALBANIA",
  "ANDORRA",
  "ARMENIA",
  "AUSTRIA",
  "BELARUS",
  "BELGIUM",
  "BOSNIA AND HERZEGOVINA",
  "BULGARIA",
  "CROATIA",
  "CYPRUS",
  "CZECHIA",
  "DENMARK",
  "ESTONIA",
  "FINLAND",
  "FRANCE",
  "GERMANY",
  "GREECE",
  "HUNGARY",
  "ICELAND",
  "IRELAND",
  "KOSVO",
  "LATVIA",
  "LIECHTENSTEIN",
  "LITHUANIA",
  "LUXEMBOURG",
  "MALTA",
  "MOLDOVA",
  "MONACO",
  "MONTENEGRO",
  "NETHERLANDS",
  "NORTH MACEDONIA",
  "NORWAY",
  "POLAND",
  "PORTUGAL",
  "ROMANIA",
  "SAN MARINO",
  "SERBIA",
  "SLOVAKIA",
  "SLOVENIA",
  "SPAIN",
  "SWEDEN",
  "SWITZERLAND",
  "UKRAINE",
  "UNITED KINGDOM",
  "VATICAN CITY"
].includes(currentCountry)) return 90;
  return 150;
};

const currentThreshold = getThreshold();
const missingAmountForFree = currentThreshold - subtotal;


  const apiUrlBase = "http://localhost:5003";


  useEffect(() => {
    if (!stripe || !elements) return;

    const pr = stripe.paymentRequest({
      country: "DE",
      currency: "eur",
      total: {
        label: "AUVE ORDER",
        amount: Math.round(totalPrice * 100),
      },
      requestShipping: false,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on("paymentmethod", async (ev) => {
      try {
        const token = localStorage.getItem("token");

        const formattedItems = cart.map((item: any) => ({
          id: item._id || item.productId || item.id,
          title: item.title, 
          price: item.price,
          size: item.size || "Onesize",
          quantity: item.quantity || 1
        }));

        const response = await axios.post(
          `${apiUrlBase}/api/payment/create-intent`,
          { items: formattedItems, shippingDetails },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          response.data.clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (error) {
          ev.complete("fail");
          alert(`Payment failed: ${error.message}`);
        } else if (paymentIntent.status === "succeeded") {
          ev.complete("success");

          try {
            await axios.post(
              `${apiUrlBase}/api/orders`,
              {
                items: formattedItems,
                shippingDetails,
                totalAmount: totalPrice,
                paymentIntentId: paymentIntent.id
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Express order successfully registered on MongoDB!");
          } catch (dbError) {
            console.error("Error saving Express order:", dbError);
          }


          clearCart();
          navigate("/thankyou");
        }
      } catch (err) {
        ev.complete("fail");
        console.error(err);
      }
    });
  }, [stripe, elements, totalPrice, cart, shippingDetails, clearCart, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const isFormIncomplete = 
    !shippingDetails.fullName.trim() || 
    !shippingDetails.address.trim() || 
    !shippingDetails.city.trim() || 
    !shippingDetails.postalCode.trim() || 
    !shippingDetails.country.trim();

  const stripeOptions = {
    style: {
      base: {
        color: '#000000',
        iconColor: '#000000',
        fontFamily: 'Inter, sans-serif',
        fontSize: '15px',
        '::placeholder': { color: '#555555' }
      },
      invalid: { color: '#ff0000', iconColor: '#ff0000' }
    },
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || isFormIncomplete) return;

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");

      const formattedItems = cart.map((item: any) => ({
        id: item._id || item.productId || item.id,
        title: item.title, 
        price: item.price, 
        size: item.size || "Onesize",
        quantity: item.quantity || item.qty || 1
      }));


      const response = await axios.post(
        `${apiUrlBase}/api/payment/create-intent`,
        { items: formattedItems, shippingDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setIsProcessing(false);
        return;
      }

      const result = await stripe.confirmCardPayment(response.data.clientSecret, {
        payment_method: { 
          card: cardElement,
          billing_details: { name: shippingDetails.fullName }
        }
      });

      if (result.error) {
        alert(`Error: ${result.error.message}`);
        setIsProcessing(false);
      } else if (result.paymentIntent?.status === "succeeded") {


         try {
          await axios.post(
            `${apiUrlBase}/api/orders`, 
            {
              items: formattedItems,
              shippingDetails,
              totalAmount: totalPrice, 
              paymentIntentId: result.paymentIntent.id
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Order successfully registered in the cloud database!");
        } catch (dbError) {
          console.error("Error saving order directly:", dbError);
        }


        clearCart();
        navigate("/thankyou");
      }
    } catch (err) {
      console.error(err);
      alert("Payment runtime exception error.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="new-checkout-empty">
        <h2>YOUR CART IS EMPTY, CANNOT CHECKOUT</h2>
        <Link to="/"><button>GO BACK TO SHOPPING</button></Link>
      </div>
    );
  }

  return (
    <div className="new-checkout-wrapper">
      <div className="new-checkout-grid">
      <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>
        
        <div className="new-checkout-left-panel">
          <h2>CHECKOUT</h2>
          
          {paymentRequest && (
            <div className="express-checkout-box">
              <span className="section-mini-title">EXPRESS CHECKOUT</span>
              <PaymentRequestButtonElement options={{ paymentRequest }} />
              <div className="divider-text"><span>OR CONTINUE WITH CARD</span></div>
            </div>
          )}

          <form onSubmit={handlePayment} className="new-checkout-form">
            <span className="section-mini-title">SHIPPING ADDRESS</span>
            
            <input type="text" name="fullName" placeholder="FULL NAME" value={shippingDetails.fullName} onChange={handleChange} required />
            <input type="text" name="address" placeholder="STREET ADDRESS" value={shippingDetails.address} onChange={handleChange} required />
            
            <div className="form-fields-split">
              <input type="text" name="city" placeholder="CITY" value={shippingDetails.city} onChange={handleChange} required />
              <input type="text" name="postalCode" placeholder="POSTAL CODE / ZIP" value={shippingDetails.postalCode} onChange={handleChange} required />
            </div>

            <div className="new-country-dropdown-wrapper">
              <select name="country" value={shippingDetails.country} onChange={handleChange} required
                onFocus={() => setIsSizeOpen(true)}
                onBlur={() => setIsSizeOpen(false)}
              >
                {ALL_COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country.toUpperCase()}
                  </option>
                ))}
              </select>
              <FontAwesomeIcon icon={isSizeOpen ? faAngleDown : faAngleUp} />
            </div>

            <span className="section-mini-title" style={{ marginTop: "15px" }}>CARD DETAILS</span>
            <div className="new-stripe-element-container">
              <CardElement options={stripeOptions} />
            </div>

            <button type="submit" disabled={isProcessing || isFormIncomplete} className={isFormIncomplete ? "btn-locked" : ""}>
              {isProcessing ? "PROCESSING TRANSACTION..." : isFormIncomplete ? "COMPLETE SHIPPING DETAILS" : `PLACE ORDER • EUR ${totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="new-checkout-right-panel">
          <div className="order-summary-sticky-box">
            <h3>YOUR ORDER</h3>
            
            <div className="summary-products-scroll-area">
              {cart.map((item, index) => (
                <div key={`${item._id}-${item.size}-${index}`} className="new-summary-item-card">
                  <img src={item.img} alt={item.title} />
                  <div className="item-meta">
                    <h4>{item.title}</h4>
                    <p>SIZE: {item.size} | QTY: x{item.quantity}</p>
                  </div>
                  <span className="item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-billing-footer">

              <div className="billing-row">
                <span>SUBTOTAL</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>

              <div className="billing-row">
                <span>SHIPPING TO {shippingDetails.country.toUpperCase()}</span>
                {shippingCost === 0 ? (
                <span className="free-shipping">FREE</span>
                ) : (
                  <span>€{shippingCost.toFixed(2)}</span>
                )}
              </div>
              
              {shippingCost > 0 && (
            <div className="shopify-shipping-alert">
             ADD <strong>€{missingAmountForFree.toFixed(2)}</strong> MORE FOR FREE SHIPPING!
             </div>)}

              <div className="billing-row total-highlight">
                <span>TOTAL</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoCheck;
