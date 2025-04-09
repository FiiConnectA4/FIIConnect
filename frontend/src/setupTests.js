// src/setupTests.js
import '@testing-library/jest-dom'; // Adds custom Jest matchers like toBeInTheDocument

// Mock ThemeContext for components using useTheme
import { ThemeProvider, useTheme } from './app/ThemeContext';

jest.mock('./app/ThemeContext', () => ({
    ThemeProvider: ({ children }) => <div>{children}</div>, // Simple mock for ThemeProvider
    useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }), // Default mock for useTheme
}));