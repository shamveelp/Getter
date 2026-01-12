import axiosInstance from '../../lib/axios';

const API_URL = '/api/admin/upload';

export const uploadService = {
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axiosInstance.post(API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};
