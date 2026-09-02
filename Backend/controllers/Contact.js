const nodemailer = require("nodemailer");

exports.sendContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: "All fields are required!" });
    }

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

    const mailOptions = {
      from: `"${firstName} ${lastName}" <${email}>`,
      to: process.env.EMAIL_USER, 
      subject: `New Contact Form Submission - AUVE`,
      html: `
        <h3>New Message Received</h3>
        <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
        <p><strong>Message:</strong></p>
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-style: italic;">
          ${message.replace(/\n/g, "<br>")}
        </p>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Message delivered successfully!" });

  } catch (error) {
    console.error("Contact form route error:", error);
    return res.status(500).json({ message: "Failed to send message.", error: error.message });
  }
};
