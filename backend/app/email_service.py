import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "samsonisaac2002@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
OPERATOR_EMAIL = os.getenv("OPERATOR_EMAIL", "samsonisaac1172@gmail.com")

def send_email_notifications(name: str, email: str, project_type: str, budget: str, description: str, phone: str = "", company: str = ""):
    """
    Sends a confirmation 'Thank You' email to the client, and a notification email to the operator.
    If SMTP credentials are not configured, prints the email details to stdout for local debugging.
    """
    # HTML formatted client confirmation email
    client_subject = "Thank you for contacting TicTip Technology"
    client_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #111111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background-color: #0b0b0b; padding: 15px; text-align: center; border-radius: 6px 6px 0 0;">
          <h2 style="color: #c6ff00; margin: 0; font-weight: 800;">TicTip Technology</h2>
        </div>
        <div style="padding: 20px 10px;">
          <p>Hi <strong>{name}</strong>,</p>
          <p>Thank you for reaching out to us! We have received your inquiry regarding <strong>{project_type}</strong>.</p>
          <p>Here is a summary of the details we received:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #718096; width: 140px;">Company</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold;">{company or 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #718096;">Service</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold;">{project_type}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; color: #718096;">Budget Range</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold;">{budget}</td>
            </tr>
          </table>
          <p>One of our senior engineers will review your details and get back to you within 24 hours.</p>
          <p>Best regards,<br/><strong>The TicTip Tech Team</strong></p>
        </div>
        <div style="background-color: #f7fafc; padding: 10px; text-align: center; font-size: 12px; color: #a0aec0; border-radius: 0 0 6px 6px;">
          © 2026 TicTip Technology. Chennai, India.
        </div>
      </body>
    </html>
    """

    # Plain text operator notification email
    operator_subject = f"[New Lead Generated] {name} - {project_type}"
    operator_body = f"""
======================================================================
NEW LEAD SUBMISSION
======================================================================

Lead Details:
----------------------------------------------------------------------
Name:         {name}
Email:        {email}
Phone:        {phone or 'Not Provided'}
Company:      {company or 'Not Provided'}
Service Type: {project_type}
Budget Range: {budget}

Project Brief / Description:
----------------------------------------------------------------------
{description}

----------------------------------------------------------------------
Sent via TicTip Technology Automated Lead System.
"""

    if not SMTP_USER or not SMTP_PASSWORD:
        print("\n=== [LOCAL SMTP DEBUG LOG] ===")
        print(f"SMTP Credentials not configured. Simulated emails output:")
        print(f"TO: {email} (Client)")
        print(f"SUBJECT: {client_subject}")
        print(f"CONTENT: (HTML body generated for {name})")
        print("---------------------------------------------------------")
        print(f"TO: {OPERATOR_EMAIL} (Operator)")
        print(f"SUBJECT: {operator_subject}")
        print(f"CONTENT:\n{operator_body}")
        print("===============================\n")
        return

    try:
        # Send to Client (HTML)
        msg_client = MIMEMultipart("alternative")
        msg_client["From"] = SMTP_USER
        msg_client["To"] = email
        msg_client["Subject"] = client_subject
        msg_client.attach(MIMEText(client_body, "html"))

        # Send to Operator (Plain Text)
        msg_operator = MIMEMultipart()
        msg_operator["From"] = SMTP_USER
        msg_operator["To"] = OPERATOR_EMAIL
        msg_operator["Subject"] = operator_subject
        msg_operator.attach(MIMEText(operator_body, "plain"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, email, msg_client.as_string())
            server.sendmail(SMTP_USER, OPERATOR_EMAIL, msg_operator.as_string())

        print(f"[Email Service] Successfully sent thank you email to {email} and lead notification to {OPERATOR_EMAIL}.")
    except Exception as e:
        print(f"[Email Service ERROR] Failed to send email: {e}")
