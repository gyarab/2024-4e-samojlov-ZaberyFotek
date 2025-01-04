import React, {useEffect, useState} from "react";
import {
    CloseButton, PopupCheckboxContainer,
    PopupFooter,
    PopupHeader, PopupInput, PopupStyledCheckbox,
    PopupTitle
} from "./PopUpComponents";
import Popup from "reactjs-popup";
import {Button, ErrorMessage, Label} from "../../pages/Prihlaseni/LoginComponents";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

/** Hlavní komponenta vstupujícího okna **/
const PopUpComponent = ({open, closeModal, userData, type}) => {

    const [input, setInput] = useState(userData?.email);
    const [inputError, setInputError] = useState('');

    // Aktuální hodnota pro element Checkbox
    const [isChecked, setIsChecked] = useState(false);

    /** Uložení aktuální hodnoty pro element Checkbox **/
    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const getType = (type === 'username');

    console.log(userData);

    useEffect(() => {

        if (getType) {
            setInput(userData?.username);
        } else {
            setInput(userData?.email);
        }
    }, [getType, userData]);

    // Přesměrování uživatele
    const navigate = useNavigate();

    const handleSubmit = () => {

        // Změna údajů uživatele nebo smazání účtu
        axios.post('http://localhost:4000/auth/changePersonalData', {
            type: type,
            username: userData?.name,
            email: userData?.email,
            inputData: input
        })
            .then(res => {
                if (res.data.validation) {

                    toast.success(res.data.message);

                    if (type === 'deleteAccount') {

                        navigate('/prihlaseni', {
                            state: { successMessage: res.data.message },
                        });

                    } else {

                        let newData = {};

                        if (getType) {

                            newData = {
                                ...userData,
                                name: input
                            };

                        } else {

                            newData = {
                                ...userData,
                                email: input
                            };
                        }

                        localStorage.setItem("user", JSON.stringify(newData));
                    }

                    closeModal();
                }
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.errors) {
                    const errors = err.response.data.errors;

                    errors.forEach(error => {
                        if (error.field === type) {
                            setInputError(error.message);
                        }
                    });

                } else {
                    toast.error(err.response?.data?.message || 'Někde nastala chyba');
                }
            });
    }

    return (

        <Popup
            open={open}
            modal
            contentStyle={{
                width: '400px',
                background: '#fff',
                borderRadius: '8px',
                padding: '30px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            }}
        >
            {type !== 'deleteAccount' ? <div><PopupHeader>
                    <PopupTitle>{getType ? 'Změnit jméno' : 'Změna e-mailové adresy'}</PopupTitle>
                    <CloseButton onClick={closeModal}>&times;</CloseButton>
                </PopupHeader>

                    <PopupInput value={input}
                                onChange={(e) => {
                                    setInputError('');
                                    setInput(e.target.value);
                                }} id="name" type="text"
                                placeholder={getType ? 'Zadejte nové jméno' : 'Zadejte nový email'}/>

                    {inputError && <ErrorMessage>{inputError}</ErrorMessage>}

                    <PopupFooter>
                        <Button style={{
                            width: '100px',
                            background: 'var(--color-shadow-2)',
                            color: 'black'
                        }}
                                onClick={closeModal}

                        >Zrušit
                        </Button>

                        <Button onClick={handleSubmit} style={{width: '100px'}}>Uložit</Button>
                    </PopupFooter></div> :


                <div><PopupHeader>
                    <PopupTitle>Smazání účtu</PopupTitle>
                    <CloseButton onClick={closeModal}>&times;</CloseButton>
                </PopupHeader>

                    <p style={{color: 'var(--color-shadow-7)', lineHeight: '1.5', fontSize: '16px'}}>Jste si jisti, že
                        chcete smazat svůj účet? <br/> Smazání účtu odstraní všechna vaše
                        přidružená data trvale. Tuto operaci nelze vrátit zpět. </p>

                    <PopupCheckboxContainer>
                        <PopupStyledCheckbox type="checkbox"
                                             checked={isChecked}
                                             onChange={handleCheckboxChange}/>
                        <Label style={{color: 'var(--color-shadow-6)', lineHeight: '1.5', fontSize: '14px'}}>Souhlasím se smázáním účtu</Label>
                    </PopupCheckboxContainer>

                    {inputError && <ErrorMessage>{inputError}</ErrorMessage>}

                    <PopupFooter>
                        <Button style={{
                            width: '100px',
                            background: 'var(--color-shadow-2)',
                            color: 'black'
                        }}
                                onClick={closeModal}

                        >Zrušit
                        </Button>

                        <Button disabled={!isChecked} onClick={handleSubmit} style={{width: '100px', background: isChecked ? '#d9534f' : '#ffbab9'}}>Potvrdit</Button>
                    </PopupFooter></div>}

        </Popup>
    );
};

export default PopUpComponent;