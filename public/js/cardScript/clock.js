function getTimeGoing(id, timeDiff, item) {

//circle start
    let progressBar = [$("#" + id + " .days .e-c-progress"), $("#" + id + " .hrs .e-c-progress"), $("#" + id + " .mins .e-c-progress")] //, document.querySelector('.secs .e-c-progress')]
    let pointer = [$("#" + id + " .days .e-pointer"), $("#" + id + " .hrs .e-pointer"), $("#" + id + " .mins .e-pointer")] //, document.querySelector('.secs .e-pointer)]
    let length = Math.PI * 2 * 100;

    progressBar.forEach(item => item.css('strokeDasharray', length))

//circle ends
    const displayOutput = [$("#" + id + " .days .display-remain-time"), $("#" + id + " .hrs .display-remain-time"), $("#" + id + " .mins .display-remain-time")] //, document.querySelector('.secs .display-remain-time')]

    let intervalTimer;
    let timeLeft;

    function monthDiff() {

        let dateString = `${item.date}T${item.time}:00`
        let dateNow = new Date(dateString)
        let month = ((dateNow.getMonth() + 1) % 12) + 1

        if (month === 1)
            dateNow.setFullYear(dateNow.getFullYear() + 1)

        month = month < 10 ? `0${month}` : month.toString()
        dateNow.setMonth(month - 1)
        item.date = (dateNow.toLocaleDateString()).split('/').reverse().join('-')

        remainTime = dateNow
    }

    function otherDiff(rep) {

        let dateString = `${item.date}T${item.time}:00`
        let dateNow = new Date(dateString)

        if (rep === 12)
            dateNow.setFullYear(dateNow.getFullYear() + 1)

        else if (rep === 7)
            dateNow = new Date(Date.now() + 604799000)

        else
            dateNow = new Date(Date.now() + 86399000)

        remainTime = dateNow
        item.date = (dateNow.toLocaleDateString()).split('/').reverse().join('-')
    }

    function cycleIt() {

        if (item.freq === 'once')
            return 0

        else if (item.freq === 'daily')
            otherDiff(1)

        else if (item.freq === 'weekly')
            otherDiff(7)

        else if (item.freq === 'monthly')
            monthDiff()

        else
            otherDiff(12)

        let URL = '/card/uptCard/'

        $.ajax({
            url: URL,
            type: 'put',
            data: item,
            success: function (data, status, someShit) {

                pasteCards()
            }
        })

        return 1
    }

    let remainTime = 0

    function timer(seconds) { //counts time, takes seconds
        remainTime = Date.now() + (seconds * 1000)
        displayTimeLeft(seconds)

        intervalTimer = setInterval(function () {
            timeLeft = Math.round((remainTime - Date.now()) / 1000);

            if (timeLeft < 0)
                if (!cycleIt()) {

                    clearInterval(intervalTimer)
                    displayTimeLeft(0)
                    pasteCards()
                    return
                }

            else if (timeLeft === 604799)
                pasteCards()

            displayTimeLeft(timeLeft);
        }, 1000);
    }

    function displayTimeLeft(timeLeft) { //displays time on the input
        let days = Math.floor(timeLeft / (24 * 60 * 60))
        let hrs = (Math.floor(timeLeft / (60 * 60))) % 24
        let mins = (Math.floor(timeLeft / 60)) % (60)
        let secs = timeLeft % 60
        let displaySecs = `${secs < 10 ? '0' : ''}${secs}`
        let displayMins = `${mins < 10 ? '0' : ''}${mins}`
        let displayHrs = `${hrs < 10 ? '0' : ''}${hrs}`
        let displayDays = `${days < 10 ? '0' : ''}${days}`
        let displayData = [displayDays, displayHrs, displayMins]
        displayOutput.map((dO, i) => dO.text(displayData[i]))
        update(days, 7, 0);
        update(hrs, 24, 1);
        update(mins, 60, 2);
        //update(secs, 60, 4);
    }

    function update(value, timePercent, timeSel) {
        var offset = -length - length * value / (timePercent)
        progressBar[timeSel].css('strokeDashoffset', offset)
        pointer[timeSel].css('transform', `rotate(${360 * value / (timePercent)}deg)`)
    };

    if (timeDiff > 0 || item.freq !== 'once')
        timer(timeDiff)
}

