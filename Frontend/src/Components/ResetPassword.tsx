import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrlBase = import.meta.env.VITE_API_URL || "http://localhost:5003";


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await axios.put(`${apiUrlBase}/api/auth/reset-password/${token}`, { password });
      alert(response.data.message);
      navigate("/login");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error. The link might have expired or is invalid.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper-main">
    <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>
      <div className="auth-grid">
        
        <div className="auth-brand-panel">
          <h2>SECURE ENTRY</h2>
          <p className="auth-sub">
            Establish a new cryptographic password sequence for your profile. Ensure it is unique to safeguard your persistent cart and order ledger data.
          </p>
          <div className="brand-motto">AUVE.</div>
        </div>

        <div className="auth-form-panel">
          <form className="new-auth-form" onSubmit={handleSubmit}>
            <h3>NEW CREDENTIALS</h3>
            
            <input 
              type="password" 
              placeholder="NEW SECURE PASSWORD" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>

            {message && (
              <p>
                {message.toUpperCase()}
              </p>
            )}

            <div className="auth-navigation-links">
              <p>ABORT PROCESS? <Link to="/login"><span>RETURN TO LOGIN</span></Link></p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;
