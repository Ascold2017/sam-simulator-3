import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/auth';

// Интерфейс для ответа сервера

// HttpClient класс
class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавляем интерсептор для добавления токена
    this.instance.interceptors.request.use((req) => this.handleRequest(req));

    // Добавляем интерсептор для обработки ошибок
    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleError
    );
  }

  // Интерсептор для добавления токена в заголовки
  private handleRequest(config: InternalAxiosRequestConfig) {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `${authStore.token}`;
    }
  
    return config;
  }

  // Обработка успешного ответа
  private handleResponse(response: AxiosResponse) {
    return response;
  }

  // Обработка ошибок
  private handleError(error: any) {
    // Здесь можно добавить логику для обработки различных ошибок (например, 401, 500 и т.д.)
    if (error.response && error.response.status === 401) {
      // Например, редирект на страницу логина или удаление токена
      const authStore = useAuthStore();
      authStore.logout(); // Выход пользователя
    }

    return Promise.reject(error);
  }

  // Метод для GET-запросов
  public async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.instance.get<T>(url, { params });
    return response.data;
  }

  // Метод для POST-запросов
  public async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.post<T>(url, data);
    return response.data;
  }

  // Метод для PUT-запросов
  public async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.put<T>(url, data);
    return response.data;
  }

  // Метод для DELETE-запросов
  public async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete<T>(url);
    return response.data;
  }
}

export const httpClient = new HttpClient(import.meta.env.VITE_APP_API_URL!); // Задаем базовый URL
