import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // адрес готового API (отредактируйте при необходимости)

export interface Ad {
  id: number;
  name: string;
  description: string;
  location: string;
  category: 'Недвижимость' | 'Авто' | 'Услуги';
  photo?: string;

  propertyType?: string;
  area?: number;
  rooms?: number;
  price?: number;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  serviceType?: string;
  experience?: number;
  cost?: number;
  schedule?: string;
  [key: string]: any;
}

export interface GetAdsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const fetchAds = async (params: GetAdsParams): Promise<{ data: Ad[]; total: number }> => {
  const response = await axios.get(`${API_BASE_URL}/items`, { params });
  return response.data;
};

export const fetchAdById = async (id: number): Promise<Ad> => {
  const response = await axios.get(`${API_BASE_URL}/items/${id}`);
  return response.data;
};

export const createAd = async (ad: Partial<Ad>): Promise<Ad> => {
  const response = await axios.post(`${API_BASE_URL}/items`, ad);
  return response.data;
};

export const updateAd = async (id: number, ad: Partial<Ad>): Promise<Ad> => {
  const response = await axios.put(`${API_BASE_URL}/items:id/${id}`, ad);
  return response.data;
};
