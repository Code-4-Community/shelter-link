// based off of https://bobbyhadz.com/blog/typescript-date-format
function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
}

export function formatDate(eventDate: string) {
    const date = new Date(eventDate);
    let monthMap = new Map<number, string>([
        [1, "January"],
        [2, "February"],
        [3, "March"],
        [4, "April"],
        [5, "May"],
        [6, "June"],
        [7, "July"],
        [8, "August"],
        [9, "September"],
        [10, "October"],
        [10, "November"],
        [10, "December"],
    ]);
    return (
        `${monthMap.get(date.getMonth() + 1)} ${date.getDate()}, ${date.getFullYear()}`
    );
}

export function formatTime(eventDate: string) {
    const date = new Date(eventDate);
    let hours = date.getHours();
    if (hours == 0) {
        return [
            12,
            padTo2Digits(date.getMinutes())
        ].join(':') + ' AM';
    } else if (hours == 12) {
        return [
            12,
            padTo2Digits(date.getMinutes())
        ].join(':') + ' PM';
    } else {
        return [
            date.getHours() % 12,
            padTo2Digits(date.getMinutes()),
        ].join(':') + ((date.getHours() - 12 > 0) ? ' PM' : ' AM')
    }
}

export function formatDateTime(eventDate: string) {
    return formatDate(eventDate) + ' at ' + formatTime(eventDate);
}