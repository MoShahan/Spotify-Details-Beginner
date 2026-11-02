import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import App from './App';

vi.mock('./lib/api', () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: { status: 'ok' } }),
  },
}));

describe('App', () => {
  it('renders Cadence brand', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Cadence' }),
    ).toBeInTheDocument();
  });
});
