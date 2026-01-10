import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import CheckboxComponents from "@/components/admin/form/form-elements/CheckboxComponents";
import DefaultInputs from "@/components/admin/form/form-elements/DefaultInputs";
import DropzoneComponent from "@/components/admin/form/form-elements/DropZone";
import FileInputExample from "@/components/admin/form/form-elements/FileInputExample";
import InputGroup from "@/components/admin/form/form-elements/InputGroup";
import InputStates from "@/components/admin/form/form-elements/InputStates";
import RadioButtons from "@/components/admin/form/form-elements/RadioButtons";
import SelectInputs from "@/components/admin/form/form-elements/SelectInputs";
import TextAreaInput from "@/components/admin/form/form-elements/TextAreaInput";
import ToggleSwitch from "@/components/admin/form/form-elements/ToggleSwitch";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Form Elements | Sking Cosmetics - Admin Dashboard",
  description:
    "This is Form Elements page for Sking Cosmetics - Admin Dashboard",
};

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="From Elements" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs />
          <SelectInputs />
          <TextAreaInput />
          <InputStates />
        </div>
        <div className="space-y-6">
          <InputGroup />
          <FileInputExample />
          <CheckboxComponents />
          <RadioButtons />
          <ToggleSwitch />
          <DropzoneComponent />
        </div>
      </div>
    </div>
  );
}
