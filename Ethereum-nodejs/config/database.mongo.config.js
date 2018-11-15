import mongoose from 'mongoose';
export const url = 'mongodb://perseus:perseus@ds263137.mlab.com:63137/todo-db';
export default () => {

    mongoose.connect(url, {
        useMongoClient: true
    });
    mongoose.connection.on('error', function () {
        console.log('Could not connect to the database. Exiting now...');
        // process.exit();
    });

    mongoose.connection.once('open', function () {
        console.log("Successfully connected to mongodb database");
    })
}