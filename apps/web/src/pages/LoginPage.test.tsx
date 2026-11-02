import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginPage } from './LoginPage';

const loginMock = vi.fn();

vi.mock('../contexts/auth', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: loginMock,
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    loginMock.mockReset();
    loginMock.mockResolvedValue(undefined);
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
});
