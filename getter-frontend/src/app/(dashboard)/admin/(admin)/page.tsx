import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/admin/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/admin/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/admin/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/admin/ecommerce/StatisticsChart";
import RecentOrders from "@/components/admin/ecommerce/RecentOrders";
import DemographicCard from "@/components/admin/ecommerce/DemographicCard";

export const metadata: Metadata = {
  title:
    "Sking Cosmetics E-commerce Dashboard | Coding Aashan",
  description: "Sking Cosmetics E-commerce Dashboard Page",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
