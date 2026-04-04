import { Station } from '../types';

export const line8Stations: Station[] = [
  { id: '8-01', lineId: '8', order: 1, nameRu: 'Третьяковская', nameEn: 'Tretyakovskaya', transfers: ['6', '2'], timeToNext: 120 },
  { id: '8-02', lineId: '8', order: 2, nameRu: 'Марксистская', nameEn: 'Marksistskaya', transfers: ['5', '7'], timeToNext: 120 },
  { id: '8-03', lineId: '8', order: 3, nameRu: 'Площадь Ильича', nameEn: 'Ploshchad Ilicha', transfers: ['10'], timeToNext: 120 },
  { id: '8-04', lineId: '8', order: 4, nameRu: 'Авиамоторная', nameEn: 'Aviamotornaya', transfers: ['11'], timeToNext: 120 },
  { id: '8-05', lineId: '8', order: 5, nameRu: 'Шоссе Энтузиастов', nameEn: 'Shosse Entuziastov', transfers: ['11'], timeToNext: 150 },
  { id: '8-06', lineId: '8', order: 6, nameRu: 'Перово', nameEn: 'Perovo', transfers: [], timeToNext: 120 },
  { id: '8-07', lineId: '8', order: 7, nameRu: 'Новогиреево', nameEn: 'Novogireyevo', transfers: [], timeToNext: 120 },
  { id: '8-08', lineId: '8', order: 8, nameRu: 'Новокосино', nameEn: 'Novokosino', transfers: [], timeToNext: 0 },
];
