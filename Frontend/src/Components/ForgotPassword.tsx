import { useState } from "react";
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrlBase = import.meta.env.VITE_API_URL || "http://localhost:5003";


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await axios.post(`${apiUrlBase}/api/auth/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "An error occurred during the request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper-main">
    <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>
      <div className="auth-grid">
        
        <div className="auth-brand-panel">
          <h2>RECOVER ACCOUNT</h2>
          <p className="auth-sub">
            Lost your credentials? Enter your registered email address. If an account matches our records, a secure temporary reset token will be triggered instantly.
          </p>
          <div className="brand-motto">AUVE CLOTHING.</div>
        </div>

        <div className="auth-form-panel">
          <form className="new-auth-form" onSubmit={handleSubmit}>
            <h3>RESET PASSWORD</h3>
            
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "SENDING LINK..." : "SEND LINK"}
            </button>

            {message && (
              <p>
                {message.toUpperCase()}
              </p>
            )}

            <div className="auth-navigation-links">
              <p>REMEMBERED YOUR PASSWORD? <Link to="/login"><span>BACK TO LOGIN</span></Link></p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;
