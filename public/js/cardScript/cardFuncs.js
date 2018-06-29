function getProperTitle(title){

    let tempTitle = title.split(' ')

    let newArr = []

    for (let i in tempTitle) {

        let newTitle = tempTitle[i][0].toUpperCase()

        for (let j = 1; j < tempTitle[i].length; j++)
            newTitle += tempTitle[i][j].toLowerCase()

        newArr.push(newTitle)
    }

    return newArr.join(' ')
}

function getProperDate(date){

    let dateForm = date

    let yr = dateForm[0] + dateForm[1] + dateForm[2] + dateForm[3]
    let mn = dateForm[5] + dateForm[6]
    let dy = dateForm[8] + dateForm[9]

    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    mn = months[parseInt(mn) - 1]

    dateForm = "" + dy + " " + mn + " " + yr
    return dateForm
}

function getProperTime(time){

    let timeForm = time
    let timeAMPM = 'AM'
    let timeHr = parseInt(timeForm[0] + timeForm[1])
    let timeMin = timeForm[3] + timeForm[4]

    if (timeHr > 12) {

        timeHr -= 12
        timeAMPM = 'PM'
    }

    timeHr = parseInt(timeHr) > 10 ? timeHr.toString() : '0' + timeHr

    timeForm = "" + timeHr + ":" + timeMin

    return `${timeForm} ${timeAMPM}`
}

function getProperDiff(timeNow){

    return (new Date(timeNow) - new Date()) / 1000
}