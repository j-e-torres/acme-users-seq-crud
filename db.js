const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL);

const userArr = [
    {firstName: 'Juan', lastName: 'Juan'},
    {firstName: 'Batman', lastName: 'Man'},
    {firstName: 'Young', lastName: 'Justice'}
];

const User = db.define('user', {
    firstName: {type: Sequelize.STRING},
    lastName: {type: Sequelize.STRING}
})

const seed = () => db.sync( {force: true })
    .then(() => {return Promise.all([
        userArr.map(obj => {
            User.create( {firstName: obj.firstName, lastName: obj.lastName} )
        })
    ])
    });


module.exports = {
    models: {User},
    seed
}
