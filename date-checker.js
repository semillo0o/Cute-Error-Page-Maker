// 📅 date-checker.js - 기념일 확인
import { getTodayKey } from './utils.js';
import { lunarHolidays } from './lunarDates.js';

// 🎀 양력 기념일 템플릿 맵
const solarSpecialDates = {
    '01-01': 'new_years_day.html',
    '02-14': 'valentines_day.html',
    '03-14': 'white_day.html',
    '04-14': 'black_day.html',
    '05-05': 'children_day.html',
    '06-14': 'rose_day.html',
    '07-07': 'silver_day.html',
    '08-08': 'green_day.html',
    '10-31': 'halloween.html',
    '11-11': 'pepero_day.html',
    '12-25': 'christmas.html',
};

// 🎊 종합 기념일 확인 함수 (양력 + 음력 기반 기념일 확인)
export function getSpecialTemplateIfAny() {
    const today = new Date();
    const key = getTodayKey(); // 'MM-DD' 형식 (ex: '02-14')
    const yyyyMMdd = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const year = today.getFullYear().toString();

    // 1️⃣ 양력 기념일 먼저 확인
    if (solarSpecialDates[key]) {
        return solarSpecialDates[key];
    }

    // 2️⃣ 음력 기반 기념일 확인
    const lunarMap = lunarHolidays[year];
    if (!lunarMap) return null;

    if (yyyyMMdd === lunarMap.seollal) return "seollal.html";
    if (yyyyMMdd === lunarMap.chuseok) return "chuseok.html";

    // 🎁 여기에 더 많은 음력 기념일을 추가할 수 있음!

    return null;
}
