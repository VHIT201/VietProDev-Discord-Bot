const axios = require('axios');

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

/**
 * Lấy thông tin thời tiết theo tên thành phố
 * @param {string} city - Tên thành phố
 * @returns {Promise<Object>} - Thông tin thời tiết
 */
async function getWeather(city) {
    if (!city || city.trim().length === 0) {
        throw new Error('Vui lòng nhập tên thành phố');
    }

    try {
        // Bước 1: Tìm tọa độ thành phố
        const geoResponse = await axios.get(GEO_API, {
            params: { name: city.trim(), count: 1, language: 'vi' },
            timeout: 10000
        });

        const results = geoResponse.data.results;
        if (!results || results.length === 0) {
            throw new Error(`Không tìm thấy thành phố "${city}"`);
        }

        const location = results[0];
        const { latitude, longitude, name, country } = location;

        // Bước 2: Lấy thời tiết
        const weatherResponse = await axios.get(WEATHER_API, {
            params: {
                latitude,
                longitude,
                current_weather: true,
                hourly: 'relativehumidity_2m,apparent_temperature',
                daily: 'temperature_2m_max,temperature_2m_min',
                timezone: 'auto'
            },
            timeout: 10000
        });

        const current = weatherResponse.data.current_weather;
        const daily = weatherResponse.data.daily;

        return {
            city: name,
            country: country || '',
            temperature: Math.round(current.temperature),
            windspeed: current.windspeed,
            weathercode: current.weathercode,
            maxTemp: Math.round(daily.temperature_2m_max[0]),
            minTemp: Math.round(daily.temperature_2m_min[0])
        };
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Kết nối quá chậm, vui lòng thử lại');
        }
        throw error;
    }
}

/**
 * Chuyển mã thời tiết thành mô tả tiếng Việt
 * @param {number} code - Mã thời tiết WMO
 */
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Trời quang đãng',
        1: 'Trời nhiều mây',
        2: 'Mây rải rác',
        3: 'Nhiều mây',
        45: 'Sương mù',
        48: 'Sương mù đóng băng',
        51: 'Mưa phùn nhẹ',
        53: 'Mưa phùn vừa',
        55: 'Mưa phùn nặng',
        61: 'Mưa nhẹ',
        63: 'Mưa vừa',
        65: 'Mưa to',
        71: 'Tuyết nhẹ',
        73: 'Tuyết vừa',
        75: 'Tuyết nặng',
        80: 'Mưa rào nhẹ',
        81: 'Mưa rào vừa',
        82: 'Mưa rào nặng',
        95: 'Giông bão',
        96: 'Giông có mưa đá',
        99: 'Giông bão nặng'
    };
    return descriptions[code] || 'Không xác định';
}

module.exports = {
    getWeather,
    getWeatherDescription
};
