import { Link, useNavigate } from "react-router-dom";
import { faArrowLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";


function Signup() {

  const [showPassword, setShowPassword] = useState(false) 
  const navigate = useNavigate();
  const apiUrlBase = import.meta.env.VITE_API_URL || "http://localhost:5003";
  console.log("DEBUG - URL del Backend rilevato da Vercel:", apiUrlBase);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrlBase}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Welcome to AUVE, ${formData.firstName}! Account successfully created! Please log in with your credentials.`);
        navigate("/login");
      } else {
        alert(data.message || "Registration failed. Try using a different email.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Server connection failed. Make sure the backend is active.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper-main">
      <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>
      <div className="auth-grid">
        <div className="auth-brand-panel">
          <h2>CREATE AN ACCOUNT</h2>
          <p className="auth-sub">Register to enjoy lightning-fast checkouts, persistent virtual shopping bags across devices, and seamless tracking for all your premium streetwear parcels.</p>
          <div className="brand-motto">AUVE CLOTHING.</div>
        </div>

        <div className="auth-form-panel">
          <form className="new-auth-form" onSubmit={handleSubmit}>
            <h3>SIGNUP</h3>
            
            <div className="auth-fields-split">
              <input 
                type="text" 
                placeholder="FIRST NAME" 
                id="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                required
              />
              <input 
                type="text" 
                placeholder="LAST NAME" 
                id="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                required
              />
            </div>

            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              id="email" 
              value={formData.email} 
              onChange={handleChange} 
              required
            />
            <input 
              type={showPassword? "text" : "password"} 
              placeholder="CHOOSE PASSWORD" 
              id="password" 
              value={formData.password} 
              onChange={handleChange} 
              required
            />
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "CREATING PROFILE..." : "CREATE ACCOUNT"}
            </button>

            <div className="auth-navigation-links">
              <p>ALREADY HAVE AN ACCOUNT? <Link to="/login"><span>LOGIN</span></Link></p>
            </div>
          </form>
           <button
            type="button" 
            className="toggle-password-btn-signup"
            onClick={() => setShowPassword(!showPassword)}
            >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
        </div>

      </div>
    </div>
  );
}

export default Signup;
