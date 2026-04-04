import { Station } from '../types';

export const line15Stations: Station[] = [
  { id: '15-01', lineId: '15', order: 1, nameRu: 'Нижегородская', nameEn: 'Nizhegorodskaya', transfers: ['11', '14'], timeToNext: 120 },
  { id: '15-02', lineId: '15', order: 2, nameRu: 'Стахановская', nameEn: 'Stakhanovskaya', transfers: [], timeToNext: 120 },
  { id: '15-03', lineId: '15', order: 3, nameRu: 'Окская', nameEn: 'Okskaya', transfers: [], timeToNext: 120 },
  { id: '15-04', lineId: '15', order: 4, nameRu: 'Юго-Восточная', nameEn: 'Yugo-Vostochnaya', transfers: [], timeToNext: 120 },
  { id: '15-05', lineId: '15', order: 5, nameRu: 'Косино', nameEn: 'Kosino', transfers: [], timeToNext: 120 },
  { id: '15-06', lineId: '15', order: 6, nameRu: 'Улица Дмитриевского', nameEn: 'Ulitsa Dmitrievskogo', transfers: [], timeToNext: 120 },
  { id: '15-07', lineId: '15', order: 7, nameRu: 'Лухмановская', nameEn: 'Lukhmanovskaya', transfers: [], timeToNext: 120 },
  { id: '15-08', lineId: '15', order: 8, nameRu: 'Некрасовка', nameEn: 'Nekrasovka', transfers: [], timeToNext: 0 },
];
