import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (to, otp) => {
  const { data, error } = await resend.emails.send({
    from: "SITHIJA SOFTWARE <onboarding@resend.dev>",
    to: [to],
    subject: "OTP for Password Reset",
    html: `
      <div style="font-family: Arial;">
        <h2>Password Reset OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Expires in 5 minutes.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};