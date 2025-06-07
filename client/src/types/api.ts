export type ApiResponse<T = null> = {
  success?: boolean;
  data?: T;
  message?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
};

export type ApiError = {
  success?: boolean;
  message?: string;
  errorCode?: string;
  errors?: any[];
};
