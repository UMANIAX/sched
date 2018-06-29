$('#signUpForm').submit(function () {

    $.post('/user/signupPost', $('#signUpForm').serialize(), function (data, status, someShit) {

        if (data.err) {

            let passData = {

                mes: data.mes,
                act: 'Try Again',
                func: function () {

                    $('.modal.mes').modal('hide')
                }
            }

            errorFace(passData)
        }

        // localStorage.setItem('token', data.token)
        else
            window.location = data.redirect
    })

    return false
})

$('#loginForm').submit(function () {

    let sendData = $(this).serialize()

    $.post('/user/loginPost', sendData, function (data, status, someShit) {

        if (data.err) {

            let passData = {

                mes: data.mes,
                act: 'Try Again',
                func: function () {

                    $('.modal.mes').modal('hide')
                }
            }

            errorFace(passData)
        }

        else
            window.location = data.redirect
    })

    return false
})

// $('body').css('overflow', 'hidden')
$('form .field').attr('align', 'left')