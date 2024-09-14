import { defineStore } from "pinia";
import { ref } from "vue";
import { httpClient } from "../adapters/httpClient";
import { UserListResponse, User } from "../models/user.model";

export const useUsers = defineStore("users", () => {
  const users = ref<User[]>([]);

  async function getUsers() {
    try {
      const response = await httpClient.get<UserListResponse>("/adm/users");
      users.value = response;
    } catch (error) {
      console.log(error);
    }
  }

  async function pathcUserPremium(id: number, isPremium: boolean) {
    try {
      await httpClient.patch(`/adm/users/premium/${id}`, { isPremium });
      const user = users.value.find((user) => user.id === id);
      if (user) {
        user.isPremium = isPremium;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function patchUserRole(id: number, role: "user" | "admin") {
    try {
      await httpClient.patch(`/adm/users/role/${id}`, { role });
      const user = users.value.find((user) => user.id === id);
      if (user) {
        user.role = role;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function deleteUser(id: number) {
    try {
      await httpClient.delete(`/adm/users/${id}`);
      users.value = users.value.filter((user) => user.id !== id);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    users,
    getUsers,
    pathcUserPremium,
    patchUserRole,
    deleteUser,
  };
});
