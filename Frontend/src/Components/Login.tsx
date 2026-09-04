import { Link, useNavigate } from "react-router-dom";
import { faArrowLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const apiUrlBase = "http://localhost:5003";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrlBase}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        email: credentials.email.trim().toLowerCase(), 
        password: credentials.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.user.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert(`Welcome back, ${data.user.firstName}!`);
        navigate("/");
      } else {
        alert(data.message || "Invalid credentials. Please try again.");
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
          <h2>SUBSCRIBE</h2>
          <p className="auth-sub">Access your personal profile to track your current orders, manage your shipping details, and secure exclusive apparel blanks drop releases.</p>
          <div className="brand-motto">AUVE CLOTHING.</div>
        </div>

        <div className="auth-form-panel">
          <form className="new-auth-form" onSubmit={handleSubmit}>
            <h3>LOGIN</h3>
            
            <input 
              type="email" 
              placeholder="EMAIL  ADDRESS" 
              id="email" 
              value={credentials.email} 
              onChange={handleChange} 
              required
            />
            <input 
              type= {showPassword? "text" : "password"}
              placeholder="PASSWORD" 
              id="password" 
              value={credentials.password} 
              onChange={handleChange} 
              required
            />
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "AUTHENTICATING..." : "SIGN IN"}
            </button>

            <div className="auth-navigation-links">
              <p>DON'T HAVE AN ACCOUNT? <Link to="/signup"><span>CREATE</span></Link></p>
              <p>FORGOT YOUR PASSWORD? <Link to="/forgot-password"><span>RESET HERE</span></Link></p>
            </div>
          </form>
          <button
              type="button" 
              className="toggle-password-btn-login"
              onClick={() => setShowPassword(!showPassword)}
            >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;
