import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

function ContactUs() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiUrlBase = "http://localhost:5003";
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      
      await axios.post(`${apiUrlBase}/api/contact/send`, formData);

      alert("THANK YOU, YOUR MESSAGE HAS BEEN DELIVERED.");
      
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
      
      navigate("/");
    } catch (error: any) {
      console.error("Error sending message:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="contact-wrapper-main">
      <div className="contact-grid">
        <Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="arrow-homepage"/></Link>
        
        <div className="contact-info-panel">
          <h2>CONTACT US</h2>
          <p className="contact-sub">Have questions regarding sizing, custom blanks, or your current order status? Reach out directly.</p>
          
          <div className="info-details-block">
            <div className="info-row">
              <span>SUPPORT EMAIL</span>
              <p>AUVE@gmail.com</p>
            </div>
            <div className="info-row">
              <span>HQ LOCATION</span>
              <p>Italy</p>
            </div>
            <div className="info-row">
              <span>RESPONSE TIME</span>
              <p>Within 24-48 working hours</p>
            </div>
          </div>
        </div>

        <div className="contact-form-panel">
          <form onSubmit={handleSubmit} className="new-contact-form">
            <div className="form-row-split">
              <input 
                type="text" 
                name="firstName" 
                placeholder="FIRST NAME" 
                value={formData.firstName} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="text" 
                name="lastName" 
                placeholder="LAST NAME" 
                value={formData.lastName} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <input 
              type="email" 
              name="email" 
              placeholder="EMAIL ADRESS" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            
            <textarea 
              name="message" 
              placeholder="MESSAGE" 
              value={formData.message} 
              onChange={handleChange} 
              required
            ></textarea>
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default ContactUs;
