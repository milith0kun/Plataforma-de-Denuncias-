// Servicio de envío de emails (versión simplificada para desarrollo)
// En producción, se puede reemplazar con nodemailer, sendgrid, etc.

class EmailService {
  // Método para enviar email de recuperación de contraseña
  static async enviarEmailRecuperacion(email, token, nombres) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
      
      // En desarrollo: mostrar en consola
      if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_ENABLED) {
        console.log('\n========================================');
        console.log('📧 EMAIL DE RECUPERACIÓN DE CONTRASEÑA');
        console.log('========================================');
        console.log(`Para: ${email}`);
        console.log(`Nombre: ${nombres}`);
        console.log(`Token: ${token}`);
        console.log(`URL de recuperación: ${resetUrl}`);
        console.log('========================================\n');
        
        return {
          success: true,
          message: 'Email simulado (modo desarrollo)',
          token: token // Solo para desarrollo
        };
      }

      // En producción: aquí iría la integración con servicio de email real
      // Ejemplo con nodemailer (comentado):
      /*
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Recuperación de Contraseña - Plataforma de Denuncias',
        html: `
          <h2>Recuperación de Contraseña</h2>
          <p>Hola ${nombres},</p>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Este enlace expirará en 1 hora.</p>
          <p>Si no solicitaste este cambio, ignora este mensaje.</p>
        `
      });
      */

      return {
        success: true,
        message: 'Email enviado correctamente'
      };
    } catch (error) {
      console.error('Error al enviar email:', error);
      throw new Error('Error al enviar email de recuperación');
    }
  }

  // Método para enviar email de confirmación de cambio de contraseña
  static async enviarEmailConfirmacionCambio(email, nombres) {
    try {
      // En desarrollo: mostrar en consola
      if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_ENABLED) {
        console.log('\n========================================');
        console.log('📧 CONFIRMACIÓN DE CAMBIO DE CONTRASEÑA');
        console.log('========================================');
        console.log(`Para: ${email}`);
        console.log(`Nombre: ${nombres}`);
        console.log('Tu contraseña ha sido cambiada exitosamente.');
        console.log('========================================\n');
        
        return {
          success: true,
          message: 'Email de confirmación simulado'
        };
      }

      // En producción: enviar email real
      return {
        success: true,
        message: 'Email de confirmación enviado'
      };
    } catch (error) {
      console.error('Error al enviar email de confirmación:', error);
      // No lanzar error, solo registrar
      return {
        success: false,
        message: 'No se pudo enviar email de confirmación'
      };
    }
  }
}

export default EmailService;
