import BarChartOne from "@/components/admin/charts/bar/BarChartOne";
import ComponentCard from "@/components/admin/common/ComponentCard";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bar Chart | Sking Cosmetics - Admin Dashboard",
  description:
    "This is Bar Chart page for Sking Cosmetics - Admin Dashboard",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart 1">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
