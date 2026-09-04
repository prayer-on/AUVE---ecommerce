import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Congrats() {
    return(
        <>
        <div className="wrapper-thank-you">
        <div>
            <h3>Successfully received your order! 
              <span><FontAwesomeIcon icon={faCircleCheck as any}/></span>
            </h3>
        </div>
            <Link to="/"><button>Continue Shopping</button></Link>
        </div>
        </>
    );
}

export default Congrats;