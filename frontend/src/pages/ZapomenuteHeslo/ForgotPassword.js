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
import {useNavigate} from "react-router-dom";

/** Hlavní komponenta Login formuláře **/
function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const navigate = useNavigate();

    /** Funkce pro zpracování přihlášení **/
    const handleForgotPassword = (e) => {
        e.preventDefault();

        setEmailError('');
        //setOTPcodeError('');

        // Odstranění volného místa za posledním znakem
        const trimmedEmail = email.trim();

        // API volání pro validaci přihlašovacích údajů
        axios.post('http://localhost:4000/auth/validateForgotPassword', {
            email: trimmedEmail,
        })
            .then(res => {
                if (res.data.validation) {

                    navigate('/zapomenute-heslo/reset', {
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
                        }
                    });
                } else if (err.response?.status === 409) {

                    // Email není registrovaný
                    setEmailError(err.response.data.message);

                } else {

                    toast.error(err.response?.data?.message || 'Nastala chyba. Zkuste to znovu později');
                }
            });

        // if (emailSent && originalOTP !== parseInt(OTPcode)) {
        //
        //     console.log(originalOTP, OTPcode)
        //     setOTPcodeError('Váš zadaný kód je nesprávný');
        // }
        //
        // const passwordCheck = emailSent && (password !== newPassword);
        //
        // if (passwordCheck) {
        //
        //     toast.error('Zadaná hesla nejsou shodná');
        // }
        //
        // if (OTPcodeError && !passwordCheck) {
        //
        //     toast.success('Vaše heslo bylo úspěšně změněno');
        //     navigate("/prihlaseni");
        // }
    };

    return (
        <Container>
            <FormWrapper>
                <Title>Zapomenuté heslo</Title>
                <form onSubmit={handleForgotPassword}>
                    <SignUpLink>{

                        "Pro obnovení hesla vyplňte email, na který obdržíte odkaz pro obnovení hesla"}
                    </SignUpLink>

                    <InputWrapper>
                        <Label>Email</Label>
                        <Input
                            type="text"
                            value={email}
                            onChange={(e) => {
                                setEmailError('');
                                setEmail(e.target.value)
                            }}
                            placeholder="Např: example@email.cz"
                        />
                        {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                    </InputWrapper>

                    {/*{emailSent &&*/}

                    {/*        <InputWrapper style={{marginTop: '15px'}}>*/}
                    {/*            <Label>Kód z e-mailu</Label>*/}
                    {/*            <Input*/}
                    {/*                type="text"*/}
                    {/*                value={OTPcode}*/}
                    {/*                onChange={(e) => {*/}
                    {/*                    setOTPcodeError('');*/}
                    {/*                    setOTPcode(e.target.value);*/}
                    {/*                }}*/}
                    {/*                placeholder="Např: 123456"*/}
                    {/*            />*/}
                    {/*            {OTPcodeError && <ErrorMessage>{OTPcodeError}</ErrorMessage>}*/}
                    {/*        </InputWrapper>*/}

                    {/*        <InputWrapper>*/}
                    {/*            <Label>Nové heslo</Label>*/}
                    {/*            <Input*/}
                    {/*                type="password"*/}
                    {/*                value={password}*/}
                    {/*                onChange={(e) => {*/}
                    {/*                    setPassword(e.target.value)*/}
                    {/*                }}*/}
                    {/*                placeholder="Např: aBc#0xYz"*/}
                    {/*            />*/}
                    {/*        </InputWrapper>*/}

                    {/*        <InputWrapper>*/}
                    {/*            <Label>Opakujte nové heslo</Label>*/}
                    {/*            <Input*/}
                    {/*                type="password"*/}
                    {/*                value={newPassword}*/}
                    {/*                onChange={(e) => {*/}
                    {/*                    setNewPassword(e.target.value)*/}
                    {/*                }}*/}
                    {/*                placeholder="Opakujte heslo zadané výše"*/}
                    {/*            />*/}
                    {/*        </InputWrapper>*/}

                    {/*}*/}

                    <Button type="submit">{"Odeslat"} <p>→</p></Button>
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