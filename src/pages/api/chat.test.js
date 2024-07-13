import { createMocks } from 'node-mocks-http';
import handler from './chat';
import { callOpenAI } from '@/utils/openai';

jest.mock('@/utils/openai');

describe('/api/chat', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should return 200 and AI response for valid POST request', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        messages: [{ sender: 'user', content: 'Hello' }],
      },
    });

    callOpenAI.mockResolvedValue('Hello! How can I assist you today?');

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      response: 'Hello! How can I assist you today?',
    });
  });

  it('should return 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('should return 500 if an error occurs', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        messages: [{ sender: 'user', content: 'Hello' }],
      },
    });

    callOpenAI.mockRejectedValue(new Error('API call failed'));

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Internal Server Error',
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in chat API:', expect.any(Error));
  });
});