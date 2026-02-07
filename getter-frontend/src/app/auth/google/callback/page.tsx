"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { googleLogin } from "@/redux/features/authSlice";
import { AppDispatch } from "@/redux/store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function GoogleCallbackPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const code = searchParams.get("code");
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;

        if (code) {
            processedRef.current = true;

            // If opened in a popup/new window by the main app
            if (window.opener) {
                window.opener.postMessage({ type: 'GOOGLE_LOGIN_CODE', code }, window.location.origin);
                window.close();
            } else {
                // Fallback: If opened directly (not as popup), verify normally
                const toastId = toast.loading("Verifying Google login...");

                dispatch(googleLogin({ code }))
                    .unwrap()
                    .then(() => {
                        toast.dismiss(toastId);
                        toast.success("Successfully logged in with Google!");
                        router.push("/");
                    })
                    .catch((err: any) => {
                        toast.dismiss(toastId);
                        toast.error(typeof err === 'string' ? err : "Google login failed");
                        router.push("/login");
                    });
            }
        } else {
            if (!processedRef.current) {
                router.push("/login");
            }
        }
    }, [code, dispatch, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
            <span className="text-lg font-medium text-gray-300">Verifying Google login...</span>
        </div>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
                <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
                <span className="text-lg font-medium text-gray-300">Loading...</span>
            </div>
        }>
            <GoogleCallbackPageContent />
        </Suspense>
    );
}
