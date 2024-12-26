import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Coin {
  name: string;
  amount: number;
}

interface CoinState {
  coins: Coin[];
}

const initialState: CoinState = {
  coins: [],
};

export const coinSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    addCoin: (state, action: PayloadAction<Coin>) => {
      const existingCoin = state.coins.find((coin) => coin.name === action.payload.name);
      if (existingCoin) {
        existingCoin.amount += action.payload.amount;
      } else {
        state.coins.push(action.payload);
      }
    },
    updateCoin: (state, action: PayloadAction<Coin>) => {
      const coinIndex = state.coins.findIndex((coin) => coin.name === action.payload.name);
      if (coinIndex !== -1) {
        state.coins[coinIndex].amount = action.payload.amount;
      }
    },
    removeCoin: (state, action: PayloadAction<string>) => {
      state.coins = state.coins.filter((coin) => coin.name !== action.payload);
    },
  },
});

export const { addCoin, updateCoin, removeCoin } = coinSlice.actions;
export default coinSlice.reducer;
