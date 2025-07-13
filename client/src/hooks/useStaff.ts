import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { staffService } from '@/services/staffService';
import type {
  Staff,
  CreateStaffPayload,
  UpdateStaffPayload,
  StaffStats,
} from '@/types/staff';
import type { ApiError } from '@/types/api';
import { getErrorMessage } from '@/utils/errorHandler';

export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (filters: string) => [...staffKeys.lists(), { filters }] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
  stats: () => [...staffKeys.all, 'stats'] as const,
};

// Get all staff
export const useStaff = (params?: {
  department?: string;
  status?: string;
  search?: string;
}) => {
  const searchParams = new URLSearchParams();
  if (params?.department) searchParams.append('department', params.department);
  if (params?.status) searchParams.append('status', params.status);
  if (params?.search) searchParams.append('search', params.search);

  return useQuery({
    queryKey: staffKeys.list(searchParams.toString()),
    queryFn: async () => {
      const response = await staffService.getStaff(params);
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Get staff by ID
export const useStaffById = (id: string) => {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: async () => {
      const response = await staffService.getStaffById(id);
      return response.data?.staff;
    },
    enabled: !!id,
  });
};

// Get staff statistics
export const useStaffStats = () => {
  return useQuery({
    queryKey: staffKeys.stats(),
    queryFn: async () => {
      const response = await staffService.getStaffStats();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Create staff mutation
export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStaffPayload) => staffService.createStaff(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
      const newStaff = response.data?.staff;
      if (newStaff) {
        // Add to beginning of list
        queryClient.setQueryData(staffKeys.lists(), (old: Staff[] = []) => [
          newStaff,
          ...old,
        ]);
      }
      toast.success('Staff member created successfully!');
      return newStaff;
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Update staff mutation
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffPayload }) =>
      staffService.updateStaff(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });

      const updatedStaff = response.data?.staff;
      if (updatedStaff) {
        // Update the staff in all relevant queries
        queryClient.setQueryData(staffKeys.lists(), (old: Staff[] = []) =>
          old.map((staff) => (staff._id === id ? updatedStaff : staff)),
        );

        // Update individual staff query
        queryClient.setQueryData(staffKeys.detail(id), updatedStaff);
      }

      toast.success('Staff member updated successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Delete staff mutation
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffService.deleteStaff(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache immediately
      queryClient.setQueryData(staffKeys.lists(), (old: Staff[] = []) =>
        old.map((staff) =>
          staff._id === deletedId ? { ...staff, isActive: false } : staff,
        ),
      );

      // Update specific staff cache
      queryClient.setQueryData(staffKeys.detail(deletedId), (old: Staff) =>
        old ? { ...old, isActive: false } : old,
      );

      queryClient.invalidateQueries({ queryKey: staffKeys.all });
      toast.success('Staff member deactivated successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

// Update permissions mutation
export const useUpdatePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) =>
      staffService.updatePermissions(id, permissions),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });

      const updatedStaff = response.data?.staff;
      if (updatedStaff) {
        // Update the staff in all relevant queries
        queryClient.setQueryData(staffKeys.lists(), (old: Staff[] = []) =>
          old.map((staff) => (staff._id === id ? updatedStaff : staff)),
        );

        // Update individual staff query
        queryClient.setQueryData(staffKeys.detail(id), updatedStaff);
      }

      toast.success('Staff permissions updated successfully!');
    },
    onError: (error: any) => {
      const apiError = error.response?.data as ApiError;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};
