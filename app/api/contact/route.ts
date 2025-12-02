import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// Brian's email address
const BRIAN_EMAIL = 'brian@becreativesco.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'leads@becreativesco.com';

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  social: string;
  industry: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadFormData = await request.json();
    const { name, email, phone, social, industry, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !social || !industry || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Format the email body
    const emailBody = `
New Lead Submission from BE CREATIVES CO. Website

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${name}
Email: ${email}
Phone: ${phone}
Social/Website: ${social}
Industry: ${industry}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This lead was submitted via the BE CREATIVES CO. website contact form.
Reply directly to this email to respond to ${name}.
    `.trim();

    // HTML version for better formatting
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead - ${name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 12px; overflow: hidden;">
    <!-- Header -->
    <tr>
      <td style="padding: 32px; background: linear-gradient(135deg, #4A90E2 0%, #18CCFC 50%, #7CF9FF 100%); text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #000000;">🚀 New Lead Alert</h1>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 32px;">
        <h2 style="margin: 0 0 24px 0; font-size: 20px; color: #ffffff; border-bottom: 1px solid #333; padding-bottom: 12px;">
          Contact Information
        </h2>
        
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 8px 0; color: #888888; width: 120px;">Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 500;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888888;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #18CCFC; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888888;">Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #18CCFC; text-decoration: none;">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888888;">Social/Website:</td>
            <td style="padding: 8px 0; color: #ffffff;">${social}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888888;">Industry:</td>
            <td style="padding: 8px 0; color: #ffffff;">${industry}</td>
          </tr>
        </table>
        
        <h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #ffffff; border-bottom: 1px solid #333; padding-bottom: 12px;">
          Project Details
        </h2>
        
        <div style="background-color: #1a1a1a; border-radius: 8px; padding: 16px; color: #cccccc; line-height: 1.6;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        
        <!-- CTA Button -->
        <div style="margin-top: 32px; text-align: center;">
          <a href="mailto:${email}?subject=Re: Your inquiry to BE CREATIVES CO." style="display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #4A90E2 0%, #18CCFC 100%); color: #000000; text-decoration: none; font-weight: 600; border-radius: 8px;">
            Reply to ${name}
          </a>
        </div>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="padding: 24px; background-color: #0a0a0a; text-align: center; border-top: 1px solid #222;">
        <p style="margin: 0; font-size: 12px; color: #666666;">
          This lead was submitted via the BE CREATIVES CO. website contact form.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `BE CREATIVES CO. <${FROM_EMAIL}>`,
      to: [BRIAN_EMAIL],
      replyTo: email,
      subject: `[LEAD ALERT] - ${name}`,
      text: emailBody,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data);

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

