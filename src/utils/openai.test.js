import axios from 'axios';
import { callOpenAI } from './openai';

jest.mock('axios');

describe('callOpenAI', () => {
  it('should call OpenAI API and return the response', async () => {
    const mockMessages = [
      { sender: 'user', content: 'Hello' },
      { sender: 'ai', content: 'Hi there!' },
    ];
    const mockApiKey = 'test-api-key';
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

    const result = await callOpenAI(mockMessages, mockApiKey);

    expect(axios.post).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockApiKey}`,
        },
      }
    );

    expect(result).toBe('Hello! How can I assist you today?');
  });

  it('should throw an error if the API call fails', async () => {
    const mockMessages = [{ sender: 'user', content: 'Hello' }];
    const mockApiKey = 'test-api-key';
    const mockError = new Error('API call failed');

    axios.post.mockRejectedValue(mockError);

    await expect(callOpenAI(mockMessages, mockApiKey)).rejects.toThrow('API call failed');
  });
});