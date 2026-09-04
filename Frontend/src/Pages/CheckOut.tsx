import Banner from "../Components/Banner";
import Sidebar from "../Components/Sidebar";
import InfoCheck from "../Components/Checkin";
import Footer from "../Components/Footer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe("pk_test_51UAvtzLCeXKxcqeyCKqu93HknY3SsSe1p2T2h29DcsrUTsX6ONSOqDatiSnlmayjUf7hQl8CEqMjG97bK9kPEdsA00jG0xr0Gu")


function CheckOut () {
    
    return(
        <>
        <Sidebar/>
        <Banner/>
        <Elements stripe={stripePromise}>
        <InfoCheck/>  
        </Elements>      
        <Footer/>
        </>
    );
}

export default CheckOut