import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { getErrorMessage } from '@/utils/errorHandler';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: string) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export const useOrders = (
  params: URLSearchParams = new URLSearchParams(),
) => {
  const hasFilters = params.toString().length > 0;
  const queryKey = hasFilters 
    ? orderKeys.list(params.toString())
    : orderKeys.list('all');
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await orderService.getOrders(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useOrderById = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const response = await orderService.getOrderById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      toast.success('Order created successfully!');
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error: any) => {
      const apiError = error.response?.data;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: () => {
      toast.success('Order cancelled successfully!');
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error: any) => {
      const apiError = error.response?.data;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
}; 

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await orderService.updateOrderStatus(id, status);
      return response;
    },
    onSuccess: () => {
      toast.success('Order status updated!');
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error: any) => {
      const apiError = error.response?.data;
      const message = getErrorMessage(apiError?.errorCode, apiError?.message);
      toast.error(message);
    },
  });
}; 