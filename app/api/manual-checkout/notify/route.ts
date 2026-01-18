import { sendEmail } from "@/libs/resend";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import config from "@/config";

const ADMIN_EMAIL = "kadyrovadel@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const body = await req.json();
    const { variantId } = body;

    if (!variantId) {
      return NextResponse.json(
        { error: "Variant ID is required" },
        { status: 400 }
      );
    }

    const plan = config.lemonsqueezy.plans.find(
      (p) => p.variantId === variantId
    );

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 400 });
    }

    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    const userName = user.firstName
      ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
      : userEmail;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Small delay helper to avoid rate limits
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Send admin notification email
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Plan Interest: ${plan.name} - ${userName}`,
      text: `
New user interested in ${plan.name} plan ($${plan.price})

User Details:
- Name: ${userName}
- Email: ${userEmail}
- User ID: ${userId}
- Plan: ${plan.name}
- Price: $${plan.price}

Please reach out to complete the payment process.
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h2 style="margin: 0 0 16px; color: #111827;">New Plan Interest: ${plan.name}</h2>
    <p style="margin: 0; color: #4b5563;">A new user has expressed interest in purchasing a plan.</p>
  </div>

  <h3 style="margin: 24px 0 12px; color: #111827;">User Details</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Name</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 500;">${userName}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Email</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${userEmail}" style="color: #6366f1; text-decoration: none;">${userEmail}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">User ID</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-family: monospace; font-size: 14px;">${userId}</td>
    </tr>
  </table>

  <h3 style="margin: 24px 0 12px; color: #111827;">Plan Details</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Plan</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 500;">${plan.name}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Price</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #22c55e; font-weight: 600;">$${plan.price}</td>
    </tr>
    ${plan.description ? `<tr><td style="padding: 8px 0; color: #6b7280;">Description</td><td style="padding: 8px 0; color: #111827;">${plan.description}</td></tr>` : ""}
  </table>

  <div style="margin-top: 24px; padding: 16px; background: #fef3c7; border-radius: 8px;">
    <p style="margin: 0; color: #92400e; font-size: 14px;">
      <strong>Action Required:</strong> Please reach out to the user to complete the payment process.
    </p>
  </div>
</body>
</html>
      `,
      replyTo: userEmail,
    });

    // Wait 600ms to avoid Resend rate limit (2 requests/second)
    await delay(600);

    // Send user confirmation email
    await sendEmail({
      to: userEmail,
      subject: `Thank you for your interest in ${config.appName}`,
      text: `
Hi ${user.firstName || "there"},

Thank you for choosing ${config.appName}!

You've selected the ${plan.name} plan ($${plan.price}).

We're currently setting up your account and will reach out within 24 hours to complete your purchase and get you started.

In the meantime, if you have any questions, simply reply to this email - we're here to help.

Best regards,
The ${config.appName} Team
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="color: #6366f1; margin: 0; font-size: 28px;">${config.appName}</h1>
  </div>

  <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px;">
    <div style="background: white; width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    </div>
    <h2 style="color: white; margin: 0 0 8px; font-size: 24px;">Request Received!</h2>
    <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">Your ${plan.name} plan selection is confirmed</p>
  </div>

  <p style="font-size: 16px; margin-bottom: 24px;">Hi ${user.firstName || "there"},</p>

  <p style="font-size: 16px; margin-bottom: 24px;">
    Thank you for choosing ${config.appName}! We're thrilled to have you join our community of creators.
  </p>

  <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h3 style="margin: 0 0 16px; color: #111827; font-size: 18px;">Your Selection</h3>
    <table style="width: 100%;">
      <tr>
        <td style="color: #6b7280;">Plan</td>
        <td style="text-align: right; font-weight: 600; color: #111827;">${plan.name}</td>
      </tr>
      <tr>
        <td style="color: #6b7280;">Price</td>
        <td style="text-align: right; font-weight: 600; color: #22c55e;">$${plan.price}</td>
      </tr>
    </table>
  </div>

  <div style="background: #eff6ff; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h3 style="margin: 0 0 16px; color: #1e40af; font-size: 18px;">What happens next?</h3>
    <ol style="margin: 0; padding-left: 20px; color: #3b82f6;">
      <li style="margin-bottom: 8px;">Our team will review your request</li>
      <li style="margin-bottom: 8px;">We'll reach out within 24 hours</li>
      <li style="margin-bottom: 8px;">Complete your secure payment</li>
      <li style="margin-bottom: 0;">Get instant access to ${config.appName}</li>
    </ol>
  </div>

  <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">
    Have questions? Simply reply to this email - we're here to help!
  </p>

  <p style="font-size: 16px; margin-bottom: 4px;">Best regards,</p>
  <p style="font-size: 16px; margin: 0; font-weight: 500;">The ${config.appName} Team</p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

  <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
    You received this email because you signed up for ${config.appName}.<br>
    <a href="https://${config.domainName}" style="color: #6b7280;">${config.domainName}</a>
  </p>
</body>
</html>
      `,
    });

    console.log(
      `[Manual Checkout] Notifications sent for user ${userEmail}, plan ${plan.name}`
    );

    return NextResponse.json({
      success: true,
      plan: {
        name: plan.name,
        price: plan.price,
      },
    });
  } catch (error) {
    console.error("Manual checkout notification error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send notifications",
      },
      { status: 500 }
    );
  }
}
