import { useState } from "react";
import axios from "axios";
import {
    Button,
    Container,
    ErrorMessage,
    ForgotPassword,
    FormWrapper,
    Input,
    InputWrapper,
    Label, Subtitle,
    Title
} from "./LoginComponents";

/** Hlavní komponenta Login formuláře **/
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    /** Funkce pro zpracování přihlášení **/
    const handleLogin = (e) => {
        e.preventDefault();

        // Simple validation logic for both fields
        if (!username || !password) {
            setError('Both fields are required!');
            return; // Prevent submission if validation fails
        } else {
            setError(''); // Clear error if both fields are filled
        }

        // API volání pro validaci přihlašovacích údajů
        axios.post('http://localhost:4000/validatePassword', { username, password })
            .then(res => {

                if (res.status === 200) {
                    alert('Your password is correct, Thank you for your service');
                } else {
                    alert('Your password is not correct. Please try again');
                }
            })
            .catch(err => {
                console.error("There was an error with the request", err);
                if (err.response && err.response.status === 401) {
                    alert('Invalid username or password');
                } else {
                    alert('An error occurred. Please try again later.');
                }
            });
    };

    return (
        <Container>
            <FormWrapper>
                <Title>Log in</Title>
                <Subtitle>to start learning</Subtitle>
                <form onSubmit={handleLogin}>
                    <InputWrapper>
                        <Label>Username</Label>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </InputWrapper>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <ForgotPassword href="#">Forgot password?</ForgotPassword>
                    <Button type="submit">Log in →</Button>
                </form>
            </FormWrapper>
        </Container>
    );
}

export default Login;