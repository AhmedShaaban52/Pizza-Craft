import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "./db";
import * as schema from "./schema";
import { emailOTP } from "better-auth/plugins/email-otp";
import { resend } from "./resend";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user }) => {
      await resend.emails.send({
        from: "PizzaCraft <onboarding@resend.dev>",
        to: [user.email],
        subject: "PizzaCraft - Verify your email",
        html: `<p>Please verify your email to complete sign-up for PizzaCraft.</p>`,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Mapping subjects and labels dynamically depending on the request type
        const subjects: Record<string, string> = {
          "email-verification": "PizzaCraft - Verify your email",
          "forget-password": "PizzaCraft - Reset your password",
          "password-reset": "PizzaCraft - Reset your password",
          "change-email": "PizzaCraft - Confirm email change",
        };

        const labels: Record<string, string> = {
          "email-verification": "verify your email address",
          "forget-password": "reset your account password",
          "password-reset": "reset your account password",
          "change-email": "confirm your new email address",
        };

        const currentSubject =
          subjects[type] ?? "PizzaCraft - Secure Verification Code";
        const currentLabel = labels[type] ?? "verify your identity";

        await resend.emails.send({
          from: "Pizza Craft <onboarding@resend.dev>",
          to: [email],
          subject: currentSubject,
          html: `
                <div style="background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; text-align: center;">
                    <div style="max-width: 440px; margin: 0 auto; background-color: #171717; border: 1px solid #262626; border-radius: 24px; padding: 40px 32px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
                        
                        <div style="margin-bottom: 32px;">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 8px;">
                                        <span style="font-size: 28px; display: inline-block; line-height: 1;">🍕</span>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <span style="font-size: 26px; font-weight: 900; letter-spacing: -0.05em; color: #ffffff; font-family: sans-serif;">
                                            Pizza<span style="color: #ea580c;">Craft</span>
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <h2 style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 12px 0; tracking: -0.025em;">
                            Verification Code
                        </h2>
                        <p style="color: #a3a3a3; font-size: 14px; line-height: 1.5; margin: 0 0 32px 0;">
                            Please use the 6-digit secure code below to ${currentLabel}.
                        </p>

                        <div style="background-color: #0a0a0a; border: 1px solid #404040; border-radius: 16px; padding: 20px; margin-bottom: 32px;">
                            <span style="font-size: 36px; font-weight: 900; color: #ffffff; letter-spacing: 8px; font-family: monospace; display: block; padding-left: 8px;">${otp}</span>
                        </div>

                        <p style="color: #737373; font-size: 12px; line-height: 1.4; margin: 0; padding-top: 16px; border-top: 1px solid #262626;">
                            This code is valid for <b>5 minutes</b>. For security reasons, do not share this email or verification code with anyone.
                        </p>
                    </div>
                    
                    <p style="color: #525252; font-size: 12px; margin-top: 24px;">
                        © ${new Date().getFullYear()} PizzaCraft. All rights reserved.
                    </p>
                </div>
                `,
        });
      },
    }),
    admin(),
  ],
});
