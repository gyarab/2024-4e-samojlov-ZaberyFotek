import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Button,
    Container,
    ErrorMessage,
    ForgotPassword,
    FormWrapper,
    Input,
    InputWrapper,
    Label, SignUpLink,
    Title
} from "./LoginComponents";
import {Bounce, toast, ToastContainer} from "react-toastify";

/** Hlavní komponenta Login formuláře **/
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    /** Resetování chybových hlášení **/
    useEffect(() => {
        if (email) setEmailError('');
        if (password) setPasswordError('');
    }, [email, password]);

    /** Funkce pro zpracování přihlášení **/
    const handleLogin = (e) => {
        e.preventDefault();

        setEmailError('');
        setPasswordError('');

        // Validace emailu při submitu
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setEmailError('Prosím, zadejte platnou emailovou adresu');
            return;
        }

        // Kontrola hesla
        if (!password) {
            setPasswordError('Heslo je povinné');
            return;
        }

        if (!emailError && !passwordError) {
            toast.success("Přihlášení proběhlo úspěšně!");
        }

        // API volání pro validaci přihlašovacích údajů
        axios.post('http://localhost:4000/validatePassword', { email, password })
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
                <Title>Přihlášení</Title>
                <form onSubmit={handleLogin}>
                    <InputWrapper>
                        <Label>Email</Label>
                        <Input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Např: example@email.cz"
                        />
                        {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                    </InputWrapper>

                    <InputWrapper>
                        <Label>Heslo</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Např: aBc#0xYz"
                        />
                        {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                    </InputWrapper>

                    <ForgotPassword href="/zapomenute-heslo">Zapomněli jste heslo?</ForgotPassword>
                    <Button type="submit">Přihlásit se <p>→</p></Button>
                    <SignUpLink href="/registrace">Nemáte zatím účet? <b>Zaregistrujte se </b></SignUpLink>
                </form>
            </FormWrapper>

            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}

            />
        </Container>
    );
}

export default Login;