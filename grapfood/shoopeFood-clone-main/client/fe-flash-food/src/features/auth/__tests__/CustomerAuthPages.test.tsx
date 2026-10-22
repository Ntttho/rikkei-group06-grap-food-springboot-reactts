import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context';
import { CustomerLogin } from '../components/CustomerAuthPages';
import { describe, it, expect } from 'vitest';

describe('CustomerLogin Component', () => {
  it('should render customer login form inputs', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CustomerLogin />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Đăng nhập Khách hàng')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đăng nhập ngay/i })).toBeInTheDocument();
  });
});
