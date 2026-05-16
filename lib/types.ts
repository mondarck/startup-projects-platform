import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      facultyId?: number;
      facultyName?: string;
    };
  }
}

export interface ProjectFilters {
  search?: string;
  category?: string;
  country?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "most_viewed" | "rating" | "relevance";
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
