import { useState } from 'react';

import { useCoinStore } from '~/store/store';

export const useCryptoAdvisor = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { coins } = useCoinStore();

  const askToCryptoAdvisor = async (userQuery: string) => {
    if (!userQuery) return;
    setLoading(true);
    setError(null);

    try {
      setMessages((prev) => [...prev, { role: 'user', content: userQuery }]);

      const coinDataText = coins
        .slice(0, 10)
        .map((coin) => `${coin.name} (${coin.symbol}): $${coin.price_usd.toFixed(2)}`)
        .join('\n');

      const systemPrompt = `
      You are a cryptocurrency financial advisor and trading expert. 
      Your role is to provide **insightful, up-to-date** information on:
      - Bitcoin, Ethereum, and major altcoins.
      - DeFi, NFTs, and blockchain technology.
      - Trading strategies, technical & fundamental analysis.
      - Risk management, market trends, and price predictions.

      **Latest Market Data:**
      ${coinDataText}

      **Important:** If a user asks for real-time prices or news, inform them that the data is updated periodically. Suggest checking CoinGecko, CoinMarketCap, or Binance for live updates.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
            { role: 'user', content: userQuery },
          ],
          temperature: 0.6,
          max_tokens: 300,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'API error');

      const assistantResponse = data.choices?.[0]?.message?.content || 'No response';

      setMessages((prev) => [...prev, { role: 'assistant', content: assistantResponse }]);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, askToCryptoAdvisor };
};
