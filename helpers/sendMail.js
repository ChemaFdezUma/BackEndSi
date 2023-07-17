import nodemailer from 'nodemailer'
const SMTP_MAIL = 'steamgalle@gmail.com'
const SMTP_PASSWORD = 'lucasnuv12'


const sendMail = async (email,mailSubject,content) => {
    try{
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            service: 'gmail',
            auth: {
                user: SMTP_MAIL,
                pass: "ewhdployajgnvxwb"
            }
        });
        let mailOptions = {
            from: SMTP_MAIL,
            to: email,
            subject: mailSubject,
            html: content,
            text: content
        };
        let info = await transporter.sendMail(mailOptions)
        console.log("Message sent: %s", info.messageId);
    }catch(error){
        console.log(error)
    }
}

export default sendMail