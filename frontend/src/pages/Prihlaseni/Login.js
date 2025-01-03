import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Button,
    Container, Divider,
    ErrorMessage,
    ForgotPassword,
    FormWrapper, GoogleButton,
    Input,
    InputWrapper,
    Label, SignUpLink,
    Title
} from "./LoginComponents";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {useLocation, useNavigate} from "react-router-dom";
import {useGoogleLogin} from "@react-oauth/google";

/** Hlavní komponenta Login formuláře **/
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Uchování přihlášeného uživatele
    const [user, setUser] = useState(null);

    // Přesměrování uživatele
    const navigate = useNavigate();

    // Aktuální route
    const location = useLocation();

    let trimmedEmail;

    // Inicializace přihlášení přes Google
    const signIn = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log("Přihlášení přes Google bylo úspěšné");
            const accessToken = codeResponse.access_token; // Získání přístupového tokenu

            // Získání informací o uživateli z Google API
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/json',
                    },
                })
                .then((res) => {
                    const googleData = res.data;

                    // Ověření uživatele nebo jeho registrace na backendu
                    axios
                        .post(`http://localhost:4000/auth/registerUser`, {
                            username: googleData.name,
                            email: googleData.email,
                            password: '-1',
                            type: 'google',
                            image: res.data.picture

                        })
                        .then((res) => {
                            if (res.data.validation) {
                                setUser(googleData);
                                // Serializace dat uživatele
                                localStorage.setItem('user', JSON.stringify(googleData));

                                navigate('/ucet', {
                                    state: { successMessage: res.data.message },
                                });
                            }
                        })
                        .catch(err => {
                            // Zobrazení chyby, pokud nastane problém na backendu
                            toast.error(err.response?.data?.message || 'Nastala chyba. Zkuste to znovu později');
                        });
                })
                .catch((err) => {
                    // Zpráva o selhání
                    toast.error('Nepodařilo se načíst profil z Google');
                });
        },
        onError: (error) => {
            toast.error('Přihlášení se nezdařilo. Zkuste to prosím znovu.');
        },
    });

    /** Zobrazení oznámení **/
    useEffect(() => {
        if (location.state?.successMessage) {
            toast.success(location.state.successMessage);
        }

        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            try {
                const foundUser = JSON.parse(loggedInUser); // Deserializace dat uživatele
                setUser(foundUser);
            } catch (e) {
                console.error("Chyba při parsování uživatelských dat z localStorage:", e);
            }
        }

    }, [location.state]);

    /** Funkce pro zpracování běžného přihlášení **/
    const handleDefaultLogin = (e) => {
        e.preventDefault();

        setEmailError('');
        setPasswordError('');

        trimmedEmail = email.trim();

        // Výchozí přihlášení
        axios.post('http://localhost:4000/auth/loginUser', {
            email: trimmedEmail,
            password: password
        })
            .then(res => {
                if (res.data.validation) {
                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data)); // Serializace dat uživatele

                    navigate('/ucet', {
                        state: { successMessage: res.data.message },
                    });
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
                } else if (err.response.status === 401) {
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
                <form onSubmit={handleDefaultLogin}>
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

                    <ForgotPassword href="/zapomenute-heslo">Zapomněli jste heslo?</ForgotPassword>
                    <Button type="submit">Přihlásit se <p>→</p></Button>

                </form>
                <Divider>NEBO</Divider>
                <GoogleButton onClick={signIn}>
                    Pokračovat přes Google
                </GoogleButton>

                <SignUpLink href="/registrace">Nemáte zatím účet? <b>Zaregistrujte se </b></SignUpLink>
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
