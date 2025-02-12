import axios from 'axios';

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const ASSISTANT_ID = 'asst_XXXXXXXX';

const API_URL = 'https://api.openai.com/v1/threads';

export const askCryptoAdvisor = async (userQuery: string) => {
  try {
    const { data: threadData } = await axios.post(
      API_URL,
      {},
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
    );

    const threadId = threadData.id;

    await axios.post(
      `${API_URL}/${threadId}/messages`,
      { role: 'user', content: userQuery },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
    );

    const { data: runData } = await axios.post(
      `${API_URL}/${threadId}/runs`,
      { assistant_id: ASSISTANT_ID },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
    );

    const runId = runData.id;

    let runStatus = 'in_progress';
    let retryCount = 0;
    const maxRetries = 5;

    while (runStatus !== 'completed' && retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retryCount) * 1000));

      const { data: checkRun } = await axios.get(`${API_URL}/${threadId}/runs/${runId}`, {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      });

      runStatus = checkRun.status;
      retryCount++;

      if (runStatus === 'failed' || runStatus === 'cancelled') {
        throw new Error('Assistant run failed.');
      }
    }

    if (runStatus !== 'completed') {
      throw new Error('Timeout: Assistant response took too long.');
    }

    const { data: messagesData } = await axios.get(`${API_URL}/${threadId}/messages`, {
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    });

    const assistantMessage = messagesData.data.find((msg: any) => msg.role === 'assistant');

    return assistantMessage?.content || 'No response from AI.';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "Sorry, I couldn't process your request.";
  }
};
