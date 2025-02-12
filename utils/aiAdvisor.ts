import axios from 'axios';
import { useState } from 'react';

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const ASSISTANT_ID = 'asst_XXXXXXXX';
const API_URL = 'https://api.openai.com/v1/threads';

export const useCryptoAdvisor = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askCryptoAdvisor = async (userQuery: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: threadData } = await axios.post(
        API_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const threadId = threadData.id;

      setMessages((prev) => [...prev, { role: 'user', content: userQuery }]);

      await axios.post(
        `${API_URL}/${threadId}/messages`,
        { role: 'user', content: userQuery },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const { data: runData } = await axios.post(
        `${API_URL}/${threadId}/runs`,
        { assistant_id: ASSISTANT_ID },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const runId = runData.id;

      let runStatus = 'in_progress';
      while (runStatus !== 'completed') {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const { data: checkRun } = await axios.get(`${API_URL}/${threadId}/runs/${runId}`, {
          headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
        });

        runStatus = checkRun.status;

        if (runStatus === 'failed' || runStatus === 'cancelled') {
          throw new Error('Assistant run failed.');
        }
      }

      const { data: messagesData } = await axios.get(`${API_URL}/${threadId}/messages`, {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      });

      const assistantMessage = messagesData.data.find((msg: any) => msg.role === 'assistant');

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: assistantMessage?.content || 'No response.' },
      ]);
    } catch (err) {
      console.error('OpenAI API Error:', err);
      setError("Sorry, I couldn't process your request.");
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, askCryptoAdvisor };
};
