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
import {redirect, useLocation, useNavigate} from "react-router-dom";

/** Hlavní komponenta Login formuláře **/
function ResetPassword() {

    const [OTPcode, setOTPcode] = useState('');
    const [OTPcodeError, setOTPcodeError] = useState('');

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {

        if (location.state?.successMessage) {
            toast.success(location.state.successMessage);
        }
    }, [location.state]);

    /** Funkce pro zpracování přihlášení **/
    const handleLogin = (e) => {
        e.preventDefault();

        setOTPcodeError('');

        // API volání pro resetování hesla
        axios.post('http://localhost:4000/auth/resetPassword', {
            otpInput: OTPcode, password1: password, password2: newPassword
        })
            .then(res => {
                if (res.data.validation) {

                    navigate('/prihlaseni', {
                        state: { successMessage: res.data.message },
                    });
                }
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.errors) {

                    const errors = err.response.data.errors;

                    errors.forEach(error => {
                        if (error.field === 'otp') {
                            setOTPcodeError(error.message);
                        }
                    });
                } else if (err.response?.status === 409) {

                    // Neplatné údaje
                    setOTPcodeError(err.response.data.message);

                } else {

                    toast.error(err.response.data.message || 'Nastala chyba. Zkuste to znovu později');
                }
            });
    };

    return (
        <Container>
            <FormWrapper>
                <Title>Zapomenuté heslo</Title>
                <form onSubmit={handleLogin}>
                    <SignUpLink>{
                        "Prosím, zkontrolujte si svoji e-mailovou schránku"}
                    </SignUpLink>

                            <InputWrapper style={{marginTop: '15px'}}>
                                <Label>Kód z e-mailu</Label>
                                <Input
                                    type="text"
                                    value={OTPcode}
                                    onChange={(e) => {
                                        setOTPcodeError('');
                                        setOTPcode(e.target.value);
                                    }}
                                    placeholder="Např: 123456"
                                />
                                {OTPcodeError && <ErrorMessage>{OTPcodeError}</ErrorMessage>}
                            </InputWrapper>

                            <InputWrapper>
                                <Label>Nové heslo</Label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                    placeholder="Např: aBc#0xYz"
                                />
                            </InputWrapper>

                            <InputWrapper>
                                <Label>Opakujte nové heslo</Label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value)
                                    }}
                                    placeholder="Opakujte heslo zadané výše"
                                />
                            </InputWrapper>

                    <Button type="submit">{"Potvrdit"} <p>→</p></Button>
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

export default ResetPassword;