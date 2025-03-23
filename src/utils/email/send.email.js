import nodemailer from "nodemailer";
export const sendEmail=async({to="",cc="",bcc="",subject="saraha online",text="",html="",attachments=[]}={})=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        
     
          // send mail with defined transport object
          const info = await transporter.sendMail({
            from: `'"WhisperBox 📩" <${process.env.EMAIL}>'`, // sender address

            to,
            cc,
            bcc,
            subject,
            text,
            html,
            attachments
            
          });
          return info
        
}
     