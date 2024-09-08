import {fireEvent, screen} from '@testing-library/react';
import LoginTab from "./LoginTab";
import {dispatchLogIn} from "./LoginTab";
import {render} from "../../../test/utils/test-utils";
import '@testing-library/jest-dom'
import * as LoginData from "../../../test/jest/data/loginData";
import {userActions} from "../../reducers/user";

const initialState = {
	appReducer: {
		appVersion: '1.0.0',
	},
};

test('renders username input', () => {
	render(<LoginTab />, { initialState });

	const usernameInput = screen.getByTestId('username');
	expect(usernameInput).toBeInTheDocument();
});

test ('username input is visible', () => {
	render(<LoginTab />, { initialState });

	const usernameInput = screen.getByTestId('username');
	expect(usernameInput).toBeVisible();
});

test('username input is not disabled', () => {
	render(<LoginTab />, { initialState });

	const usernameInput = screen.getByTestId('username');
	expect(usernameInput).not.toBeDisabled();
});

test('username input should initially be empty', () => {
	render(<LoginTab />, { initialState });

	const usernameInput = screen.getByTestId('username');
	expect(usernameInput).toHaveValue('');
});

test('username input should change value when user types', () => {
	render(<LoginTab />, { initialState });

	const usernameInput = screen.getByTestId('username');
	fireEvent.change(usernameInput, {target: {value: LoginData.USERNAME_ADMIN}});
	expect(usernameInput.value).toBe(LoginData.USERNAME_ADMIN);
});

test('login button should be visible', () => {
	render(<LoginTab />, { initialState });

	const loginButton = screen.getByTestId('login-button');
	expect(loginButton).toBeVisible();
});

test('login button should not be disabled', () => {
	render(<LoginTab />, { initialState });

	const loginButton = screen.getByTestId('login-button');
	expect(loginButton).not.toBeDisabled();
});


jest.mock('../../reducers/user', () => ({
	userActions: {
		login: jest.fn()
	}
}));
test('login button should check for username and password before submtiting', () => {
	render(<LoginTab />, { initialState });

	const loginButton = screen.getByTestId('login-button');
	const usernameInput = screen.getByTestId('username');
	const passwordInput = screen.getByTestId('password');

	fireEvent.click(loginButton);

	expect(usernameInput).toHaveValue('');
	expect(passwordInput).toHaveValue('');
	expect(userActions.login).not.toHaveBeenCalled();
});

test('login button should not be called if username is empty', () => {
	render(<LoginTab />, { initialState });

	const loginButton = screen.getByTestId('login-button');
	const passwordInput = screen.getByTestId('password');

	fireEvent.change(passwordInput, {target: {value: LoginData.PASSWORD_ADMIN}});
	fireEvent.click(loginButton);

	expect(userActions.login).not.toHaveBeenCalled();
});

test('login button should not be called if password is empty', () => {
	render(<LoginTab />, { initialState });

	const loginButton = screen.getByTestId('login-button');
	const usernameInput = screen.getByTestId('username');

	fireEvent.change(usernameInput, {target: {value: LoginData.USERNAME_ADMIN}});
	fireEvent.click(loginButton);

	expect(userActions.login).not.toHaveBeenCalled();
});

test('missing username should have error', () => {
	render(<LoginTab />, { initialState });

	const usernameInput = screen.getByTestId('username');
	const loginButton = screen.getByTestId('login-button');

	fireEvent.change(usernameInput, { target: { value: '' } });
	fireEvent.click(loginButton);

	expect(usernameInput.closest('.MuiFormControl-root')).not.toHaveClass('Mui-error');
});

test('missing password should have error', () => {
	render(<LoginTab />, { initialState });

	const passwordInput = screen.getByTestId('password');
	const loginButton = screen.getByTestId('login-button');

	fireEvent.change(passwordInput, { target: { value: '' } });
	fireEvent.click(loginButton);

	expect(passwordInput.closest('.MuiFormControl-root')).not.toHaveClass('Mui-error');
});

test('renders password input', () => {
	render(<LoginTab />, { initialState });

	const usernameInput = screen.getByTestId('password');
	expect(usernameInput).toBeInTheDocument();
});

test ('password input is visible', () => {
	render(<LoginTab />, { initialState });

	const usernameInput = screen.getByTestId('password');
	expect(usernameInput).toBeVisible();
});

test('password input is not disabled', () => {
	render(<LoginTab />, { initialState });

	const usernameInput = screen.getByTestId('password');
	expect(usernameInput).not.toBeDisabled();
});

test('password input should initially be empty', () => {
	render(<LoginTab />, { initialState });

	const usernameInput = screen.getByTestId('password');
	expect(usernameInput).toHaveValue('');
});

test('password input should change value when user types', () => {
	render(<LoginTab />, { initialState });

	const usernameInput = screen.getByTestId('password');
	fireEvent.change(usernameInput, {target: {value: LoginData.PASSWORD_ADMIN}});
	expect(usernameInput.value).toBe(LoginData.PASSWORD_ADMIN);
});
