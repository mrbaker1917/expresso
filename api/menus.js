const express = require('express');
const menusRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const menuItemsRouter = require('./menu-items');

menusRouter.use('/:menuId/menu-items', menuItemsRouter);

menusRouter.param('menuId', (req, res, next, menuId) => {
    const sql = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
    const values = {$menuId: menuId};
    db.get(sql, values, (error, menu) => {
        if (error) {
            next(error);
        } else if (menu) {
            req.menu = menu;
            next();
        } else {
            res.sendStatus(404);
        }
    });
});

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
            (error, menu) => {
                res.status(201).json({menu: menu});
            })
        }
    });
});

menusRouter.get('/:menuId', (req, res, next) => {
    res.status(200).json({menu: req.menu});
});

menusRouter.put('/:menuId', (req, res, next) => {
    const title = req.body.menu.title;
    if (!title) {
        return res.sendStatus(400);
    }
    const sql = 'UPDATE Menu SET title = $title';
    const values = {$title: title};
    db.run(sql, values, function(error) {
        if (error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`,
            (error, menu) => {
                res.status(200).json({menu: menu});
            });
        }
    });
});

menusRouter.delete(':menuId', (req, res, next) => {
    const menuSql = 'SELECT * FROM Menu WHERE Menu.'
    const sql = 'DELETE FROM Menu WHERE Menu.id = $menuId';
    const values = {$menuId: req.params.menuId};
    db.run(sql, values, (error) => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(204);
        }
    })
});


module.exports = menusRouter;