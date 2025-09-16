import { render, screen } from '@testing-library/react';
import { Logo } from './components/common';

test('renders WIKO logo', () => {
  render(<Logo />);
  const logoElement = screen.getByAltText(/SIMADA Logo/i);
  expect(logoElement).toBeInTheDocument();
});
