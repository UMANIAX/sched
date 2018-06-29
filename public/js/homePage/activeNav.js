$('#actNav .item').on('click', function () {

    $('#actNav .item').removeClass('active')
    $(this).addClass('active')

    let opt = $(this).data('option')
    let gotoDiv = $(this)

    $('#cardContent .stackable.grid').each(function () {

        if ($(this).data('catop') === opt)
            gotoDiv = $(this)
    })

    let pos = gotoDiv.offset()

    $('html, body').animate({

        scrollTop: pos.top - 130
    }, 1000)
})

$(window).scroll(function () {

    let winScroll = $(window).scrollTop()

    let num = 0

    $('#cardContent .grid').each(function () {

        if (winScroll >= $(this).offset().top - 130)
            num = $(this).data('catop')
    })

    $('#actNav .item').removeClass('active')

    $('#actNav .item').each(function () {

        if ($(this).data('option') === num)
            $(this).addClass('active')
    })

})

$('#actNav').sticky({context: 'body'})

$('.dropdown.icon.button').dropdown({transition: 'drop'})

$(window).resize(function () {

    if ($(window).width() < 1600){

        $('.teal.buttons').show()
        $('#sidMen').hide()
        $('.sorting.menu').hide()
    }
})

