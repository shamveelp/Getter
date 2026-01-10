import SignUpForm from "@/components/admin/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp Page | Sking Cosmetics - Admin Dashboard",
  description: "This is SignUp Page Sking Cosmetics Admin Dashboard",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
