const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const User = db.define('Cuser', {
    name: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    contact: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    profileURL:{
        type: Sequelize.STRING
    }
});
module.exports = User;