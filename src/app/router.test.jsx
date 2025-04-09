const { render, screen } = require('@testing-library/react');
const Router = require('./Router'); // Adjust the import based on your actual Router component path

test('renders router component', () => {
	render(<Router />);
	const linkElement = screen.getByText(/router/i); // Adjust the text based on your Router component
	expect(linkElement).toBeInTheDocument();
});