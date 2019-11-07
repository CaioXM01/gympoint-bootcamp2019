import { startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { id } = req.params;

    const checkin = await Checkin.findAll({
      where: {
        student_id: id,
      },
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(checkin);
  }

  async store(req, res) {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const date = new Date();
    const startWeek = startOfWeek(date);
    const endWeek = endOfWeek(date);

    const contCheckins = await Checkin.count({
      where: {
        student_id: req.params.id,
        created_at: {
          [Op.between]: [startWeek, endWeek],
        },
      },
    });

    if (contCheckins >= 5) {
      return res.status(400).json({
        error:
          'Sorry, you have exceeded the 5 checkins limit in 7 calendar days.',
      });
    }

    const checkin = await Checkin.create({
      student_id: req.params.id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
