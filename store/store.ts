import { create } from 'zustand';

export type Coin = {
  id: string;
  name: string;
  symbol: string;
  price_usd: number;
  change_24h: any;
};

export type HistoricalDataPoint = {
  timestamp: number;
  value: number;
};

export type CoinStore = {
  coins: Coin[];
  historicalData: Record<string, HistoricalDataPoint[]>;
  loading: boolean;
  error: string | null;
  fetchCoins: () => Promise<void>;
  fetchHistoricalData: (coinId: string, days: number) => Promise<void>;
};

export const useCoinStore = create<CoinStore>((set, get) => ({
  coins: [],
  historicalData: {},
  loading: false,
  error: null,

  fetchCoins: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('https://api.coincap.io/v2/assets');
      const data = await response.json();
      const formattedData = data.data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price_usd: parseFloat(coin.priceUsd),
        change_24h: parseFloat(coin.changePercent24Hr),
      }));
      set({ coins: formattedData, loading: false });
    } catch (error) {
      console.log(error);
      set({ error: 'Failed to fetch coins', loading: false });
    }
  },

  fetchHistoricalData: async (coinId, days) => {
    set({ loading: true, error: null });
    try {
      const API_URL = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
      const response = await fetch(API_URL);
      const data = await response.json();

      const formattedData = data.prices.map(([timestamp, value]: [number, number]) => ({
        timestamp,
        value,
      }));

      set((state) => ({
        historicalData: {
          ...state.historicalData,
          [coinId]: formattedData,
        },
        loading: false,
      }));
    } catch (error) {
      console.log(error);
      set({ error: 'Failed to fetch historical data', loading: false });
    }
  },
}));
