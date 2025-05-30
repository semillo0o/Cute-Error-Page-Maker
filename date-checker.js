// 📅 date-checker.js - 기념일 확인
import { getTodayKey } from './utils.js';

const specialDates = {
    '12-25': 'christmas.html',
    '1-1': 'new_years_day.html',
    '2-14': 'valentines_day.html',
    '10-31': 'halloween.html',
    '11-11': 'pepero_day.html',
    '3-14': 'white_day.html',
    '4-14': 'black_day.html',
    '5-5': 'children_day.html',
    '6-14': 'rose_day.html',
    '7-7': 'silver_day.html',
    '8-8': 'green_day.html',
    '9-9': 'chuseok.html',
};

export function getSpecialTemplateIfAny() {
    const key = getTodayKey();
    return specialDates[key] || null;
}
