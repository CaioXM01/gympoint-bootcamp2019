import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.INTEGER,
        height: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', student => {
      if (student.height) {
        student.height *= 100;
      }
      if (student.weight) {
        student.weight *= 1000;
      }
    });

    return this;
  }
}

export default Student;
