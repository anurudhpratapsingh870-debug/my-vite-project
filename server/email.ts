import nodemailer from 'nodemailer';
import type { ContactInquiry, QuoteRequest } from '@shared/schema';

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // TODO: Set your email address
    pass: process.env.SMTP_PASS, // TODO: Set your email password/app password
  },
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@apsservices.com'; // TODO: Set admin email
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@apsservices.com'; // TODO: Set from email

// Create transporter
const createTransporter = () => {
  if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
    console.warn('⚠️  Email credentials not configured. Email notifications will not be sent.');
    console.warn('   Set SMTP_USER and SMTP_PASS environment variables to enable email notifications.');
    return null;
  }

  return nodemailer.createTransport({
    host: EMAIL_CONFIG.host,
    port: EMAIL_CONFIG.port,
    secure: EMAIL_CONFIG.secure,
    auth: EMAIL_CONFIG.auth,
  });
};

// Send admin notification for new contact inquiry
export async function sendContactInquiryNotification(inquiry: ContactInquiry): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) return;

  const mailOptions = {
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Contact Inquiry - ${inquiry.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Inquiry Received
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${inquiry.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${inquiry.email}">${inquiry.email}</a></p>
          ${inquiry.phone ? `<p><strong>Phone:</strong> <a href="tel:${inquiry.phone}">${inquiry.phone}</a></p>` : ''}
          ${inquiry.company ? `<p><strong>Company:</strong> ${inquiry.company}</p>` : ''}
          ${inquiry.service ? `<p><strong>Service Interest:</strong> ${inquiry.service}</p>` : ''}
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap;">${inquiry.message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #1976d2;">
            <strong>Received:</strong> ${new Date(inquiry.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #1976d2;">
            <strong>Status:</strong> ${inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
          </p>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
          <p style="color: #666; font-size: 14px;">
            Please respond to this inquiry within 24 hours for best customer service.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Contact inquiry notification sent for: ${inquiry.name}`);
  } catch (error) {
    console.error('❌ Error sending contact inquiry notification:', error);
  }
}

// Send admin notification for new quote request
export async function sendQuoteRequestNotification(quote: QuoteRequest): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) return;

  const mailOptions = {
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New Quote Request - ${quote.service} for ${quote.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
          New Quote Request Received
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Client Details</h3>
          <p><strong>Name:</strong> ${quote.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${quote.email}">${quote.email}</a></p>
          ${quote.phone ? `<p><strong>Phone:</strong> <a href="tel:${quote.phone}">${quote.phone}</a></p>` : ''}
          ${quote.company ? `<p><strong>Company:</strong> ${quote.company}</p>` : ''}
        </div>
        
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Service Requirements</h3>
          <p><strong>Service Type:</strong> ${quote.service}</p>
          ${quote.facility ? `<p><strong>Facility Type:</strong> ${quote.facility}</p>` : ''}
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Detailed Requirements</h3>
          <p style="white-space: pre-wrap;">${quote.message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #856404;">
            <strong>Received:</strong> ${new Date(quote.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #856404;">
            <strong>Status:</strong> ${quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </p>
        </div>
        
        <div style="margin-top: 20px; text-align: center; padding: 15px; background-color: #d4edda; border-radius: 8px;">
          <p style="color: #155724; font-weight: bold; margin: 0;">
            🎯 Priority: Prepare and send detailed quote within 24 hours
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Quote request notification sent for: ${quote.name} (${quote.service})`);
  } catch (error) {
    console.error('❌ Error sending quote request notification:', error);
  }
}

// Send confirmation email to user after contact inquiry
export async function sendContactConfirmationEmail(inquiry: ContactInquiry): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) return;

  const mailOptions = {
    from: FROM_EMAIL,
    to: inquiry.email,
    subject: 'Thank you for contacting APS Services - We will be in touch soon!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px; background-color: #007bff; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">APS Services</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Professional Facility Management Solutions</p>
        </div>
        
        <div style="padding: 30px 20px; background-color: #ffffff; border: 1px solid #dee2e6; border-top: none;">
          <h2 style="color: #333; margin-top: 0;">Thank You, ${inquiry.name}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            We have received your inquiry and appreciate your interest in APS Services. 
            Our team will review your requirements and get back to you within <strong>24 hours</strong>.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Your Inquiry Summary</h3>
            ${inquiry.service ? `<p><strong>Service Interest:</strong> ${inquiry.service}</p>` : ''}
            <p><strong>Message:</strong> ${inquiry.message.substring(0, 200)}${inquiry.message.length > 200 ? '...' : ''}</p>
          </div>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1976d2;">
              <strong>Need immediate assistance?</strong><br>
              📞 Call us: <a href="tel:+91XXXXXXXXXX" style="color: #1976d2;">+91 XXXXX XXXXX</a><br>
              📱 WhatsApp: <a href="https://wa.me/91XXXXXXXXXX" style="color: #1976d2;">Chat with us</a>
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>APS Services Team</strong><br>
            Professional Facility Management Solutions
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            This is an automated confirmation email. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to: ${inquiry.email}`);
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
  }
}

// Send confirmation email to user after quote request
export async function sendQuoteConfirmationEmail(quote: QuoteRequest): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) return;

  const mailOptions = {
    from: FROM_EMAIL,
    to: quote.email,
    subject: 'Quote Request Received - APS Services will send you a detailed proposal soon!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px; background-color: #28a745; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">APS Services</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Professional Facility Management Solutions</p>
        </div>
        
        <div style="padding: 30px 20px; background-color: #ffffff; border: 1px solid #dee2e6; border-top: none;">
          <h2 style="color: #333; margin-top: 0;">Quote Request Confirmed, ${quote.name}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            Thank you for requesting a quote for <strong>${quote.service}</strong>. 
            We will prepare a detailed proposal tailored to your requirements and send it to you within <strong>24 hours</strong>.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">Your Quote Request Summary</h3>
            <p><strong>Service:</strong> ${quote.service}</p>
            ${quote.facility ? `<p><strong>Facility Type:</strong> ${quote.facility}</p>` : ''}
            <p><strong>Requirements:</strong> ${quote.message.substring(0, 200)}${quote.message.length > 200 ? '...' : ''}</p>
          </div>
          
          <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #155724;">
              <strong>What happens next?</strong><br>
              ✅ Our team will analyze your requirements<br>
              ✅ We'll prepare a customized quote with competitive pricing<br>
              ✅ You'll receive a detailed proposal within 24 hours<br>
              ✅ We'll schedule a consultation call if needed
            </p>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>Need to discuss your requirements?</strong><br>
              📞 Call us: <a href="tel:+91XXXXXXXXXX" style="color: #856404;">+91 XXXXX XXXXX</a><br>
              📱 WhatsApp: <a href="https://wa.me/91XXXXXXXXXX" style="color: #856404;">Chat with us</a>
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>APS Services Team</strong><br>
            Professional Facility Management Solutions
          </p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            This is an automated confirmation email. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Quote confirmation email sent to: ${quote.email}`);
  } catch (error) {
    console.error('❌ Error sending quote confirmation email:', error);
  }
}