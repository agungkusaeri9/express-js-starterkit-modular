export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?:
    | {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }
    | undefined;
  paginate?: boolean;
}
