import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import App from './App';

vi.mock('./lib/api', () => ({
  api: {
    get: vi.fn().mockRejectedValue(new Error('no session')),
    post: vi.fn(),
  },
  getApiErrorMessage: () => 'error',
  setUnauthorizedSessionHandler: vi.fn(),
}));

describe('App shell', () => {
  it('shows Cadence brand and login on public routes', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', { name: 'Log in' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Cadence').length).toBeGreaterThan(0);
  });
});
