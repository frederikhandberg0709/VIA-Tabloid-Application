import { storyApi } from "@/lib/api";
import { Department, Story } from "@/types/story";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const storyKeys = {
  all: ["stories"] as const,
  lists: () => [...storyKeys.all, "list"] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: (filters: Record<string, any>) =>
    [...storyKeys.lists(), { filters }] as const,
  details: () => [...storyKeys.all, "detail"] as const,
  detail: (id: number) => [...storyKeys.details(), id] as const,
  search: (keyword: string) => [...storyKeys.all, "search", keyword] as const,
  departments: ["departments"] as const,
};

export function useStories() {
  return useQuery({
    queryKey: storyKeys.lists(),
    queryFn: storyApi.getAllStories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStoriesByDepartment(department: Department) {
  return useQuery({
    queryKey: storyKeys.list({ department }),
    queryFn: () => storyApi.getStoriesByDepartment(department),
    staleTime: 5 * 60 * 1000,
  });
}

export function useStory(id: number) {
  return useQuery({
    queryKey: storyKeys.detail(id),
    queryFn: () => storyApi.getStoryById(id),
    enabled: !!id,
  });
}

export function useSearchStories(keyword: string) {
  return useQuery({
    queryKey: storyKeys.search(keyword),
    queryFn: () => storyApi.searchStories(keyword),
    enabled: !!keyword.trim(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storyApi.createStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
    },
  });
}

export function useUpdateStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      story,
    }: {
      id: number;
      story: Omit<Story, "id" | "createdAt" | "updatedAt">;
    }) => storyApi.updateStory(id, story),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(storyKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
    },
  });
}

export function useDeleteStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storyApi.deleteStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.all });
    },
  });
}
