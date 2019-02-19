const express = require('express');
const app = express();
const db = require('./db');
const { User } = db.models;
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false}));
app.use((req, res, next) => {
    User.findAll()
        .then(users => {
            req.users = users;
            next()
        })
        .catch(next);
})

const renderUserUpdate = (users, user) => {
    return `<!DOCTYPE html>
    <html>
        <head>
            <title> Acme Users CRUD-SEQ </title>
            <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'>

        </head>

        <body>
            <div class='container'>
                <h1> Acme Users CRUD-SEQ </h1>
                <ul>
                    ${users.map(user => {
                        return `
                            <li class='list-group-item'>
                                <a href='/users/${user.id}'>
                                ${user.firstName} ${user.lastName}
                                </a>

                                <form method='post' action='/users/${user.id}/?_method=delete'>
                                    <button class='btn btn-danger'> Delete </button>
                                </form>
                            </li>
                        `
                    }).join('')}
                </ul>

                <div style='border: solid 1px black; border-radius: 5px; margin-top: 10px; padding: 10px'>
                    <form method='post' action='/users/${user.id}/?_method=put'>

                        <input name='firstName' value='${user.firstName}'>
                        <input name='lastName' value='${user.lastName}'>
                        
                        <button> Update </button>

                        <a href='/users'> Cancel </a>
                    </form>
                </div>
            </div>
        </body>
    </html>
    `
}

const renderUsers = (users) => {
    return `<!DOCTYPE html>
    <html>
        <head>
            <title> Acme Users CRUD-SEQ </title>
            <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'>

        </head>

        <body>
            <div class='container'>
                <h1> Acme Users CRUD-SEQ </h1>
                <ul>
                    ${users.map(user => {
                        return `
                            <li class='list-group-item'>
                                <a href='/users/${user.id}'>
                                ${user.firstName} ${user.lastName}
                                </a>

                                <form method='post' action='/users/${user.id}/?_method=delete'>
                                    <button class='btn btn-danger'> Delete </button>
                                </form>
                            </li>
                        `
                    }).join('')}
                </ul>

                <div style='border: solid 1px black; border-radius: 5px; margin-top: 10px; padding: 10px'>
                    <form method='post' action='/users/'>

                        <input name='firstName' value>
                        <input name='lastName' value>
                        
                        <button> Create </button>

                        <a href='/users'> Cancel </a>
                    </form>
                </div>
            </div>
        </body>
    </html>
    `
}

app.get('/', (req, res, next) => {
    res.redirect(`/users`);
})

app.get('/users', (req, res, next) => {
    User.findAll()
        .then((users) => res.send(renderUsers(users)))
        .catch(next);
})

app.post('/users', (req, res, next) => {
    User.create( {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })
    .then( () => res.redirect('/users'))
    .catch(next);
})

app.delete('/users/:id', (req, res, next) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(() => res.redirect('/users'))
    .catch(next);
})

app.get('/users/:id', (req, res, next) => {
    User.findByPk(req.params.id)
    .then((user) => res.send(renderUserUpdate(req.users, user)))
    .catch(next);
})

app.put('/users/:id', (req, res, next) => {
    User.update({firstName: req.body.firstName, lastName: req.body.lastName}, {
        where: {
        id: req.params.id
    }
    })
    .then(() => res.redirect(`/users`))
    .catch(next);
})

module.exports = app;
