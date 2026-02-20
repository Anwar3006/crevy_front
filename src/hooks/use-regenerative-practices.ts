import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/lib/services/project-service";

export function useRegenerativePractices() {
  return useQuery({
    queryKey: ["regenerative-practices"],
    queryFn: async () => {
      const response = await ProjectService.getRegenerativePractices();
      return response.data;
    },
  });
}
