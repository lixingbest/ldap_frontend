function isJSON(str) {
    try {
        if (typeof JSON.parse(str) == 'object') {
            return true
        }
    } catch (e) {
        return false
    }
}

function getFormatDate(str) {
    console.log(str)
    if (null != str && str !== '' && str !== 0) {
        let date
        try {
             date = new Date(str);
        } catch (e) {
            return ''
        }
        let year = date.getFullYear();
        let mouth = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
        let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
        let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
        let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds();
        return year + '-' + mouth + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    } else {
        return '';
    }
}

export default {
    isJSON,
    getFormatDate
}