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

  return {
    users,
    getUsers,
  };
});
