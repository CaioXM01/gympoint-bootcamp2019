import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrdersMail {
  get key() {
    return 'HelpOrdersMail';
  }

  async handle({ data }) {
    const { helpOrders, student } = data;

    Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Pedido de Ajuda',
      template: 'helpOrders',
      context: {
        student: student.name,
        question: helpOrders.question,
        answer: helpOrders.answer,
        answer_date: format(
          parseISO(helpOrders.answer_at),
          "dd 'de' MMMM 'às' HH:mm",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new HelpOrdersMail();
