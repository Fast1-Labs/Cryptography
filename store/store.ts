import { create } from 'zustand';

export interface BearState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
  fetchBears: () => Promise<void>;
}

export const useStore = create<BearState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
  fetchBears: async () => {
    try {
      const response = await fetch('https://api.coincap.io/v2/assets');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      set({ bears: data.totalBears });
    } catch (error) {
      console.error('Failed to fetch bears:', error);
    }
  },
}));
