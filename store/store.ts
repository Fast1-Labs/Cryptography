import { create } from 'zustand';

import { Coin, HistoricalDataPoint } from '~/types/types';
import { supabase } from '~/utils/supabase';

export type WalletItem = {
  coin: Coin;
  quantity: number;
};

export type CoinStore = {
  coins: Coin[];
  wallet: WalletItem[];
  historicalData: Record<string, HistoricalDataPoint[]>;
  loading: boolean;
  error: string | null;
  fetchCoins: () => Promise<void>;
  fetchHistoricalData: (coinId: string, days: number) => Promise<void>;
  addToWallet: (coin: Coin, quantity: number) => void;
  calculateTotalBalance: () => number;
};

const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

export const useCoinStore = create<CoinStore>((set, get) => ({
  coins: [],
  wallet: [],
  historicalData: {},
  loading: false,
  error: null,

  fetchCoins: async () => {
    set({ loading: true, error: null });
    try {
      const { data: cachedCoins, error } = await supabase.from('coins').select('*');
      if (error) throw error;

      const lastUpdated = cachedCoins?.[0]?.updated_at ? new Date(cachedCoins[0].updated_at) : null;
      const now = new Date();
      if (lastUpdated && now.getTime() - lastUpdated.getTime() < CACHE_EXPIRY) {
        set({ coins: cachedCoins, loading: false });
        return;
      }

      const response = await fetch('https://api.coincap.io/v2/assets');
      const data = await response.json();
      const formattedData = data.data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price_usd: parseFloat(coin.priceUsd),
        change_24h: parseFloat(coin.changePercent24Hr),
        updated_at: new Date().toISOString(),
      }));

      await supabase.from('coins').upsert(formattedData);
      set({ coins: formattedData, loading: false });
    } catch (error) {
      console.error(error);
      set({ error: 'Failed to fetch coins', loading: false });
    }
  },

  fetchHistoricalData: async (coinId, days) => {
    set({ loading: true, error: null });
    try {
      const { data: cachedData, error } = await supabase
        .from('historical_data')
        .select('*')
        .eq('coin_id', coinId)
        .order('timestamp', { ascending: false })
        .limit(1);
      if (error) throw error;

      const lastUpdated = cachedData?.[0]?.timestamp ? new Date(cachedData[0].timestamp) : null;
      const now = new Date();
      if (lastUpdated && now.getTime() - lastUpdated.getTime() < CACHE_EXPIRY) {
        set((state) => ({
          historicalData: { ...state.historicalData, [coinId]: cachedData },
          loading: false,
        }));
        return;
      }

      const API_URL = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const formattedData = data.prices.map(([timestamp, value]: [number, number]) => ({
        coin_id: coinId,
        timestamp,
        value,
        updated_at: new Date().toISOString(),
      }));

      await supabase.from('historical_data').upsert(formattedData);
      set((state) => ({
        historicalData: { ...state.historicalData, [coinId]: formattedData },
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      set({ error: 'Failed to fetch historical data', loading: false });
    }
  },

  addToWallet: (coin, quantity) => {
    set((state) => ({
      wallet: [...state.wallet, { coin, quantity }],
    }));
  },

  removeFromWallet: (coin: Coin, quantity: number) => {
    set((state) => {
      const updatedWallet = state.wallet
        .map((item) =>
          item.coin.id === coin.id ? { ...item, quantity: item.quantity - quantity } : item
        )
        .filter((item) => item.quantity > 0);
      return { ...state, wallet: updatedWallet };
    });
  },

  calculateTotalBalance: () => {
    const { wallet } = get();
    return wallet.reduce((total, item) => total + item.coin.price_usd * item.quantity, 0);
  },
}));

export { Coin };
