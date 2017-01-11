var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence');
var uniqueValidator = require('mongoose-unique-validator');
var validate = require('mongoose-validate');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    idPage:  { 
        type: Number, 
        default: 0 
    },
    
    local: {
        firstName   : {
            type: String
        },
        lastName    : {
            type: String
        },
        email       : {
            type: String,
            unique: true,
            validate: [validate.email, 'Не корректная почта!']
        },
        password    : String
    },
    
    facebook: {
        id          : String,
        token       : String,
        email       : String,
        name        : String
    },

    vk: {
        id          : String,
        token       : String,
        username    : String,
        name        : String
    },

    twitter: {
        id          : String,
        token       : String,
        displayName : String,
        username    : String
    },

    google: {
        id          : String,
        token       : String,
        email       : String,
        name        : String
    },

    odnoklassniki: {
        id          : String,
        token       : String,
        email       : String,
        name        : String
    }
});

userSchema.plugin(AutoIncrement, {inc_field: 'idPage'});

userSchema.plugin(uniqueValidator, { message: 'Ошибка, {VALUE} уже существует.' });

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);