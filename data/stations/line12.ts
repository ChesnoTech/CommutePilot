import { Station } from '../types';

export const line12Stations: Station[] = [
  { id: '12-01', lineId: '12', order: 1, nameRu: 'Битцевский парк', nameEn: 'Bittsevsky Park', transfers: ['6'], timeToNext: 150 },
  { id: '12-02', lineId: '12', order: 2, nameRu: 'Лесопарковая', nameEn: 'Lesoparkovaya', transfers: [], timeToNext: 120 },
  { id: '12-03', lineId: '12', order: 3, nameRu: 'Улица Старокачаловская', nameEn: 'Ulitsa Starokachalovskaya', transfers: [], timeToNext: 150 },
  { id: '12-04', lineId: '12', order: 4, nameRu: 'Бульвар Адмирала Ушакова', nameEn: 'Bulvar Admirala Ushakova', transfers: [], timeToNext: 120 },
  { id: '12-05', lineId: '12', order: 5, nameRu: 'Улица Скобелевская', nameEn: 'Ulitsa Skobelevskaya', transfers: [], timeToNext: 120 },
  { id: '12-06', lineId: '12', order: 6, nameRu: 'Бульвар Дмитрия Донского', nameEn: 'Bulvar Dmitriya Donskogo', transfers: ['9'], timeToNext: 150 },
  { id: '12-07', lineId: '12', order: 7, nameRu: 'Улица Горчакова', nameEn: 'Ulitsa Gorchakova', transfers: [], timeToNext: 0 },
];
