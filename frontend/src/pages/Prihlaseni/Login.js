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

        // Odstranění volného místa za posledním znakem
        const trimmedEmail = email.trim();

        // API volání pro validaci přihlašovacích údajů
        axios.post('http://localhost:4000/auth/loginUser', {
            email: trimmedEmail,
            password: password
        })
            .then(res => {
                if (res.data.validation) {
                    toast.success(res.data.message);
                }
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.errors) {

                    const errors = err.response.data.errors;

                    errors.forEach(error => {
                        if (error.field === 'email') {
                            setEmailError(error.message);
                        } else if (error.field === 'password') {
                            setPasswordError(error.message);
                        }
                    });
                } else if (err.response.status === 401){

                    // Neplatné údaje
                    toast.error(err.response.data.message);

                } else {
                    toast.error('Nastala chyba. Zkuste to znovu později');
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