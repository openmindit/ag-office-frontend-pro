import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Configuration } from "../types/api.types";

interface ConfigurationState {
    configuration: Configuration | null;
    setConfiguration: (configuration: Configuration) => void;
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