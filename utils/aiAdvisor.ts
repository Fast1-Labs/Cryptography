import { useState } from 'react';

export const useCryptoAdvisor = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askToCryptoAdvisor = async (userQuery: string) => {
    if (!userQuery) return;
    setLoading(true);
    setError(null);

    try {
      setMessages((prev) => [...prev, { role: 'user', content: userQuery }]);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a cryptocurrency financial advisor and trading expert. 
              Your role is to provide **insightful, up-to-date** information on:
              - Bitcoin, Ethereum, and major altcoins.
              - DeFi, NFTs, and blockchain technology.
              - Trading strategies, technical & fundamental analysis.
              - Risk management, market trends, and price predictions.

              **Important:** If a user asks for real-time prices or news, inform them that you do not have live data, but suggest trusted sources like CoinGecko, CoinMarketCap, or Binance.`,
            },
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
