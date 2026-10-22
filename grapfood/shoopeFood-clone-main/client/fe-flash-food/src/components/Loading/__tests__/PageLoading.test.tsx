import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageLoading } from '../PageLoading';

describe('PageLoading Component', () => {
  it('should render loading container and custom message', () => {
    render(<PageLoading message="Đang tải dữ liệu test..." />);

    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
    expect(screen.getByText('Đang tải dữ liệu test...')).toBeInTheDocument();
  });
});
