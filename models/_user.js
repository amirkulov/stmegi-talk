var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var validate = require('mongoose-validate');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local: {
        firstname: {
            type: String,
            required: [true, 'Имя обязательно'],
            minlength: [2, 'Используйте не менее 2 символов'],
            maxlength: [20, 'Используйте не более 20 символов']
        },
        lastname: {
            type: String,
            required: [true, 'Фамилия обязательно'],
            minlength: [2, 'Используйте не менее 2 символов'],
            maxlength: [30, 'Используйте не более 30 символов']
        },
        username: {
            type: String,
            unique: [true, 'Имя пользователя уже существует'],
            required: [true, 'Имя пользователя обязательно'],
            minlength: [2, 'Используйте не менее 2 символов'],
            maxlength: [15, 'Используйте не более 15 символов'],
            validate: {
                validator: function(v) {
                    return /[a-z\d.]{2,15}/i.test(v);
                },
                message: 'Не корректное имя пользователя!'
            }
        },
        avatar: {
            type: String
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Почта обязательно'],
            minlength: [6, 'Используйте не менее 6 символов'],
            maxlength: [60, 'Используйте не более 60 символов'],
            validate: [validate.email, 'Не корректная почта!']
        },
        password: {
            type: String,
            required: [true, 'Пароль обязательно'],
            minlength: [6, 'Используйте не менее 6 символов'],
            maxlength: [64, 'Используйте не более 64 символов']
        },
        created: {
            type: Date,
            default: Date.now
        }
    },

    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },

    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },

    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

userSchema.plugin(uniqueValidator, { message: 'Ошибка, {VALUE} уже существует.' });

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);/**
 * Created by HP on 26.12.2016.
 */
