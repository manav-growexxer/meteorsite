import nodemailer from "nodemailer";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderDetails = {
  items: OrderItem[];
  total: number;
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
};

export const sendOrderConfirmationEmail = async (
  email: string,
  orderDetails: OrderDetails
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Order Confirmation",
    html: `
      <h1>Thank you for your order!</h1>
      <p>Your order has been confirmed. Here are the details:</p>
      <ul>
        ${orderDetails.items
          .map(
            (item) => `
            <li>${item.name} - ${item.quantity} x $${item.price}</li>
          `
          )
          .join("")}
      </ul>
      <p>Total: $${orderDetails.total}</p>
    `,
  });
};
