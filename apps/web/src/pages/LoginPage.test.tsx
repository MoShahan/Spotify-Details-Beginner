import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginPage } from './LoginPage';

const loginMock = vi.fn();
const useAuthMock = vi.fn();

vi.mock('../contexts/auth', () => ({
  useAuth: () => useAuthMock(),
}));

function mockLoggedOut() {
  useAuthMock.mockReturnValue({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: loginMock,
    register: vi.fn(),
    logout: vi.fn(),
  });
}

function mockLoggedIn() {
  useAuthMock.mockReturnValue({
    user: {
      id: 'u1',
      name: 'Shahan',
      email: 'shahan@cadence.com',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    isAuthenticated: true,
    isLoading: false,
    login: loginMock,
    register: vi.fn(),
    logout: vi.fn(),
  });
}

describe('LoginPage', () => {
  beforeEach(() => {
    loginMock.mockReset();
    loginMock.mockResolvedValue(undefined);
    useAuthMock.mockReset();
    mockLoggedOut();
  });

  it('submits email and password on the happy path', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText('Email'), 'shahan@cadence.com');
    await user.type(screen.getByLabelText('Password'), 'Shahan@123');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(loginMock).toHaveBeenCalledWith({
      email: 'shahan@cadence.com',
      password: 'Shahan@123',
    });
  });

  it('sends already-authenticated users to the return path', () => {
    mockLoggedIn();

    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/login', state: { from: '/songs' } }]}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/songs" element={<p>Return path songs marker</p>} />
          <Route path="/" element={<p>Home page marker</p>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Return path songs marker')).toBeInTheDocument();
    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
    expect(screen.queryByText('Home page marker')).not.toBeInTheDocument();
  });
});
