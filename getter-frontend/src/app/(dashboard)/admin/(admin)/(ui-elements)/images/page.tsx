import ComponentCard from "@/components/admin/common/ComponentCard";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import ResponsiveImage from "@/components/admin/ui/images/ResponsiveImage";
import ThreeColumnImageGrid from "@/components/admin/ui/images/ThreeColumnImageGrid";
import TwoColumnImageGrid from "@/components/admin/ui/images/TwoColumnImageGrid";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Images | Sking Cosmetics - Admin Dashboard",
  description:
    "This is Images page for Sking Cosmetics - Admin Dashboard",
  // other metadata
};

export default function Images() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Images" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Responsive image">
          <ResponsiveImage />
        </ComponentCard>
        <ComponentCard title="Image in 2 Grid">
          <TwoColumnImageGrid />
        </ComponentCard>
        <ComponentCard title="Image in 3 Grid">
          <ThreeColumnImageGrid />
        </ComponentCard>
      </div>
    </div>
  );
}
