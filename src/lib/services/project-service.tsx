import type { TCreateProject } from "@/constants/new-project";
import { axiosClient } from "../axiosClient";

export const ProjectService = {
  createProject: async (data: any) => {
    try {
      console.log("Project Data: ", data);
      const response = await axiosClient.post("/projects", data);
      return response.data;
    } catch (error) {
      console.error("Error creating project: ", error);
      throw error;
    }
  },

  updateProject: async (id: string, data: Partial<TCreateProject>) => {
    try {
      const response = await axiosClient.put(`/projects/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating project: ", error);
      throw error;
    }
  },

  getProject: async (id: string) => {
    try {
      const response = await axiosClient.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting project: ", error);
      throw error;
    }
  },

  getProjects: async () => {
    try {
      const response = await axiosClient.get("/projects");
      return response.data;
    } catch (error) {
      console.error("Error getting projects: ", error);
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    try {
      const response = await axiosClient.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting project: ", error);
      throw error;
    }
  },

  getMarketplaceProjects: async (params?: any) => {
    try {
      const response = await axiosClient.get("/projects/marketplace", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting marketplace projects: ", error);
      throw error;
    }
  },
};
