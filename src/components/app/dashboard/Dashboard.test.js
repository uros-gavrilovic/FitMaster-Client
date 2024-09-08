import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Dashboard } from './Dashboard';
import TotalMembersCard from './cards/TotalMembersCard';
import '@testing-library/jest-dom'

jest.mock('./cards/TotalMembersCard', () => {
	return function MockTotalMembersCard() {
		return <div data-testid="total-members-card">Total Members Card</div>;
	};
});

jest.mock('../../../utils/HighOrderComponent', () => {
	return function mockWithTranslations(Component) {
		return function MockWrappedComponent(props) {
			return <Component t={{ messages: { welcome_back: 'Welcome back' } }} {...props} />;
		};
	};
});

const mockStore = configureStore([]);

describe('Dashboard', () => {
	let store;

	beforeEach(() => {
		store = mockStore({
			userReducer: {
				user: {
					firstName: 'John',
				},
			},
		});
	});

	it('renders the welcome message with the user\'s first name', () => {
		render(
			<Provider store={store}>
				<Dashboard />
			</Provider>
		);

		const welcomeMessage = screen.getByText(/John/);
		expect(welcomeMessage).toBeInTheDocument();
	});

	it('renders 5 TotalMembersCard components', () => {
		render(
			<Provider store={store}>
				<Dashboard />
			</Provider>
		);

		const cards = screen.getAllByTestId('total-members-card');
		expect(cards).toHaveLength(5);
	});

	it('applies the correct styles to the card container', () => {
		render(
			<Provider store={store}>
				<Dashboard />
			</Provider>
		);

		const container = screen.getByText(/John/).nextElementSibling;
		expect(container).toHaveStyle({
			display: 'grid',
			padding: '2em',
			gap: '1em',
			gridTemplateColumns: 'repeat(auto-fit, minmax(20vw, 1fr))',
			maxWidth: '70vw',
		});
	});
});
