import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const Hello = ({ name }) => <p>Hello, {name}!</p>;

test('renders Hello component', () => {
  render(<Hello name="Subhajit" />);
  screen.debug(); // 👈 This will print the rendered DOM
  expect(screen.getByText('Hello, Subhajit!')).toBeInTheDocument();
});