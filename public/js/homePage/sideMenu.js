$('.modalAdd').on('click', () => {

    $('.ui.modal.card-details').modal('show')

    //Clear Fields
    $('.cardDet .dTitle').val('')

    $('.typeField div.text').text('Select Type')
    $('.cardDet .dType').attr('required-value', '').attr('value', '')

    $('input.dDate').val('')
    $('input.dTime').val('')

    $(`#freq input.once`).attr('checked', 'checked')

    $(`#urg input.low`).attr('checked', 'checked')

    $('.cardDet .desc').val('')

    $('.card-details .error.message').hide()
    $('.ui.modal .actions .okay').show()
    $('.ui.modal .actions .upt').hide()
})

$('.logout').on('click', async function () {

    $.post('/user/logout', {}, function (data) {

        window.location = data
    })
})

$('.sorting .item.dropdown').click(function () {

    $('.sorting .item.dropdown').dropdown()
})

$('.timeSort .inc').click(function () {

    let cards = globalCardData

    cards.sort(function (a, b) {

        let diff_a = getProperDiff(`${a.date}T${a.time}:00`)
        let diff_b = getProperDiff(`${b.date}T${b.time}:00`)

        return (diff_a < diff_b) ? -1 : 1
    })

    putThemUp(cards)
})

$('.timeSort .dec').click(function () {

    let cards = globalCardData

    cards.sort(function (a, b) {

        let diff_a = getProperDiff(`${a.date}T${a.time}:00`)
        let diff_b = getProperDiff(`${b.date}T${b.time}:00`)

        return (diff_a > diff_b) ? -1 : 1
    })

    putThemUp(cards)
})

let urgMap = {

    Critical: 3,
    Normal: 2,
    Low: 1
}

$('.urgSort .inc').click(function () {

    let cards = globalCardData

    cards.sort(function (a, b) {

        return urgMap[a.urg] < urgMap[b.urg] ? -1 : 1
    })

    putThemUp(cards)
})

$('.urgSort .dec').click(function () {

    let cards = globalCardData

    cards.sort(function (a, b) {

        return urgMap[a.urg] > urgMap[b.urg] ? -1 : 1
    })

    putThemUp(cards)
})


$(window).resize(function () {

    if ($(window).width() > 1600){

        $('.teal.buttons').hide()
        $('#sidMen').show()
        $('.sorting.menu').show()
    }
})