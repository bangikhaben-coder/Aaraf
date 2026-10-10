import { WorldClockCity } from '../types';

export const POPULAR_CITIES: WorldClockCity[] = [
  { id: 'london', city: 'London', country: 'United Kingdom', timeZone: 'Europe/London' },
  { id: 'new_york', city: 'New York', country: 'United States', timeZone: 'America/New_York' },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo' },
  { id: 'san_francisco', city: 'San Francisco', country: 'United States', timeZone: 'America/Los_Angeles' },
  { id: 'paris', city: 'Paris', country: 'France', timeZone: 'Europe/Paris' },
  { id: 'sydney', city: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney' },
  { id: 'singapore', city: 'Singapore', country: 'Singapore', timeZone: 'Asia/Singapore' },
  { id: 'dubai', city: 'Dubai', country: 'United Arab Emirates', timeZone: 'Asia/Dubai' },
  { id: 'berlin', city: 'Berlin', country: 'Germany', timeZone: 'Europe/Berlin' },
  { id: 'hong_kong', city: 'Hong Kong', country: 'China', timeZone: 'Asia/Hong_Kong' },
  { id: 'toronto', city: 'Toronto', country: 'Canada', timeZone: 'America/Toronto' },
  { id: 'sao_paulo', city: 'São Paulo', country: 'Brazil', timeZone: 'America/Sao_Paulo' },
  { id: 'mumbai', city: 'Mumbai', country: 'India', timeZone: 'Asia/Kolkata' },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', timeZone: 'Asia/Seoul' },
  { id: 'cairo', city: 'Cairo', country: 'Egypt', timeZone: 'Africa/Cairo' },
  { id: 'auckland', city: 'Auckland', country: 'New Zealand', timeZone: 'Pacific/Auckland' },
  { id: 'zurich', city: 'Zurich', country: 'Switzerland', timeZone: 'Europe/Zurich' },
  { id: 'bangkok', city: 'Bangkok', country: 'Thailand', timeZone: 'Asia/Bangkok' },
  { id: 'amsterdam', city: 'Amsterdam', country: 'Netherlands', timeZone: 'Europe/Amsterdam' },
  { id: 'buenos_aires', city: 'Buenos Aires', country: 'Argentina', timeZone: 'America/Argentina/Buenos_Aires' },
  { id: 'reykjavik', city: 'Reykjavik', country: 'Iceland', timeZone: 'Atlantic/Reykjavik' },
];

export function getTimeInZone(timeZone: string, now: Date = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });

    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';

    const hour = getPart('hour');
    const minute = getPart('minute');
    const second = getPart('second');
    const weekday = getPart('weekday');
    const month = getPart('month');
    const day = getPart('day');

    // Compute relative hour difference from local time
    const localHour = now.getHours();
    const targetHourNum = parseInt(hour, 10);
    let diff = targetHourNum - localHour;
    if (diff > 12) diff -= 24;
    if (diff < -12) diff += 24;

    const hourNum = parseInt(hour, 10);
    const isDay = hourNum >= 6 && hourNum < 18;

    return {
      formattedTime: `${hour}:${minute}:${second}`,
      hour,
      minute,
      second,
      weekday,
      dateString: `${weekday}, ${month} ${day}`,
      diffString: diff === 0 ? 'Same time' : diff > 0 ? `+${diff}h` : `${diff}h`,
      isDay,
    };
  } catch {
    return {
      formattedTime: '--:--:--',
      hour: '00',
      minute: '00',
      second: '00',
      weekday: '',
      dateString: '',
      diffString: '',
      isDay: true,
    };
  }
}
