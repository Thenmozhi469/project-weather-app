require('dotenv').config();
const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'invalid';
const BASE_URL = 'https://api.weatherapi.com/v1';

const geocode = async (query) => {
  try {
    const url = `${BASE_URL}/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    if (!data || data.length === 0) throw new Error('No results found');
    return data.map(place => ({
      id:      place.id,
      name:    place.name,
      region:  place.region,
      country: place.country,
      lat:     place.lat,
      lon:     place.lon,
      url:     place.url,
    }));
  } catch (error) {
    console.error('Geocode error:', error.response?.data || error.message);
    throw new Error('Unable to search location');
  }
};

const reverseGeocode = async (latitude, longitude) => {
  try {
    const url = `${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`;
    const { data } = await axios.get(url);
    return {
      name:        data.location.name,
      region:      data.location.region,
      country:     data.location.country,
      lat:         data.location.lat,
      lon:         data.location.lon,
      timezone_id: data.location.tz_id,
      localtime:   data.location.localtime,
    };
  } catch (error) {
    console.error('Reverse geocode error:', error.response?.data || error.message);
    throw new Error('Unable to reverse geocode');
  }
};

module.exports = { geocode, reverseGeocode };
