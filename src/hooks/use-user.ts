import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserService } from "@/lib/services/user-service";
import type { TUserRegistrationInput } from "@/types/user.types";

export const useGetUserProfile = (userId: string) => {
  return useQuery<any, Error, any>({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      const response = await UserService.getUserProfile(userId);
      return response;
    },
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: async (data: any) => {
      const response = await UserService.registerUser(data);
      return response;
    },
    onSuccess: () => {
      toast.success("User registered successfully");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      console.error("Error registering user: ", error);
      toast.error("Failed to register user");
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<TUserRegistrationInput, Error, any>({
    mutationFn: async (data: Partial<TUserRegistrationInput>) => {
      const response = await UserService.updateUserProfile(data);
      return response;
    },
    onSuccess: () => {
      toast.success("User profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      console.error("Error updating user profile: ", error);
      toast.error("Failed to update user profile");
    },
  });
};

export const useDeleteUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: async (userId: string) => {
      const response = await UserService.deleteUserProfile(userId);
      return response;
    },
    onSuccess: () => {
      toast.success("User profile deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      console.error("Error deleting user profile: ", error);
      toast.error("Failed to delete user profile");
    },
  });
};
