import '@testing-library/jest-dom';

jest.mock('axios');

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  }
}));

const mockedAxios = require('axios').default;
mockedAxios.get.mockResolvedValue({ data: [] });
mockedAxios.post.mockResolvedValue({ data: { id: 1, firstName: 'Test', lastName: 'User' } });
