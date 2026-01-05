import axiosInstance from '../../lib/axios';

const API_URL = '/profile';

interface UpdateProfileData {
    name?: string;
    bio?: string;
    phoneNumber?: string;
}

export const userProfileService = {
    getProfile: async () => {
        const response = await axiosInstance.get(`${API_URL}/`);
        return response.data;
    },

    updateProfile: async (data: UpdateProfileData) => {
        const response = await axiosInstance.put(`${API_URL}/`, data);
        return response.data;
    },

    uploadProfilePicture: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axiosInstance.post(`${API_URL}/upload-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
