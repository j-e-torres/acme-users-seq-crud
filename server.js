const app = require('./app');
const PORT = process.env.PORT || 4000;
const db = require('./db');

app.listen(PORT, () => {
    console.log('listening to port', PORT)
})

db.seed();
