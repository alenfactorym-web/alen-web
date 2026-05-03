"use client";

import { createContext, useContext } from "react";

const AdminBrandContext = createContext({
  brand: "alen",
  setBrand: () => {},
  accentColor: "#f5c400",
});

export function AdminBrandProvider({ value, children }) {
  return (
    <AdminBrandContext.Provider value={value}>
      {children}
    </AdminBrandContext.Provider>
  );
}

export function useAdminBrand() {
  return useContext(AdminBrandContext);
}

