import axios from 'axios';
import { useState } from 'react';

const apiKey = process.env.OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/completions';

export const useCryptoAdvisor = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askToCryptoAdvisor = async (userQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      setMessages((prev) => [...prev, { role: 'user', content: userQuery }]);
      const { data } = await axios.post(
        API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: [...messages, { role: 'user', content: userQuery }],
          temperature: 0.7,
          max_tokens: 200,
        },
        {
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        }
      );
      const assistantResponse = data.choices[0].message.content;
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantResponse }]);
    } catch (error) {
      console.log('Error while using advisor ', error);
      setError('Could not get the response. Try again.');
    } finally {
      setLoading(false);
    }
  };
  return { messages, loading, error, askToCryptoAdvisor };
};
