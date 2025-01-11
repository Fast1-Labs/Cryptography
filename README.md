# Cryptography - Mobile App for Crypto Wallet and Real-Time Coin Data

Cryptography is a mobile application built with **React Native**, **Expo**, and **TypeScript** that allows users to securely manage their personal crypto wallet, view real-time coin prices, and track historical data. It uses **Clerk** for authentication, **Zustand** for state management, and **AsyncStorage** for securely storing personal data.

Currently available for closed testing.

## API Reference

### Coin Data API (REST API)

#### Overview
The Coin Data API provides real-time and historical data for various cryptocurrencies. This is useful for users to stay updated on the latest coin prices and their personal portfolio.

#### API Base URL
- **Base URL**: `https://api.coindata.com`

#### Common Endpoints

- **Coin Data (Real-time Prices)**
  - **Endpoint**: `/v1/coins/{coinId}/data`
  - **Description**: Retrieves the current price and market data of a specific coin.
  - **Example**: To get the data for Bitcoin, use `/v1/coins/bitcoin/data`.

- **Historical Data**
  - **Endpoint**: `/v1/coins/{coinId}/historical`
  - **Description**: Fetches historical market data for a specific coin.
  - **Example**: To get historical data for Ethereum, use `/v1/coins/ethereum/historical`.

- **Market Data**
  - **Endpoint**: `/v1/markets`
  - **Description**: Retrieves data for market trends and trading volumes across different exchanges.

---

## Features

- **Secure Personal Crypto Wallet**: Store and manage your cryptocurrencies securely.
- **Real-time Coin Prices**: View live data for your favorite coins.
- **Historical Data**: Access detailed historical information for various cryptocurrencies.
- **State Management with Zustand**: Efficient and scalable state management for a smooth user experience.
- **Authentication with Clerk**: Easy and secure user authentication for logging in and managing your wallet.
- **Data Persistence with AsyncStorage**: Securely store your wallet data locally, even when offline.

## Screenshots

https://github.com/user-attachments/assets/a2265c88-59c7-4f03-a16e-05c60ecdd482


