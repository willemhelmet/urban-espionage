import { useContext } from "react";
import { MapControlContext } from "../contexts/MapControl.context";

export function useMapControl() {
  const context = useContext(MapControlContext);
  if (!context) {
    throw new Error("useMapControl must be used within MapControlProvider");
  }
  return context;
}