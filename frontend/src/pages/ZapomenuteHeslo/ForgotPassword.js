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
import {Bounce, toast, ToastContainer} from "react-toastify";

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

        // Odstranění volného místa za posledním znakem
        const trimmedEmail = email.trim();

        axios.post('http://localhost:4000/validateForgotPassword', { email: trimmedEmail })
            .then(res => {

                if (res.data.validation) {

                    toast.success("Zpráva s odkazem pro obnovení hesla byla právě odeslána na váš email");
                }

            })
            .catch(err => {

                if (err.response) {
                    setEmailError(err.response.data.message || 'Nastala chyba. Zkuste to znovu později');
                } else {
                    setEmailError('Nelze se připojit k serveru. Zkontrolujte své připojení');
                }
            });
    };

    return (
        <Container>
            <FormWrapper>
                <Title>Zapomenuté heslo</Title>
                <form onSubmit={handleLogin}>
                    <SignUpLink>Pro obnovení hesla vyplňte email, na který obdržíte odkaz pro obnovení
                        hesla</SignUpLink>
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

export default ForgotPassword;