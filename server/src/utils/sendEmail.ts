import nodemailer from 'nodemailer';

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.MAIL_USERNAME,
        to,
        subject,
        html,
    });
}
