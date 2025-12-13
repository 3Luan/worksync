import type { ApiResponse } from '@/types/api';
import { isAxiosError } from 'axios';

async function handleApiCall(apiCall: () => Promise<any>, errorTitle: string): Promise<any> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (isAxiosError(error)) {
      throw error;
    } else {
      throw {
        success: false,
        data: null,
        errors: error,
        message: errorTitle,
        status: 500,
      };
    }
  }
}

export async function baseResponseApi<T>(
  apiCall: () => Promise<any>,
  errorTitle: string,
): Promise<ApiResponse<T>> {
  const response = await handleApiCall(apiCall, errorTitle);
  return response.data;
}

export async function baseBlobResponseApi<T = Blob>(
  apiCall: () => Promise<any>,
  errorTitle: string,
): Promise<{ data: T; headers: any }> {
  const response = await handleApiCall(apiCall, errorTitle);
  return {
    data: response.data,
    headers: response.headers,
  };
}
