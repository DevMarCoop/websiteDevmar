import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

interface ContactEmailParams {
  name: string;
  email: string;
  message: string;
}

export const sendContactEmail = async (data: ContactEmailParams): Promise<void> => {
  const templateParams = {
    from_name: data.name,
    from_email: data.email,
    message: data.message,
  };

  try {
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATES.CONTACT,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    console.log('Email enviado com sucesso!');
  } catch (error) {
    console.error('Falha ao enviar o email:', error);
    throw new Error('Falha ao enviar a mensagem. Tente novamente mais tarde.');
  }
};
