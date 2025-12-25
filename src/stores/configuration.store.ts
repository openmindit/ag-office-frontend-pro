import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppConfiguration } from "../types/api.types";

interface ConfigurationState {
    configuration: AppConfiguration | null;
    setConfiguration: (configuration: AppConfiguration) => void;
}

export const useConfigurationStore = create<ConfigurationState>()(
    persist(
        (set) => ({
            configuration: null,
            setConfiguration: (configuration) => set({ configuration }),
        }),
        {
            name: "ag-office-configuration",
        }
    )
);