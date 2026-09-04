import Banner from "../Components/Banner";
import Sidebar from "../Components/Sidebar";
import Product from "../Components/Products";
import Footer from "../Components/Footer";

function Home () {
    
    return(
        <>
        <Sidebar/>
        <Banner/>        
        <Product/>
        <Footer/>
        </>
    );
}

export default Home