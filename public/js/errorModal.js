
$('.modal.mess').modal('hide')

errorFace = function(data) {

    $('.modal.mes')
        .modal('setting', 'closable', false)
        .modal('show')

    $('.modal.mes h2').text(data.mes)
    $('.modal.mes button').text(data.act).click(data.func)
}

