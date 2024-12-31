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

/** Hlavní komponenta Registration formuláře **/
function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    /** Resetování chybových hlášení při změně hodnoty polí **/
    useEffect(() => {
        if (username) setUsernameError('');
        if (email) setEmailError('');
        if (password) setPasswordError('');
    }, [username, email, password]);

    /** Funkce pro zpracování registrace **/
    const handleSignUp = (e) => {
        e.preventDefault();

        // Vymazání chybových hlášení, pokud nějaké existují
        setUsernameError('');
        setEmailError('');
        setPasswordError('');

        // Počet slov ve vstupu Username
        const usernameWords = username.trim().split(/\s+/);

        if (!username || usernameWords < 2) {
            setUsernameError('Uživatelské jméno musí obsahovat jméno a příjmení');
            return;
        }

        // Validace emailu při submitu
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setEmailError('Prosím, zadejte platnou emailovou adresu');
            return;
        }

        if (!password) {
            setPasswordError('Heslo je povinné');
            return;
        }

        if (!usernameError && !emailError && !passwordError) {

            toast.success("Registrace proběhla úspěšně!");
        }


        // API volání pro registraci uživatele (odkomentujte po testování)
        // axios.post('http://localhost:4000/register', { username, email, password })
        //     .then(res => {
        //         if (res.status === 200) {
        //             alert('Registrace byla úspěšná!');
        //         } else {
        //             alert('Nastala chyba při registraci');
        //         }
        //     })
        //     .catch(err => {
        //         console.username("There was an username with the request", err);
        //         alert('Došlo k chybě. Zkuste to znovu později.');
        //     });
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
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Např: Pan X"
                        />

                        {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
                    </InputWrapper>

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
                            placeholder="Např: aBc#12x"
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
