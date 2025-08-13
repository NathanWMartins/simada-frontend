import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SIMADA logo', () => {
  render(<App />);
  const logoElement = screen.getByAltText(/SIMADA Logo/i);
  expect(logoElement).toBeInTheDocument();
});
