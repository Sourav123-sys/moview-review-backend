
const nodemailer = require("nodemailer")
exports.generateOTP = (otp_length = 3) => {
    let OTP = ""
for (let i = 0; i <=otp_length; i++){
    const randomValue = Math.round(Math.random() * 9)
    OTP += randomValue
    }
    return OTP;
} 

exports.generateMailTransport = () => {
    nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "bcd3e16f23ebe5",
          pass: "b9fa941bb8bd8a"
        }
    });
}