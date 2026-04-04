import { Station } from '../types';

export const line8aStations: Station[] = [
  { id: '8A-01', lineId: '8A', order: 1, nameRu: 'Деловой центр', nameEn: 'Delovoy Tsentr', transfers: ['11'], timeToNext: 150 },
  { id: '8A-02', lineId: '8A', order: 2, nameRu: 'Парк Победы', nameEn: 'Park Pobedy', transfers: ['3'], timeToNext: 180 },
  { id: '8A-03', lineId: '8A', order: 3, nameRu: 'Минская', nameEn: 'Minskaya', transfers: [], timeToNext: 120 },
  { id: '8A-04', lineId: '8A', order: 4, nameRu: 'Ломоносовский проспект', nameEn: 'Lomonosovsky Prospekt', transfers: [], timeToNext: 120 },
  { id: '8A-05', lineId: '8A', order: 5, nameRu: 'Раменки', nameEn: 'Ramenki', transfers: [], timeToNext: 150 },
  { id: '8A-06', lineId: '8A', order: 6, nameRu: 'Мичуринский проспект', nameEn: 'Michurinsky Prospekt', transfers: ['11'], timeToNext: 150 },
  { id: '8A-07', lineId: '8A', order: 7, nameRu: 'Озёрная', nameEn: 'Ozyornaya', transfers: [], timeToNext: 120 },
  { id: '8A-08', lineId: '8A', order: 8, nameRu: 'Говорово', nameEn: 'Govorovo', transfers: [], timeToNext: 150 },
  { id: '8A-09', lineId: '8A', order: 9, nameRu: 'Солнцево', nameEn: 'Solntsevo', transfers: [], timeToNext: 150 },
  { id: '8A-10', lineId: '8A', order: 10, nameRu: 'Боровское шоссе', nameEn: 'Borovskoe Shosse', transfers: [], timeToNext: 150 },
  { id: '8A-11', lineId: '8A', order: 11, nameRu: 'Пыхтино', nameEn: 'Pykhtino', transfers: [], timeToNext: 0 },
];
