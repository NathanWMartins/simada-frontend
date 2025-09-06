import { render, screen } from '@testing-library/react';
import { Logo } from './components/common';

test('renders SIMADA logo', () => {
  render(<Logo />);
  const logoElement = screen.getByAltText(/SIMADA Logo/i);
  expect(logoElement).toBeInTheDocument();
});
