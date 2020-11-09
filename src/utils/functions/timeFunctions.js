import moment from 'moment';
import 'moment-timezone';

export const getHoursAndMinutes = (unixTime) => {
    let hoursAndMinutes = moment(unixTime *1000).tz('Europe/Madrid').format("HH:mm");  
    return `${hoursAndMinutes} CET`
}