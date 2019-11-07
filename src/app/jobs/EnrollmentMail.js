import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment, student, plan } = data;

    Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula Realizada',
      template: 'enrollment',
      context: {
        student: student.name,
        plan: plan.title,
        price: plan.price,
        end_date: format(
          parseISO(enrollment.end_date),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        start_date: format(
          parseISO(enrollment.start_date),
          "'dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new EnrollmentMail();
