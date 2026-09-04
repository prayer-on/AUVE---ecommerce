import { useState } from "react";
import axios from "axios";

function ComingSoon({ onUnlock, showPasswordField }: { onUnlock: () => void; showPasswordField: boolean }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrlBase = "http://localhost:5003";

  const SECRET_DROP_CODE = "AUVEPASS";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (showPasswordField && accessCode.trim() !== "") {
      if (accessCode.trim() === SECRET_DROP_CODE) {
        localStorage.setItem("site_unlocked", "true");
        onUnlock();
        setIsSubmitting(false);
        return;
      } else {
        setMessage("INVALID EARLY ACCESS CODE. TRY AGAIN.");
        setIsSubmitting(false);
        return;
      }
    }

    if (!email.trim() || !phone.trim()) {
      setMessage("EMAIL AND PHONE ARE REQUIRED.");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(`${apiUrlBase}/api/auth/launch-notify`, { 
      email: email.trim(),
      phone: phone.trim()
      });
      setMessage("YOU ARE OFFICIALLY AN AUVE MEMBER!");
      setEmail("");
      setPhone("");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "SOMETHING WENT WRONG. TRY AGAIN.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUnlockAction = showPasswordField && accessCode.trim() !== "";

  return (
    <div className="launch-lockdown-wrapper">
      <div className="launch-box">
        <header className="launch-header">
          <img />
        </header>

        <main className="launch-content">
          <form onSubmit={handleSubmit} className="launch-form">
            <input 
              type="email" 
              placeholder="EMAIL ADDRESS" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required={!isUnlockAction} 
            />
            
            <input 
              type="tel" 
              placeholder="PHONE NUMBER (+49) ..." 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required={!isUnlockAction}
            />

            {showPasswordField && (
              <input 
                type="text" 
                placeholder="ENTER EARLY ACCESS" 
                value={accessCode} 
                onChange={(e) => setAccessCode(e.target.value)} 
              />
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "LOGGING COORDINATES..." : (showPasswordField && accessCode) ? "UNLOCK STORE" : "SUBMIT"}
            </button>
          </form>

          {message && <p className="launch-feedback-msg">{message}</p>}
        </main>

        <footer className="launch-footer">
          <span>SUMBIT FOR EARLY ACCESS.</span>
        </footer>
      </div>
    </div>
  );
}

export default ComingSoon;
