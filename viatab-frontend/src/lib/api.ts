import { Department, Story } from "@/types/story";
import { apiClient } from "./axios";

export const storyApi = {
  getAllStories: async (): Promise<Story[]> => {
    const response = await apiClient.get("/stories");
    return response.data;
  },

  getStoryById: async (id: number): Promise<Story> => {
    const response = await apiClient.get(`/stories/${id}`);
    return response.data;
  },

  getStoriesByDepartment: async (department: Department): Promise<Story[]> => {
    const response = await apiClient.get(`/stories/department/${department}`);
    return response.data;
  },

  createStory: async (
    story: Omit<Story, "id" | "createdAt" | "updatedAt">
  ): Promise<Story> => {
    const response = await apiClient.post("/stories", story);
    return response.data;
  },

  updateStory: async (
    id: number,
    story: Omit<Story, "id" | "createdAt" | "updatedAt">
  ): Promise<Story> => {
    const response = await apiClient.put(`/stories/${id}`, story);
    return response.data;
  },

  deleteStory: async (id: number): Promise<void> => {
    await apiClient.delete(`/stories/${id}`);
  },

  searchStories: async (keyword: string): Promise<Story[]> => {
    const response = await apiClient.get(`/stories/search`, {
      params: { keyword },
    });
    return response.data;
  },

  getDepartments: async (): Promise<Department[]> => {
    const response = await apiClient.get("/stories/departments");
    return response.data;
  },
};
