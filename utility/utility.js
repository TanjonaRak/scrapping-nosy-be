
const { env } = require('process');
const axios = require('axios');


module.exports = {
    async getTimeMadagascar() {
        let time = null;
        if (env.getTimeFromAPI == 'true') {
            await axios({
                method: 'GET',
                url: 'http://worldtimeapi.org/api/timezone/Africa/Nairobi',
                withCredentials: true,
                data: {},
            })
                .then((response) => {
                    time = response.data.datetime;
                })
                .catch((err) => console.log(err));
        } else {
            const date = new Date();
            date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
            time = date;
        }

        return time;
    }
}
