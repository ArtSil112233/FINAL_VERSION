// import nodemailer from "nodemailer";
// import Admins from "/administradores.json";
// import Alumno from "/usuario.json";

// export default async (req, res) => {
//   if (req.method === 'POST') {
//     const { usuario } = req.body;

//     // Verificar si el correo está en administradores o usuarios
//     const admin = Object.values(Admins).find((admin) => admin.correo === usuario);
//     const alumni = Object.values(Alumno).find((alumni) => alumni.correo === usuario);

//     if (admin || alumni) {
//       // Genera un token simple (esto debería ser más seguro en producción)
//       const token = Math.random().toString(36).substring(7);

//       // Configura el transporter de Nodemailer
//       let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: 'aless@gmail.com',
//           pass: 'ujimipol',
//         },
//       });

//       // Opciones del correo
//       let mailOptions = {
//         from: 'aless@gmail.com',
//         to: usuario,
//         subject: 'Recuperación de Contraseña',
//         // Colocar url del sitio web
//         text: `Haz click en el enlace para recuperar tu contraseña: http://tuweb.com/reset-password?token=${token}`,
//       };

//       // Envía el correo
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           res.status(500).send("Error enviando correo.");
//         } else {
//           res.status(200).send("Correo enviado.");
//         }
//       });
//     } else {
//       res.status(404).send("Correo no registrado.");
//     }
//   } else {
//     res.status(405).end(); // Método no permitido
//   }
// };
