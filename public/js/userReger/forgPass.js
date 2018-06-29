$('#passForget').on('click', () => {

    $('#forgPassDiv').show()
    $('#sign-up-in').hide()

})

$('#forgPassForm').submit(function () {

    $.post('/user/passRecov/forgPass', $('#forgPassForm').serialize(), function (data, status, someShit) {

        let passData = undefined

        if (data.err)
            passData = {

                mes: 'E-Mail Not Found',
                act: 'Try Again',
                func: function () {

                    $('.modal.mes').modal('hide')
                }
            }

        else
            passData = {

                mes: 'Recovery Mail Send to Your Account',
                act: 'Go Back',
                func: function () {

                    $('.modal.mes').modal('hide')
                    $('#forgPassDiv').hide()
                    $('#sign-up-in').show()
                }
            }

         errorFace(passData)
    })

    return false
})

$('#forgPassDiv').hide()

$('button.goBack').click(function () {

    ('.modal.mes').modal('hide')
    $('#forgPassDiv').hide()
    $('#sign-up-in').show()

})