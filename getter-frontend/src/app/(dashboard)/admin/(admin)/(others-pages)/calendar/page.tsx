import Calendar from "@/components/admin/calendar/Calendar";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Calender | Sking Cosmetics - Admin Dashboard",
  description:
    "This is Calender page for Sking Cosmetics - Admin Dashboard",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Calendar" />
      <Calendar />
    </div>
  );
}
