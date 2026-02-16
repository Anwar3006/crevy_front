import type { TUserRegistrationInput } from "@/types/user.types";
import { axiosClient } from "../axiosClient";

export const UserService = {
  registerUser: async (data: TUserRegistrationInput) => {
    try {
      const response = await axiosClient.post("/auth/register", data);
      return response.data;
    } catch (error) {
      console.error("Error registering user: ", error);
      throw error;
    }
  },

  updateUserProfile: async (data: Partial<TUserRegistrationInput>) => {
    try {
      const response = await axiosClient.put("/users", data);
      return response.data;
    } catch (error) {
      console.error("Error updating user profile: ", error);
      throw error;
    }
  },

  getUserProfile: async (userId: string) => {
    try {
      const response = await axiosClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting user profile: ", error);
      throw error;
    }
  },

  // deleteUserProfile: async (userId: string) => {
  deleteUserProfile: async (userId: string) => {
    try {
      const response = await axiosClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user profile: ", error);
      throw error;
    }
  },
};
