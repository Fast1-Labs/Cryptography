export interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change_24h: string;
}

interface HeaderItem {
  type: 'header';
  title: string;
}

interface CoinItem extends Coin {
  type: 'topGainer' | 'topLoser' | 'coin';
}

export type HomeDataItem = HeaderItem | CoinItem;
