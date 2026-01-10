import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import DefaultModal from "@/components/admin/example/ModalExample/DefaultModal";
import FormInModal from "@/components/admin/example/ModalExample/FormInModal";
import FullScreenModal from "@/components/admin/example/ModalExample/FullScreenModal";
import ModalBasedAlerts from "@/components/admin/example/ModalExample/ModalBasedAlerts";
import VerticallyCenteredModal from "@/components/admin/example/ModalExample/VerticallyCenteredModal";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Modals | Sking Cosmetics - Admin Dashboard",
  description:
    "This is Modals page for Sking Cosmetics - Admin Dashboard",
  // other metadata
};

export default function Modals() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Modals" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
        <DefaultModal />
        <VerticallyCenteredModal />
        <FormInModal />
        <FullScreenModal />
        <ModalBasedAlerts />
      </div>
    </div>
  );
}
