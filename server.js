const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('ready!');
});

app.listen(3000, () => console.log('Server app listening on port 3000!'));
