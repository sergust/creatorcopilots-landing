import * as Sentry from "@sentry/nextjs";
import axios from 'axios';

// Use this if you want to make a call to OpenAI GPT-4 for instance. userId is used to identify the user on openAI side.
export const sendOpenAi = async (
  messages: any[], // TODO: type this
  userId: number,
  max = 100,
  temp = 1
) => {
  const url = 'https://api.openai.com/v1/chat/completions';

  Sentry.logger.debug("OpenAI request", { model: "gpt-4", message_count: messages.length, max_tokens: max });

  const body = JSON.stringify({
    model: 'gpt-4',
    messages,
    max_tokens: max,
    temperature: temp,
    user: userId,
  });

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(url, body, options);

    const answer = res.data.choices[0].message.content;
    const usage = res?.data?.usage;

    Sentry.logger.info("OpenAI response received", {
      total_tokens: usage?.total_tokens,
      prompt_tokens: usage?.prompt_tokens,
      completion_tokens: usage?.completion_tokens,
    });

    return answer;
  } catch (e: any) {
    Sentry.logger.error("OpenAI request failed", { status: e?.response?.status, error_data: JSON.stringify(e?.response?.data) });
    Sentry.captureException(e);
    return null;
  }
};
