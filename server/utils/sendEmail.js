import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  // In development, just log the email
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_EMAIL) {
    console.log('📧 Email (dev mode):');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${html.substring(0, 100)}...`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"HealthCarePro" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

// Pre-built email templates
export const emailTemplates = {
  appointmentBooked: (patientName, doctorName, hospitalName, date, time) => ({
    subject: `Appointment Confirmed — ${hospitalName}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #0ea5e9;">Appointment Booked Successfully! ✅</h2>
        <p>Hello <strong>${patientName}</strong>,</p>
        <p>Your appointment has been booked:</p>
        <div style="background: #f8fafc; border-radius: 16px; padding: 20px; margin: 20px 0;">
          <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
          <p><strong>Hospital:</strong> ${hospitalName}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>
        <p>Please arrive 15 minutes early.</p>
        <p style="color: #94a3b8; font-size: 14px;">— HealthCarePro Team</p>
      </div>
    `,
  }),

  hospitalApproved: (hospitalName) => ({
    subject: `Your Hospital Has Been Approved! 🎉`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #0ea5e9;">Congratulations! 🎉</h2>
        <p>Your hospital <strong>${hospitalName}</strong> has been approved and is now live on HealthCarePro.</p>
        <p>You can now:</p>
        <ul>
          <li>Add doctors and departments</li>
          <li>Start receiving appointment bookings</li>
          <li>Manage your hospital dashboard</li>
        </ul>
        <p style="color: #94a3b8; font-size: 14px;">— HealthCarePro Team</p>
      </div>
    `,
  }),

  hospitalRejected: (hospitalName, reason) => ({
    subject: `Hospital Registration Update — ${hospitalName}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #ef4444;">Registration Not Approved</h2>
        <p>Your hospital <strong>${hospitalName}</strong> registration was not approved.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please update your details and resubmit.</p>
        <p style="color: #94a3b8; font-size: 14px;">— HealthCarePro Team</p>
      </div>
    `,
  }),
};

export default sendEmail;
