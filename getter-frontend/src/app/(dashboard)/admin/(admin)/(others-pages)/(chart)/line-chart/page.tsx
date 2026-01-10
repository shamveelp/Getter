import LineChartOne from "@/components/admin/charts/line/LineChartOne";
import ComponentCard from "@/components/admin/common/ComponentCard";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Line Chart | Sking Cosmetics - Admin Dashboard",
  description:
    "This is Line Chart page for Sking Cosmetics - Admin Dashboard",
};
export default function LineChart() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart 1">
          <LineChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
