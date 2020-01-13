import responseMsg from "./responseMsg";
import nodemailer from "nodemailer";
const sendEmail=async (email,name, reason )=>{
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "bihireb1@gmail.com",
            pass: "bobo12345"
        }
    });
    const mailOptio = {
        from: "bihireb1@gmail.com",
        to: `${email}`,
        subject: `employee management`,
        html: `<p>Hello ${name}</p>,</br> <p>${reason}</p>`
    };
    await transport.sendMail(mailOptio, (err, json) => {
        if (err) responseMsg.errorMsg(
                res,
                400,
                "there was an error while sending the email to user"
            );
        console.log('email sent successfully')
    });
}
export default  sendEmail