import axios from 'axios';
import { callOpenAI } from './openai';
import { OPENAI_CONFIG } from '@/config/openai';

jest.mock('axios');
jest.mock('@/config/openai', () => ({
  OPENAI_CONFIG: {
    apiKey: 'test-api-key',
    model: 'gpt-3.5-turbo',
  },
}));

describe('callOpenAI', () => {
  it('should call OpenAI API and return the response', async () => {
    const mockMessages = [
      { sender: 'user', content: 'Hello' },
      { sender: 'ai', content: 'Hi there!' },
    ];
    const mockResponse = {
      data: {
        choices: [
          {
            message: {
              content: 'Hello! How can I assist you today?',
            },
          },
        ],
      },
    };

    axios.post.mockResolvedValue(mockResponse);

    const result = await callOpenAI(mockMessages);

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_CONFIG.model,
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
        },
      }
    );

    expect(result).toBe('Hello! How can I assist you today?');
  });

  it('should throw an error if the API call fails', async () => {
    const mockMessages = [{ sender: 'user', content: 'Hello' }];
    const mockError = new Error('API call failed');

    axios.post.mockRejectedValue(mockError);

    await expect(callOpenAI(mockMessages)).rejects.toThrow('API call failed');
  });

  it('should throw an error if the API key is missing', async () => {
    const mockMessages = [{ sender: 'user', content: 'Hello' }];
    jest.spyOn(OPENAI_CONFIG, 'apiKey', 'get').mockReturnValue(undefined);

    await expect(callOpenAI(mockMessages)).rejects.toThrow('OpenAI API key is missing');
  });
});