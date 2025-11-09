const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;

//TODO 🔹 Build the remote MongoDB connection string
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

mongoose
    .connect(DB)
    .then(() => console.log('✅ Database connected successfully'));

app.listen(port, () => {
    console.log(
        `port ${port} is Running for ${__dirname.split('/').reverse()[0]} APP`,
    );
});

// console.log(process.env);
