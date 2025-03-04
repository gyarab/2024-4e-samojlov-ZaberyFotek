import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Button,
    Container,
    ErrorMessage,
    FormWrapper,
    Input,
    InputWrapper,
    Label,
    SignUpLink,
    Title
} from "../Prihlaseni/LoginComponents";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";

/** Hlavní komponenta Registration formuláře **/
function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    /** Funkce pro zpracování registrace **/
    const handleSignUp = (e) => {
        e.preventDefault();

        // Vymazání chybových hlášení, pokud nějaké existují
        setUsernameError('');
        setEmailError('');
        setPasswordError('');

        // Odstranění volného místa za posledním znakem
        const trimmedEmail = email.trim();

        axios.post('http://localhost:4000/auth/registerUser', {
            username: username,
            email: trimmedEmail,
            password: password,
            type: 'default',
            image: null
        })
            .then(res => {
                if (res.data.validation) {

                    localStorage.setItem('user', JSON.stringify(res.data?.user));

                    navigate('/ucet', {
                        state: { successMessage: res.data.message },
                    });
                }
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.errors) {

                    const errors = err.response.data.errors;

                    errors.forEach(error => {
                        if (error.field === 'username') {
                            setUsernameError(error.message);
                        } else if (error.field === 'email') {
                            setEmailError(error.message);
                        } else if (error.field === 'password') {
                            setPasswordError(error.message);
                        }
                    });
                } else if (err.response?.status === 409){

                    // Email již existuje
                    setEmailError(err.response.data.message);

                } else {
                    toast.error('Nastala chyba. Zkuste to znovu později');
                }
            });
    };
    return (
        <Container>
            <FormWrapper>
                <Title>Registrace</Title>
                <form onSubmit={handleSignUp}>
                    <InputWrapper>
                        <Label>Uživatelské jméno</Label>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsernameError('');
                                setUsername(e.target.value);
                            }}
                            placeholder="Např: Pan X"
                        />

                        {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
                    </InputWrapper>

                    <InputWrapper>
                        <Label>Email</Label>
                        <Input
                            type="text"
                            value={email}
                            onChange={(e) => {
                                setEmailError('');
                                setEmail(e.target.value);
                            }}
                            placeholder="Např: example@email.cz"
                        />
                        {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                    </InputWrapper>

                    <InputWrapper>
                        <Label>Heslo</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPasswordError('');
                                setPassword(e.target.value);
                            }}
                            placeholder="Např: aBc#0xYz"
                        />

                        {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                    </InputWrapper>

                    <Button type="submit">Zaregistrovat se<p>→</p></Button>

                    <SignUpLink href="/prihlaseni">Máte již účet? <b>Přihlaste se</b></SignUpLink>
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

export default SignUp;
