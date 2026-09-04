import { useState } from "react";
import Home from "./Pages/Home";
import UserLog from "./Pages/UserLog";
import UserSign from "./Pages/UserSign";
import SingleProductPage from "./Pages/SingleProductPage";
import CheckOut from "./Pages/CheckOut";
import UserCon from "./Pages/UserContact";
import AdminDashboard from "./Pages/AdminDashboard"
import StatusOrd from "./Pages/StatusOrd"
import ThankYou from "./Pages/ThankYou"
import PassFor from "./Pages/PassFor"
import PassRes from "./Pages/PassRes"
import UserFaq from "./Pages/UserFaq";
import UserShipping from "./Pages/UserShipping";
import UserPrivacy from "./Pages/UserPrivacy";
import UserPolicy from "./Pages/UserPolicy";
import UserTerms from "./Pages/UserTerms";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductProvider } from "./Context/ProductContext";
import { CartProvider } from "./Context/CartContext";
import ComingSoon from "./Components/ComingSoon";
import { Analytics } from '@vercel/analytics/react';


function App () {

const isMaintenanceMode = true; /* METTERE false PER ACCESSO GLOBALE */
const isDropImminent = false; /* METTERE true PER DARE ACCESSO AI EARLY ACCESS*/

 const [isUnlocked, setIsUnlocked] = useState(
    localStorage.getItem("site_unlocked") === "true"
  );

  if (isMaintenanceMode && !isUnlocked) {
    return (
      <ProductProvider>
        <CartProvider>
          <ComingSoon
          onUnlock={() => setIsUnlocked(true)} 
          showPasswordField={isDropImminent} 
          />
          <Analytics />
        </CartProvider>
      </ProductProvider>
    );
  }


  return (

<ProductProvider>
<CartProvider>
  
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<UserLog/>}/>
    <Route path="/signup" element={<UserSign/>}/>
    <Route path="/product/:id" element={<SingleProductPage/>}/>
    <Route path="/checkout" element={<CheckOut/>}/>
    <Route path="/contact" element={<UserCon/>}/>
    <Route path="/my-orders" element={<StatusOrd/>}/>
    <Route path="/admin" element={<AdminDashboard/>}/>
    <Route path="/thankyou" element={<ThankYou/>}/>
    <Route path="/forgot-password" element={<PassFor/>} />
    <Route path="/reset-password/:token" element={<PassRes/>} />
    <Route path="/faq" element={<UserFaq/>} />
    <Route path="/shipping-returns" element={<UserShipping />} />
    <Route path="/cookie-policy" element={<UserPolicy />} />
    <Route path="/privacy-policy" element={<UserPrivacy />} />
    <Route path="/terms-conditions" element={<UserTerms />} />
    </Routes>
    </BrowserRouter>
    <Analytics />

</CartProvider>
</ProductProvider>
  );
}

export default App
