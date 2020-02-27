const express = require('express');
const menusRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menusRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Menu', 
    (error, menus) => {
        if (error) {
            next(error);
        } else {
            res.status(200).json({menus: menus});
        }
    });
});

menusRouter.post('/', (req, res, next) => {
    const title = req.body.menu.title;
    if (!title) {
        return res.sendStatus(400);
    }
    const sql = 'INSERT INTO Menu (title) VALUES ($title)';
    const values = {$title: title};
    db.run(sql, values, function(error) {
        if (error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`,
            (error, menus) => {
                res.status(201).json({menus: menus});
            })
        }
    });
});


module.exports = menusRouter;