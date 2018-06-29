function hideModal() {

    $('.ui.modal')
        .modal('hide')
    ;
}

$(document).ready(function () {

    hideModal()
})

$('.actions .okay').on('click', function () {

    let URL = `/card/postCard/${userNow}`
    let dataPost = $('form').serialize()

    let dataCheck = $('form').serializeArray()
    let incomp = 0

    dataCheck.forEach(item => {

        if (item.value === "" && item.name !== 'desc')
            incomp = 1
    })

    if (incomp)
        $('.card-details .error.message').show()

    else {
        $.post(URL, dataPost, function (data, status) {

            if (data.err){

                let passData = {

                    mes: data.mes,
                    act: 'Login To Continue',
                    func: function () {

                        window.location = '/user/signupin'
                    }
                }

                errorFace(passData)
            }

            else {

                pasteCards()
                $('.ui.modal').modal('hide')
            }

        })
    }
})

$('.actions .upt').on('click', function () {

    let URL = '/card/uptCard/'
    let dataPut = $('form').serialize()
    dataPut += `&_id=${uptId}`

    let dataCheck = $('form').serializeArray()
    let incomp = 0

    dataCheck.forEach(item => {

        if (item.value === "" && item.name !== 'desc')
            incomp = 1
    })

    if (incomp)
        return $('.card-details .error.message').show()

    $.ajax({
        url: URL,
        type: 'put',
        data: dataPut,
        success: function (data, status, someShit) {

            if (data.err){

                let passData = {

                    mes: data.mes,
                    act: 'Login To Continue',
                    func: function () {

                        window.location = '/user/signupin'
                    }
                }

                errorFace(passData)
            }

            else {

                pasteCards()
                $('.ui.modal').modal('hide')
            }
        }
    })
})