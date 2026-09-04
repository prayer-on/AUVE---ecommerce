import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faOpencart } from "@fortawesome/free-brands-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
faMagnifyingGlass
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../Context/CartContext";

interface LocalUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "customer" | "admin";
}

function Banner () {

    const navigate = useNavigate();
    const location = useLocation();

    const { cart = [], setIsSidebarOpen, searchTerm, setSearchTerm} = useCart();

    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    function openSidebar() {
        setIsSidebarOpen (true)
    }

 const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

 useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (token && userRaw) {
      setIsLogged(true);
      const user: LocalUser = JSON.parse(userRaw);
      if (user.role === "admin") {
        setIsAdmin(true);
      }
    } else {
      setIsLogged(false);
      setIsAdmin(false);
    }
  }, [location]);

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogged(false);
    setIsAdmin(false);
    setIsDropdownOpen(false);
    alert("Logout successful!");
    navigate("/");
  };

    return (
        <header>
        <div className="search-bar">
          <label htmlFor="search-input">
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
          </label>
            <input type="text" placeholder="Search" id="search-input"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <ul>
            <li className="ad-or-lo">
          
          {!isLogged ? 
          (
            <Link to="/login">
                <FontAwesomeIcon icon={faUser} />
            </Link>
          )
          : 
          (    <>
              < FontAwesomeIcon icon={faUser} onClick={() => setIsDropdownOpen(!isDropdownOpen)}/>
              
              {isDropdownOpen && (
                <div className="user-dropdown">
                  {isAdmin && (
                  <Link to="/admin" onClick={() => setIsDropdownOpen(false)} id="admin-section">
                    ADMIN
                  </Link>
                  )}
                  
                  <Link to="/my-orders" onClick={() => setIsDropdownOpen(false)} id="orders-section">
                    MY ORDERS
                  </Link>

                  <button onClick={handleLogout} id="logout-section">
                    LOGOUT
                  </button>
                </div>
              )}
            </>
          )}
        </li>
        <li className="shopping-cart">
            <FontAwesomeIcon icon={faOpencart} onClick={openSidebar}/>
            {totalItems > 0 && <span onClick={openSidebar}>{totalItems}</span>}
        </li>
        </ul>
        </header>
    );
}

export default Banner