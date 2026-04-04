import { Station } from '../types';

export const line5Stations: Station[] = [
  { id: '5-01', lineId: '5', order: 1, nameRu: 'Комсомольская', nameEn: 'Komsomolskaya', transfers: ['1'], timeToNext: 120 },
  { id: '5-02', lineId: '5', order: 2, nameRu: 'Курская', nameEn: 'Kurskaya', transfers: ['3', '14'], timeToNext: 120 },
  { id: '5-03', lineId: '5', order: 3, nameRu: 'Таганская', nameEn: 'Taganskaya', transfers: ['7', '8'], timeToNext: 120 },
  { id: '5-04', lineId: '5', order: 4, nameRu: 'Павелецкая', nameEn: 'Paveletskaya', transfers: ['2'], timeToNext: 120 },
  { id: '5-05', lineId: '5', order: 5, nameRu: 'Добрынинская', nameEn: 'Dobryninskaya', transfers: ['9'], timeToNext: 120 },
  { id: '5-06', lineId: '5', order: 6, nameRu: 'Октябрьская', nameEn: 'Oktyabrskaya', transfers: ['6'], timeToNext: 120 },
  { id: '5-07', lineId: '5', order: 7, nameRu: 'Парк культуры', nameEn: 'Park Kultury', transfers: ['1'], timeToNext: 120 },
  { id: '5-08', lineId: '5', order: 8, nameRu: 'Киевская', nameEn: 'Kievskaya', transfers: ['3', '4'], timeToNext: 120 },
  { id: '5-09', lineId: '5', order: 9, nameRu: 'Краснопресненская', nameEn: 'Krasnopresnenskaya', transfers: ['7'], timeToNext: 120 },
  { id: '5-10', lineId: '5', order: 10, nameRu: 'Белорусская', nameEn: 'Belorusskaya', transfers: ['2'], timeToNext: 120 },
  { id: '5-11', lineId: '5', order: 11, nameRu: 'Новослободская', nameEn: 'Novoslobodskaya', transfers: ['9'], timeToNext: 120 },
  { id: '5-12', lineId: '5', order: 12, nameRu: 'Проспект Мира', nameEn: 'Prospekt Mira', transfers: ['6'], timeToNext: 0 },
];
