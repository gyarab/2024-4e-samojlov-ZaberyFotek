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
import {useLocation} from "react-router-dom";
import {useGoogleLogin} from "@react-oauth/google";

/** Hlavní komponenta Login formuláře **/
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Google OAuth
    //const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);

    const location = useLocation();

    let trimmedEmail;

    const  signIn = useGoogleLogin({
        onSuccess: (codeResponse) => {
            console.log("Google login successful");
            const accessToken = codeResponse.access_token;

            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/json',
                    },
                })
                .then((res) => {
                    console.log('User profile fetched from Google:', res.data);
                    const googleEmail = res.data.email;
                    setEmail(googleEmail);
                    setProfile(res.data);
                    toast.success('Google login successful!');
                })
                .catch((err) => {
                    console.log('Error fetching Google profile:', err);
                    toast.error('Failed to fetch Google profile');
                });
        },
        onError: (error) => {
            console.log('Login Failed:', error);
            toast.error('Login failed. Please try again.');
        },
    });

    /** Resetování chybových hlášení **/
    useEffect(() => {
        if (location.state?.successMessage) {
            toast.success(location.state.successMessage);
        }

        if (email) {
            trimmedEmail = email.trim();

            axios
                .get(`http://localhost:4000/auth/register`, {
                    username: '',
                    email: trimmedEmail,
                    password: ''
                })
                .then((res) => {
                    if (res.data.validation) {
                        console.log("VŠECHNO DOBRY")
                    }
                })
                .catch(err => {

                    toast.error(err.response.data.message || 'Nastala chyba. Zkuste to znovu později');
                });
        }
    }, [location.state, email]);

    /** Funkce pro zpracování běžného přihlášení **/
    const handleDefaultLogin = (e) => {
        e.preventDefault();

        console.log("AHAHAHA")

        setEmailError('');
        setPasswordError('');

        trimmedEmail = email.trim();

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
                <GoogleButton onClick={

                    signIn}>
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
