import { renderHook, act } from '@testing-library/react-hooks';
import useApi from './useApi';
import axios from 'axios';

jest.mock('axios');
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

describe('useApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make a GET request', async () => {
    const mockData = { data: 'test data' };
    axios.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useApi());

    let response;
    await act(async () => {
      response = await result.current.get('/test');
    });

    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: '/test',
    });
    expect(response).toEqual(mockData);
  });

  it('should make a POST request', async () => {
    const mockData = { data: 'test data' };
    axios.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useApi());

    let response;
    await act(async () => {
      response = await result.current.post('/test', { foo: 'bar' });
    });

    expect(axios).toHaveBeenCalledWith({
      method: 'post',
      url: '/test',
      data: { foo: 'bar' },
    });
    expect(response).toEqual(mockData);
  });

  it('should handle errors', async () => {
    const mockError = new Error('Network Error');
    axios.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useApi());

    await act(async () => {
      await expect(result.current.get('/test')).rejects.toThrow('Network Error');
    });

    expect(result.current.error).toEqual(mockError);
  });

  it('should set loading state correctly', async () => {
    axios.mockResolvedValueOnce({ data: {} });

    const { result, waitForNextUpdate } = renderHook(() => useApi());

    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.get('/test');
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
  });
});