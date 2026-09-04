const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require("crypto");
const twilio = require("twilio");
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const nodemailer = require("nodemailer");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(200).json({ message: "If the email exists, a password reset link has been sent!" });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

   const transporterOptions = process.env.EMAIL_SERVICE 
  ? {
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }
  : {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };

const transporter = nodemailer.createTransport(transporterOptions);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5003";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const mailOptions = {
      from: '"AUVE Support" <no-reply@AUVE.com>',
      to: user.email,
      subject: "Password Reset Request - AUVE",
      html: `
        <h3>You requested a password reset</h3>
        <p>Please click on the link below to reset your password. This link will expire in 15 minutes.</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>If you did not request this reset, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Reset link successfully sent to your email address!" });

  } catch (error) {
    return res.status(500).json({ message: "Error sending the email request", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "The new password field is required!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    return res.status(200).json({ message: "Password updated successfully! You can now log in." });

  } catch (error) {
    return res.status(400).json({ message: "The reset link is invalid or has expired!", error: error.message });
  }
};

exports.signup = async (req, res) => {

console.log("🔥 RICHIESTA DI SIGNUP RICEVUTA! Body inviato:", req.body);
try {

    const {firstName, lastName, email, password} = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
    return res.status(400).json({message: "User already registered!"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User ({
        firstName,
        lastName,
        email,
        password: hashedPassword
        });

        //Salvare l'utente.
        await newUser.save()
        
        res.status(201).json({message: "User added successfully!"});
    }
            
catch (error) {res.status(500).json({error: error.message});
}
};

exports.login = async (req, res) => {
try {

    const { email, password } = req.body;

     const normalizedEmail = email ? email.trim().toLowerCase() : "";
     
    const user = await User.findOne ({ email: normalizedEmail });
    if (!user) {
    return res.status(400).json({ message: "Incorrect credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    return res.status(400).json({ message: "Incorrect credentials!" });
    }

    const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
    user: {
        token,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
    }
});
}

catch (error) {res.status(500).json({message: "Error during login", error: error.message});
}
};

exports.saveLaunchLead = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ message: "EMAIL AND PHONE ARE MANDATORY." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "COORDINATES ALREADY LOGGED." });
    }

    const newLead = new User({
      email: email.toLowerCase(),
      phone: phone, 
      firstName: "AU",
      lastName: "VE",
      password: "TEMPORARY_LAUNCH_LOCK" 
    });

    await newLead.save();

    if (phone) {

      try {
      await twilioClient.messages.create({
        body: "WELCOME TO THE WEBSITE. COORDINATES LOGGED SUCCESSFULLY. YOU ARE OFFICIALLY AN AUVE MEMBER. STAY CONNECTED.",
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
      console.log("SMS transmitted successfully via Twilio.");
    }
    catch (twilioError) {
        console.error("Twilio Service Error:", twilioError.message);
        return res.status(201).json({ 
          message: "Lead saved successfully.", 
          twilioWarning: twilioError.message 
        });
      }
    }
    return res.status(201).json({ message: "Lead saved successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Database execution failure.", error: error.message });
  }
};
