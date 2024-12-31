import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Button,
    Container,
    ErrorMessage,
    FormWrapper,
    Input,
    InputWrapper,
    Label, SignUpLink,
    Title
} from "../Prihlaseni/LoginComponents";

/** Hlavní komponenta Login formuláře **/
function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    /** Resetování chybových hlášení **/
    useEffect(() => {
        if (email) setEmailError('');
    }, [email]);

    /** Funkce pro zpracování přihlášení **/
    const handleLogin = (e) => {
        e.preventDefault();

        setEmailError('');

        // Validace emailu při submitu
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
            setEmailError('Prosím, zadejte platnou emailovou adresu');
        }

        // // API volání pro validaci přihlašovacích údajů
        // axios.post('http://localhost:4000/validatePassword', { username: email, password })
        //     .then(res => {
        //         if (res.status === 200) {
        //             alert('Your password is correct, Thank you for your service');
        //         } else {
        //             alert('Your password is not correct. Please try again');
        //         }
        //     })
        //     .catch(err => {
        //         console.error("There was an error with the request", err);
        //         if (err.response && err.response.status === 401) {
        //             alert('Invalid username or password');
        //         } else {
        //             alert('An error occurred. Please try again later.');
        //         }
        //     });
    };

    return (
        <Container>
            <FormWrapper>
                <Title>Zapomenuté heslo</Title>
                <form onSubmit={handleLogin}>
                    <SignUpLink>Pro obnovení hesla vyplňte email, na který obdržíte odkaz pro obnovení hesla</SignUpLink>
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

                    <Button type="submit">Odeslat <p>→</p></Button>
                    <SignUpLink href="/registrace">Nemáte zatím účet? <b>Zaregistrujte se </b></SignUpLink>
                </form>
            </FormWrapper>
        </Container>
    );
}

export default ForgotPassword;