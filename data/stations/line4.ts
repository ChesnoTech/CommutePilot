import { Station } from '../types';

export const line4Stations: Station[] = [
  { id: '4-01', lineId: '4', order: 1, nameRu: 'Кунцевская', nameEn: 'Kuntsevskaya', transfers: ['3'], timeToNext: 120 },
  { id: '4-02', lineId: '4', order: 2, nameRu: 'Пионерская', nameEn: 'Pionerskaya', transfers: [], timeToNext: 120 },
  { id: '4-03', lineId: '4', order: 3, nameRu: 'Филёвский парк', nameEn: 'Filyovsky Park', transfers: [], timeToNext: 90 },
  { id: '4-04', lineId: '4', order: 4, nameRu: 'Багратионовская', nameEn: 'Bagrationovskaya', transfers: [], timeToNext: 120 },
  { id: '4-05', lineId: '4', order: 5, nameRu: 'Фили', nameEn: 'Fili', transfers: [], timeToNext: 90 },
  { id: '4-06', lineId: '4', order: 6, nameRu: 'Кутузовская', nameEn: 'Kutuzovskaya', transfers: ['14'], timeToNext: 120 },
  { id: '4-07', lineId: '4', order: 7, nameRu: 'Студенческая', nameEn: 'Studencheskaya', transfers: [], timeToNext: 120 },
  { id: '4-08', lineId: '4', order: 8, nameRu: 'Киевская', nameEn: 'Kievskaya', transfers: ['3', '5'], timeToNext: 120 },
  { id: '4-09', lineId: '4', order: 9, nameRu: 'Смоленская', nameEn: 'Smolenskaya', transfers: [], timeToNext: 120 },
  { id: '4-10', lineId: '4', order: 10, nameRu: 'Арбатская', nameEn: 'Arbatskaya', transfers: ['3'], timeToNext: 90 },
  { id: '4-11', lineId: '4', order: 11, nameRu: 'Александровский сад', nameEn: 'Aleksandrovsky Sad', transfers: ['1', '3', '9'], timeToNext: 180 },
  { id: '4-12', lineId: '4', order: 12, nameRu: 'Выставочная', nameEn: 'Vystavochnaya', transfers: ['14'], timeToNext: 120 },
  { id: '4-13', lineId: '4', order: 13, nameRu: 'Международная', nameEn: 'Mezhdunarodnaya', transfers: ['11'], timeToNext: 0 },
];
