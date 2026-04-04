export interface MetroLine {
  id: string;
  number: string;
  nameRu: string;
  nameEn: string;
  color: string;
  stations: Station[];
}

export interface Station {
  id: string;
  lineId: string;
  order: number;
  nameRu: string;
  nameEn: string;
  transfers: string[];
  timeToNext: number;
}

export interface JourneyTemplate {
  id: string;
  name: string;
  lineId: string;
  departureStationId: string;
  destinationStationId: string;
  createdAt: number;
}
