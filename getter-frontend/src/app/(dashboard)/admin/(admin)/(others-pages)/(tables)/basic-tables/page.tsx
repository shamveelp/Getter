import ComponentCard from "@/components/admin/common/ComponentCard";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import BasicTableOne from "@/components/admin/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Basic Table | Sking Cosmetics - Admin Dashboard",
  description:
    "This is Basic Table page for Sking Cosmetics - Admin Dashboard",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Basic Table" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
