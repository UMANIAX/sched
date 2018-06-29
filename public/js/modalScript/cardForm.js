
$('.ui.search.dropdown')
    .dropdown({
        fullTextSearch: true
    });

$('#freq.grouped.fields input').on('click', function () {

    $('#freq.grouped.fields input').removeAttr('checked')
    $(this).attr('checked', 'checked')
})

$('#urg.grouped.fields input').on('click', function () {

    $('#urg.grouped.fields input').removeAttr('checked')
    $(this).attr('checked', 'checked')
})

let typeArr = {
    'off-meet': "<i class='briefcase icon'></i>Office Meeting",
    'doc-meet': "<i class='hospital icon'></i>Doctor Appointment",
    'meet-up': "<i class='coffee icon'></i>Meet Up",
    'birthday': "<i class='birthday cake icon'></i>Birth Day",
    'anniversary': "<i class='heart icon'></i>Anniversary",
    'movie': "<i class='film icon'></i>Movie",
    'other': "<i class='hospital icon'></i>Other"
}

for (let i in typeArr)
    $('.typeField .menu').append(`<div class="item" data-value=${i}>${typeArr[i]}</div>`)
