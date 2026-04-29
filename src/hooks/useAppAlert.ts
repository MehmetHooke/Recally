import { AppAlertContext } from "@/src/context/AppAlertContext";
import { useContext } from "react";

export function useAppAlert() {
  const context = useContext(AppAlertContext);

  if (!context) {
    throw new Error("useAppAlert must be used within AppAlertProvider");
  }

  return context;
}
