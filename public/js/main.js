$(document).ready(() => {   
    console.log(JSON.stringify($('#form_subscribe').serializeJSON()));
    $('#form_subscribe').submit((e) => {
        console.log(JSON.stringify($('#form_subscribe').serializeJSON()));
        e.preventDefault();
        $.ajax({
            url: '/api/subscribe',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify($('#form_subscribe').serializeJSON()),
            success: function () {
                $('#alert-success').css('display', 'block');
                $('#alert-error').css('display', 'none');
                var msgContainer = $('#msg');
                var msg = 'Los datos se guardaron correctamente.';
                msgContainer.innerHTML = '';
                var msgList = '<li>' + msg + '</li>';
                msgContainer.html(msgList);
            },
            error: function (data) {
                $('#alert-error').css('display', 'block');
                $('#alert-success').css('display', 'none');
                var errors = JSON.parse(data.responseText);
                var errorsContainer = $('#errors');
                errorsContainer.innerHTML = '';
                var errorsList = '';

                for (var i = 0; i < errors.length; i++) {
                    errorsList += '<li>' + errors[i].msg + '</li>';
                }
                
                errorsContainer.html(errorsList);
            }
        });
    });
});