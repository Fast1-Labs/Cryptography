import { create } from 'zustand';

export type Coin = {
  id: string;
  name: string;
  symbol: string;
  price_usd: number;
  change_24h: number;
};

export type CoinStore = {
  coins: Coin[];
  loading: boolean;
  error: string | null;
  fetchCoins: () => Promise<void>;
};

export const useCoinStore = create<CoinStore>((set) => ({
  coins: [],
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
}));
