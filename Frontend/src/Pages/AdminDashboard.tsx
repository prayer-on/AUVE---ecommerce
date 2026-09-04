import Banner from "../Components/Banner";
import NewProduct from "../Components/NewProduct";
import Sidebar from "../Components/Sidebar";
import Footer from "../Components/Footer";
function AdminDashboard () {
    return(
        <>
        <Sidebar/>
        <Banner/>  
        <NewProduct/>  
        <Footer/>
        </>
    );
}

export default AdminDashboard