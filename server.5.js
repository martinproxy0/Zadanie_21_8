const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/nodedb', {
    useMongoClient: true
});


//new user Schema
const userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: Boolean,
    created_at: Date,
    updated_at: Date
});

//Mongoose schema method
userSchema.methods.manify = function(next) {
    this.name = this.name + '-boy';

    return next(null, this.name);
};

//pre-save method
userSchema.pre('save', function(next) {
    //pobranie aktualnego czasu
    const currentDate = new Date();

    //zmiana pola na aktualny czas
    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

const User = mongoose.model('User', userSchema);

const query = User.find({ username: 'Kenny_the_boy' });
const promise = query.exec();
// if ok 
promise.then(function(user) {
    // nowy promis przy save'ie
    user.remove(function(err) {
        if (err) throw err;

        console.log('User successfully deleted');
    });
});
// if error
promise.catch(function(reason) {
    console.log('Something went wrong: ', reason);
});

/* mozna szybciej używając metody
User.findOneAndRemove({ username: 'Benny_the_man' }, function(err) {
    if (err) throw err;

    console.log('User deleted!');
});
*/