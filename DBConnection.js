const mySQLDB = require('./DBConfig');
// const delivery = require('../models/delivery');
// const OrderItems = require('../models/OrderItem');



// jia en
const user = require('../models/cUser');
const feedback = require('../models/feedback');
const payment = require('../models/payments');
const cart = require('../models/carts');
const wishlist = require('../models/wishlist');
const shopp = require('../models/form');
const orderd = require('../models/orderDetails');




// const video = require('../models/Video');
// If drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Delivery database connected');
        })
        .then(() => {
            // OrderItems.hasMany(OrderItems, { foreignKey: 'cOrderNo' });
            // delivery.belongsTo(delivery, { foreignKey: 'cOrderNo' });
            /*
            Defines the relationship where a user has many videos.
            In this case the primary key from user will be a foreign key
            in video.
            */
            // user.hasMany(video); //impt


            //jia en
            user.hasMany(orderd, { foreignKey: 'CuserId' });
            orderd.belongsTo(user, { foreignKey: 'CuserId' });
            user.hasMany(cart, { foreignKey: 'CuserId' });
            cart.belongsTo(user, { foreignKey: 'CuserId' });
            shopp.hasMany(cart, { foreignKey: 'itemid' });
            cart.belongsTo(shopp, { foreignKey: 'itemid' });
            user.hasMany(wishlist, { foreignKey: 'CuserId' });
            wishlist.belongsTo(user, { foreignKey: 'CuserId' });
            shopp.hasMany(wishlist, { foreignKey: 'itemid' });
            wishlist.belongsTo(shopp, { foreignKey: 'itemid' }); 
            user.hasMany(feedback, { foreignKey: 'CuserId' });
            feedback.belongsTo(user, { foreignKey: 'CuserId' });

            user.hasMany(payment, { foreignKey: 'CuserId' }); 
            payment.belongsTo(user, { foreignKey: 'CuserId' });
            payment.hasMany(orderd, { foreignKey: 'orderid' }); 
            orderd.belongsTo(payment, { foreignKey: 'orderid' });
            shopp.hasMany(orderd, { foreignKey: 'itemid' });
            orderd.belongsTo(shopp, { foreignKey: 'itemid' });


            mySQLDB.sync({ // Creates table if none exists
                force: drop
            }).then(() => {
                console.log('Create tables if none exists')
            }).catch(err => console.log(err))
        })
        .catch(err => console.log('Error: ' + err));
};
module.exports = { setUpDB };