const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const db = monk('localhost/meower');
const meows = db.get('meows'); 
const limit = require('express-rate-limit');

const app = express();
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log('listening on port 5000');
});

app.get('/', (req, res) => {
    res.json({
        message: 'meower',
    });
});

function isValidMeow(meow) {
    return meow.name && meow.name.toString().trim() !== '' && meow.content && 
        meow.content.toString().trim() !== '';
}

app.get('/meows', (req, res) => {
    meows
    .find()
        .then(meows => res.json(meows));
});

app.use(limit({
    windowMs: 15 * 1000,
    max: 1,
}));

app.post('/meows', (req, res) => {
    if (isValidMeow(req.body)) {
        const meow = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };
        meows
            .insert(meow)
            .then(createdMeow => {
                res.json(createdMeow);
            });
        console.log(meow.name, meow.content);
    } else {
        res.status(422);
        res.json({
            message: "Hey your meow isn't good!"
        });
    }
});