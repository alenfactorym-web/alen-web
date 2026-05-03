"use client";

import DashboardCards from "../components/DashboardCards";
import { useAdminBrand } from "../components/AdminBrandContext";

export default function AdminHome() {
  const { brand, accentColor } = useAdminBrand();

  return <DashboardCards brand={brand} accentColor={accentColor} />;
}

