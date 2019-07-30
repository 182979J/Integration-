const mySQLDB = require('./DBConfig');
const delivery = require('../models/delivery');
const OrderItems = require('../models/OrderItem');
// const video = require('../models/Video');
// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Delivery database connected');
        })
        .then(() => {
            OrderItems.hasMany(OrderItems, { foreignKey: 'cOrderNo' });
            delivery.belongsTo(delivery, { foreignKey: 'cOrderNo' });
            /*
            Defines the relationship where a user has many videos.
            In this case the primary key from user will be a foreign key
            in video.
            */
            // user.hasMany(video); //impt
            mySQLDB.sync({ // Creates table if none exists
                force: drop
            }).then(() => {
                console.log('Create tables if none exists')
            }).catch(err => console.log(err))
        })
        .catch(err => console.log('Error: ' + err));
};
module.exports = { setUpDB };