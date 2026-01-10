import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { googleLogin } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const useGoogleLogin = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const initiateGoogleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const redirectUri = 'http://localhost:3000/auth/google/callback';
        const scope = 'email profile openid';

        if (!clientId) {
            toast.error("Google Client ID not configured");
            return;
        }

        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

        window.open(url, 'Google Login', `width=${width},height=${height},top=${top},left=${left}`);
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Ensure security by checking origin
            if (event.origin !== window.location.origin) return;

            if (event.data.type === 'GOOGLE_LOGIN_CODE' && event.data.code) {
                const toastId = toast.loading("Verifying Google login...");

                dispatch(googleLogin({ code: event.data.code }))
                    .unwrap()
                    .then(() => {
                        toast.dismiss(toastId);
                        toast.success("Successfully logged in!");
                        router.push('/');
                    })
                    .catch((err) => {
                        toast.dismiss(toastId);
                        toast.error(typeof err === 'string' ? err : "Google login failed");
                    });
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [dispatch, router]);

    return { initiateGoogleLogin };
};
