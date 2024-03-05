const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
    {
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'lets_change_bot@mail.ru',
            pass: 'Ff3hwDNMeLNM7pstQqaF',
        },
    },
    {
        from: 'Давай меняться <lets_change_bot@mail.ru>',
    },
);

const mailer = (message) => {
    transporter.sendMail(message, (err, info) => {
        if (err) return console.log(err);
        console.log('Email sent: ', info);
    });
};

module.exports = mailer;

//!Для работы mailer достаточно импортировать функцию из 25 строки и передать в неё объект по формату, приведенному ниже (33-37 стр.)

//! Данные от почтового ящика:
//! login - lets_change_bot@mail.ru
//! password - Pam-pam99@@

//* const message = {
//*     to: 'sobakar.artyom@gmail.com',
//*     subject: 'Nodemailer test',
//*     text: 'Невероятно, все работает!'
//* }
