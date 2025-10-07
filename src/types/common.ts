// Common response types
export interface BaseResponse {
  readonly success: boolean;
  readonly error?: string;
}

export interface PaginatedResponse<T> extends BaseResponse {
  readonly data: readonly T[];
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
  };
}

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type NonNullable<T> = T extends null | undefined ? never : T;

// Form validation types
export interface ValidationError {
  readonly field: string;
  readonly message: string;
}

export interface FormState<T> {
  readonly data: T;
  readonly errors: readonly ValidationError[];
  readonly isValid: boolean;
  readonly isSubmitting: boolean;
}
