// test-utils.js
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import configureStore from 'redux-mock-store';
import theme from '../../src/styles/themes/darkTheme';

const mockStore = configureStore();

const testUtils = (ui, { initialState, store = mockStore(initialState), ...renderOptions } = {}) => {
	const Wrapper = ({ children }) => (
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				{children}
			</ThemeProvider>
		</Provider>
	);

	return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { testUtils as render };
