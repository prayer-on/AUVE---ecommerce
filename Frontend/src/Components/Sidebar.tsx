import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../Context/CartContext";
import { Link } from "react-router-dom";

function Sidebar () {

const {cart, updateQuantityUp, updateQuantityDown, isSidebarOpen, setIsSidebarOpen, removeFromCart} = useCart();

     function closeSidebar() {
        setIsSidebarOpen (false)
    }

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);


    return(
       
    <>
    {isSidebarOpen && (
    <div className="sidebar-overlay"
         onClick={() => setIsSidebarOpen(false)}
    />
    )
    }

    <aside className={isSidebarOpen ? "open-slide" : ""}>
            <div className="cart-banner">
                YOUR CART
                <FontAwesomeIcon icon={faX} onClick={closeSidebar}/>
            </div>
        {cart.length === 0 ? 

        (<p className="cart-empty">0 ITEMS FOUND</p>) 
            : 
        (<div className="cart-content-wrapper">
         <div className="cart-items-container">
          {cart.map((item, index) => (
    <div key={`${item._id}-${item.size}-${index}`} className="cart-item">

        <Link to={`/product/${item._id}`} onClick={closeSidebar}>
            <img src={item.img} alt={item.title}/>
        </Link>
        <div>

            <h4>{item.title}</h4>
            <p>Size: {item.size}</p>
            <div className="quantity-selector">
                <FontAwesomeIcon icon={faCircleMinus} onClick={() => updateQuantityDown(item._id, item.size)} className="qty-btn"/>
                <span className="qty-number">{item.quantity}</span>
                <FontAwesomeIcon icon={faCirclePlus} onClick={() => updateQuantityUp(item._id, item.size)} className="qty-btn"/>
            </div>

          <p>€{(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item._id, item.size)}>REMOVE</button>
        </div>
    </div>
          ))}
        </div>
        
        <div className="cart-summary">
            <div className="total-row">
                <span className="total">TOTAL:</span>
                <span>€{totalPrice.toFixed(2)}</span>
            </div>
            <Link to="/checkout" onClick={closeSidebar}><button>CHECKOUT</button></Link>
        </div>
        </div>
        )}
    </aside>
    </>
);
}


export default Sidebar