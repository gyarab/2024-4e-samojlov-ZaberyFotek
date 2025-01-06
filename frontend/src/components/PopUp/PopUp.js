import React, {useEffect, useState} from "react";
import {
    ActionButton,
    ActionButtonGroup,
    CardContent,
    ClipSection,
    CloseButton,
    EditableTitle,
    FileMetaInfo,
    Loader,
    PopupCheckboxContainer,
    PopupFooter,
    PopupHeader,
    PopupInput,
    PopupStyledCheckbox,
    PopupTitle,
    ProjectDescriptionInput
} from "./PopUpComponents";
import Popup from "reactjs-popup";
import {Button, ErrorMessage, Label} from "../../pages/Prihlaseni/LoginComponents";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

/** Hlavní komponenta vstupujícího okna **/
const PopUpComponent = ({
                            open, closeModal, userData, type, blur, width, handleDownload, clipReady,
                            setIsPlaying, setDownloadBtn, stop, link, chunks, setSuccess
                        }) => {

    const [input, setInput] = useState(userData?.email);
    const [inputError, setInputError] = useState('');

    // Aktuální hodnota pro element Checkbox
    const [isChecked, setIsChecked] = useState(false);

    const [title, setTitle] = useState("Nový projekt");
    const [description, setDescription] = useState("");

    /** Uložení aktuální hodnoty pro element Checkbox **/
    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    console.log(clipReady, "SHHHHHHHHHHHHHHH")

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
            username: userData?.username,
            email: userData?.email,
            inputData: input
        })
            .then(res => {
                if (res.data.validation) {

                    toast.success(res.data.message);

                    if (type === 'deleteAccount') {

                        localStorage.removeItem("user");

                        navigate('/prihlaseni', {
                            state: {successMessage: res.data.message},
                        });

                    } else {

                        let newData = {};

                        if (getType) {

                            newData = {
                                ...userData,
                                username: input
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
            closeOnDocumentClick={false}
            contentStyle={{
                width: width ? width : '400px',
                background: '#fff',
                borderRadius: '8px',
                padding: '30px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            }}
            overlayStyle={{
                ...(blur && {
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(20px)',
                    transition: 'backdrop-filter 0.3s ease',
                }),
            }}
        >
            {type === 'email' || type === 'username' ? (
                <div>
                    <PopupHeader>
                        <PopupTitle>{getType ? 'Změnit jméno' : 'Změna e-mailové adresy'}</PopupTitle>
                        <CloseButton onClick={closeModal}>&times;</CloseButton>
                    </PopupHeader>

                    <PopupInput
                        value={input}
                        onChange={(e) => {
                            setInputError('');
                            setInput(e.target.value);
                        }}
                        id="name"
                        type="text"
                        placeholder={getType ? 'Zadejte nové jméno' : 'Zadejte nový email'}
                    />

                    {inputError && <ErrorMessage>{inputError}</ErrorMessage>}

                    <PopupFooter>
                        <Button
                            style={{
                                width: '100px',
                                background: 'var(--color-shadow-2)',
                                color: 'black',
                            }}
                            onClick={closeModal}
                        >
                            Zrušit
                        </Button>

                        <Button onClick={handleSubmit} style={{width: '100px'}}>
                            Uložit
                        </Button>
                    </PopupFooter>
                </div>
            ) : null}

            {type === 'saveClip' ? (
                <div>

                    <CardContent>

                        <ClipSection>
                            <Loader/>
                        </ClipSection>

                        <EditableTitle
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Jméno projektu"
                        />

                        <FileMetaInfo>172.5 KB / MP4</FileMetaInfo>

                        <ActionButtonGroup>
                            <ActionButton bg="#ff4757" hover="#e84118">Uložit projekt</ActionButton>
                            <ActionButton onClick={() => {
                                if (clipReady) {
                                    handleDownload(title);
                                    setSuccess(false);
                                }

                            }}
                                          disabled={!clipReady}
                                          bg={clipReady ? "var(--home-blue-light)" : "grey"}
                                          hover={clipReady ? "#5aafff" : "grey"}
                                          style={{cursor: clipReady ? "pointer" : "not-allowed"}}>Stáhnout</ActionButton>

                            <ActionButton onClick={() => {
                                closeModal();
                                setIsPlaying(false);
                                setDownloadBtn(false);
                                stop();
                                link(null);
                                chunks.current = [];
                                setSuccess(false);
                            }} bg="#2ed573" hover="#26c96b">Pokračovat</ActionButton>
                        </ActionButtonGroup>

                        <ProjectDescriptionInput
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Zde můžete popsat váš projekt..."
                        />
                    </CardContent>
                </div>
            ) : null}

            {type === 'deleteAccount' ? (
                <div>
                    <PopupHeader>
                        <PopupTitle>Smazání účtu</PopupTitle>
                        <CloseButton onClick={closeModal}>&times;</CloseButton>
                    </PopupHeader>

                    <p style={{color: 'var(--color-shadow-7)', lineHeight: '1.5', fontSize: '16px'}}>
                        Jste si jisti, že chcete smazat svůj účet? <br/> Smazání účtu odstraní všechna vaše
                        přidružená data trvale. Tuto operaci nelze vrátit zpět.
                    </p>

                    <PopupCheckboxContainer>
                        <PopupStyledCheckbox
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        <Label style={{color: 'var(--color-shadow-6)', lineHeight: '1.5', fontSize: '14px'}}>
                            Souhlasím se smazáním účtu
                        </Label>
                    </PopupCheckboxContainer>

                    {inputError && <ErrorMessage>{inputError}</ErrorMessage>}

                    <PopupFooter>
                        <Button
                            style={{
                                width: '100px',
                                background: 'var(--color-shadow-2)',
                                color: 'black',
                            }}
                            onClick={closeModal}
                        >
                            Zrušit
                        </Button>

                        <Button
                            disabled={!isChecked}
                            onClick={handleSubmit}
                            style={{
                                width: '100px',
                                background: isChecked ? '#d9534f' : '#ffbab9',
                            }}
                        >
                            Potvrdit
                        </Button>
                    </PopupFooter>
                </div>
            ) : null}
        </Popup>
    );
};

export default PopUpComponent;