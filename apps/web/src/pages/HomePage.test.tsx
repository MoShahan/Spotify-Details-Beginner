import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HomePage } from './HomePage';

const getMock = vi.fn();

vi.mock('../lib/api', () => ({
  api: {
    get: (...args: unknown[]) => getMock(...args),
    post: vi.fn(),
  },
  getApiErrorMessage: () => 'error',
}));

vi.mock('../contexts/auth', () => ({
  useAuth: () => ({
    user: {
      id: 'u1',
      name: 'Shahan',
      email: 'shahan@cadence.com',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe('HomePage', () => {
  beforeEach(() => {
    getMock.mockReset();
    getMock.mockImplementation((url: string) => {
      if (url === '/songs/top') {
        return Promise.resolve({
          data: {
            songs: [
              {
                id: 's1',
                name: 'Wildflower',
                releaseDate: '2024-05-17',
                releaseYear: 2024,
                album: 'Hit Me Hard and Soft',
                coverUrl: null,
                averageRating: 4.8,
                ratingCount: 2,
                artists: [{ id: 'a1', name: 'Billie Eilish' }],
              },
            ],
          },
        });
      }
      if (url === '/artists/top') {
        return Promise.resolve({
          data: {
            artists: [
              {
                id: 'a1',
                name: 'Billie Eilish',
                dob: null,
                bio: null,
                imageUrl: null,
                averageRating: 4.8,
                ratingCount: 2,
              },
            ],
          },
        });
      }
      return Promise.reject(new Error(`unexpected ${url}`));
    });
  });

  it('shows welcome and top lists without add buttons', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', { name: 'Home' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Welcome, Shahan/)).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /New song/i }),
    ).not.toBeInTheDocument();
    expect(await screen.findByText('Wildflower')).toBeInTheDocument();
    expect(screen.getByText('Top 10 Songs')).toBeInTheDocument();
    expect(screen.getByText('Top 10 Artists')).toBeInTheDocument();
    expect(screen.queryByLabelText('Rate from 1 to 5')).not.toBeInTheDocument();
  });
});
