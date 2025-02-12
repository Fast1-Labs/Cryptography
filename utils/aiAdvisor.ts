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
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a highly knowledgeable cryptocurrency financial advisor. Your job is to provide expert insights on cryptocurrency markets, trading strategies, investment opportunities, and risk management. Keep responses clear, professional, and informative.',
            },
            ...messages,
            { role: 'user', content: userQuery },
          ],
          temperature: 0.7,
          max_tokens: 200,
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
