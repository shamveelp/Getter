import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import VideosExample from "@/components/admin/ui/video/VideosExample";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Videos | Sking Cosmetics - Admin Dashboard",
  description:
    "This is Videos page for Sking Cosmetics - Admin Dashboard",
};

export default function VideoPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Videos" />

      <VideosExample />
    </div>
  );
}
