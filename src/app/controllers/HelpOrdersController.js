import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';

import HelpOrdersMail from '../jobs/HelpOrdersMail';
import Queue from '../../lib/Queue';

class HelpOrdersController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const helpOrders = await HelpOrders.findAll({
      where: {
        student_id: id,
      },
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { question } = req.body;

    const helpOrders = await HelpOrders.create({
      student_id: req.params.id,
      question,
    });

    return res.json(helpOrders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const helpOrders = await HelpOrders.findByPk(id);

    if (!helpOrders) {
      return res.status(400).json({ error: 'Help order does not exist.' });
    }

    const student = await Student.findByPk(helpOrders.student_id);

    const { answer } = req.body;
    const answer_at = new Date();

    helpOrders.update({
      answer,
      answer_at,
    });

    Queue.add(HelpOrdersMail.key, {
      helpOrders,
      student,
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrdersController();
