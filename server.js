const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(
        `port ${port} is Running for ${__dirname.split('/').reverse()[0]} APP`,
    );
});

console.log(process.env);
