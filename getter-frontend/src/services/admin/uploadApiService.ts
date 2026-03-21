import { ApiResponse } from '@/types/api';
import axiosInstance from '../../lib/axios';

const API_URL = '/api/admin/upload';

export interface UploadResponse {
    url: string;
}

export const uploadService = {
    uploadImage: async (file: File): Promise<ApiResponse<UploadResponse>> => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axiosInstance.post<ApiResponse<UploadResponse>>(API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};
