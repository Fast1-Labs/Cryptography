export interface Coin {
  id: string;
  name: string;
  symbol: string;
  price_usd: number;
  change_24h: string;
  market_cap?: number;
  volume_24h?: number;
  coin_id: string;
  coin_name: string;
  quantity: string;
}
export interface HistoricalDataPoint {
  timestamp: number;
  value: number;
}

interface HeaderItem {
  type: 'header';
  title: string;
}

interface CoinItem extends Coin {
  type: 'topGainer' | 'topLoser' | 'coin';
  rank?: number;
  isFavorite?: boolean;
}

export type HomeDataItem = HeaderItem | CoinItem;
