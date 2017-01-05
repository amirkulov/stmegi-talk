$(document).ready(function () {
    $("#loginForm").validate({
        errorClass: "error",
        rules: {

            email: {
                required: true,
                email: true
            },

            password: {
                required: true,
                minlength: 6,
                maxlength: 16
            }
        },

        messages: {

            email: {
                required: "Это поле обязательно для заполнения",
                email: "Адрес невалиден"
            },

            password: {
                required: "Это поле обязательно для заполнения",
                minlength: "Пароль должен быть минимум 6 символа",
                maxlength: "Пароль должен быть максимум 16 символов"
            }

        }

    });
}); //END READY