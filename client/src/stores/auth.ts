import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  LoginResponse,
  RegisterResponse,
  UserResponse,
  type User,
} from "../models/auth.model";
import { httpClient } from "../adapters/httpClient";
import { socketClient } from "../adapters/socketClient";
import { useNotificationStore } from "./notifications";

export const useAuthStore = defineStore("auth", () => {
  const notifications = useNotificationStore();
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(null);
  const isAuthenticated = ref(!!token.value);
  const router = useRouter();

  socketClient.reconnect(token.value!);
  watch(token, () => {
    socketClient.reconnect(token.value!);
  });

  // Регистрация пользователя
  async function register(username: string, password: string) {
    try {
      const data = await httpClient.post<RegisterResponse>("/register", {
        username,
        password,
      });
      token.value = data.token;
      user.value = data.user;
      isAuthenticated.value = true;
      localStorage.setItem("token", token.value);
      router.push({ name: "start" });
    } catch (error) {
      notifications.openNotification({
        title: "Registration error",
        text: error?.response?.data?.error || error?.message,
        type: "error",
      });
      throw error;
    }
  }

  // Авторизация пользователя
  async function login(username: string, password: string) {
    try {
      const data = await httpClient.post<LoginResponse>("/login", {
        username,
        password,
      });
      token.value = data.token;
      user.value = data.user;
      isAuthenticated.value = true;
      localStorage.setItem("token", token.value);
      if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        router.push({ name: "start" });
      }
    } catch (error) {
      notifications.openNotification({
        title: "Login error",
        text: error?.response?.data?.error || error?.message,
        type: "error",
      });
      throw error;
    }
  }

  async function getUser() {
    if (!isAuthenticated.value) return;
    try {
      const data = await httpClient.get<UserResponse>("/user");
      user.value = data.user;
      isAuthenticated.value = true;
    } catch (error) {
      isAuthenticated.value = false;
      token.value = null;
      localStorage.removeItem("token");
      console.error(error);
      notifications.openNotification({
        title: "Error",
        text: error?.response?.data?.error || error?.message,
        type: "error",
      });
      throw error;
    }
  }

  // Выход пользователя
  function logout() {
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("token");
    router.push({ name: "auth" });
  }

  getUser();

  return {
    token,
    user,
    isAuthenticated,
    getUser,
    register,
    login,
    logout,
  };
});
