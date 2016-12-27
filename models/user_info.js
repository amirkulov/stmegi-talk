var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var validate = require('mongoose-validate');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;


var userSchema = new Schema({
        users           : ObjectId,
        firstname: {
            type        : String,
            required    : [true, 'Имя обязательно'],
            minlength   : [2, 'Используйте не менее 2 символов'],
            maxlength   : [20, 'Используйте не более 20 символов']
        },
        lastname: {
            type        : String,
            required    : [true, 'Фамилия обязательно'],
            minlength   : [2, 'Используйте не менее 2 символов'],
            maxlength   : [30, 'Используйте не более 30 символов']
        },
        username: {
            type        : String,
            unique      : [true, 'Имя пользователя уже существует'],
            required    : [true, 'Имя пользователя обязательно'],
            minlength   : [2, 'Используйте не менее 2 символов'],
            maxlength   : [15, 'Используйте не более 15 символов'],
            validate    : {
                validator: function(v) {
                    return /[a-z\d.]{2,15}/i.test(v);
                },
                message: 'Не корректное имя пользователя!'
            }
        },
        avatar: {
            type        : String
        },
        gender: {
            type        : String
        },
        age: {
            type        : Number
        },
        created: {
            type        : Date,
            default     : Date.now
        }
});

userSchema.plugin(uniqueValidator, { message: 'Ошибка, {VALUE} уже существует.' });

module.exports = mongoose.model('UserInfo', userSchema);