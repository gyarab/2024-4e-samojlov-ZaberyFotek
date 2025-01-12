import React, {useEffect, useState} from "react";
import {
    ActionButton,
    ActionButtonGroup,
    CardContent,
    ClipSection,
    CloseButton,
    EditableTitle,
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
                            setIsPlaying, setDownloadBtn, stop, link, chunks, setSuccess, downloadLink,
                            setSaveClip, selectedPieces
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

    const getType = (type === 'username');

    // console.log(userData, localStorage.getItem('user'));

    useEffect(() => {

        if (getType) {
            setInput(userData?.username);
        } else {
            setInput(userData?.email);
        }
    }, [getType, userData, clipReady]);

    // Přesměrování uživatele
    const navigate = useNavigate();

    /** Funkce pro změnu údajů uživatele nebo smazání účtu / klipu **/
    const handleSubmit = () => {

        const clipId = localStorage.getItem('idClip');

        axios.post('http://localhost:4000/auth/changePersonalData', {
            type: type,
            username: userData?.username,
            email: userData?.email,
            inputData: input,
            clip_id: clipId
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

        if (type === 'deleteClip') {

            localStorage.setItem('idClip', 'clipDeleted');
            closeModal();
            window.location.reload();
        }
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
                    background: 'transparent',
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
                            {clipReady ? (<div>
                                    <video
                                        controls
                                        src={downloadLink}
                                        poster={localStorage.getItem('savedImage').toString()}
                                        // ref={videoRef}
                                        // onLoadedMetadata={handleLoadedMetadata}
                                    >
                                        Zdá se, že váš prohlížeč nepodporuje tento typ videa
                                    </video>

                                    {/*<div>{videoRef.current ? videoRef.current.duration : null}</div>*/}
                                </div>
                            ) : (
                                <Loader/>
                            )}
                        </ClipSection>


                        <EditableTitle
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Jméno projektu"
                        />

                        <ActionButtonGroup>
                            <ActionButton onClick={() => {

                                if (clipReady) {
                                    fetch(downloadLink)
                                        .then((response) => response.blob())
                                        .then((videoBlob) => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                const base64String = reader.result;
                                                axios.post('http://localhost:4000/data/addClip', {
                                                    user_id: userData?.id,
                                                    name: title,
                                                    description: description,
                                                    pieces: selectedPieces,
                                                    src: base64String,
                                                    poster: localStorage.getItem('savedImage').toString()
                                                })
                                                    .then(res => {
                                                        if (res.data.validation) {
                                                            toast.success(res.data.message);
                                                        }
                                                    })
                                                    .catch(err => {
                                                        toast.error(err.response?.data?.error);
                                                    });
                                            };
                                            reader.onerror = (error) => {
                                                console.error("FileReader error: ", error);
                                                toast.error("Error converting file to Base64.");
                                            };
                                            reader.readAsDataURL(videoBlob);
                                        })
                                        .catch((error) => {
                                            console.error("Fetch error: ", error);
                                            toast.error("Failed to fetch the video.");
                                        });

                                    // navigate('/ucet');
                                    // closeModal();
                                    // toast.success("Klip byl úspěšně uložen");
                                }
                            }
                            }

                                          bg={clipReady ? "#ff4757" : "grey"}
                                          hover={clipReady ? "#e84118" : "grey"}
                                          disabled={!clipReady}
                                          style={{cursor: clipReady ? "pointer" : "not-allowed"}}>Uložit
                                projekt</ActionButton>

                            <ActionButton onClick={() => {
                                if (clipReady) {
                                    handleDownload(title, 'download', null, null);
                                    setIsPlaying(false);
                                    setDownloadBtn(false);
                                    stop();
                                    link(null);
                                    chunks.current = [];
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
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                            placeholder="Zde můžete popsat váš projekt..."
                        />
                    </CardContent>
                </div>
            ) : null}

            {type === 'deleteAccount' || type === 'deleteClip' ? (
                <div>
                    <PopupHeader>
                        <PopupTitle>Smazání {type === 'deleteAccount' ? 'účtu' : 'klipu'}</PopupTitle>
                        <CloseButton onClick={closeModal}>&times;</CloseButton>
                    </PopupHeader>

                    {type === 'deleteAccount' ?
                        <p style={{color: 'var(--color-shadow-7)', lineHeight: '1.5', fontSize: '16px'}}>
                            Jste si jisti, že chcete smazat svůj účet? <br/> Smazání účtu odstraní všechna vaše
                            přidružená data trvale. Tuto operaci nelze vrátit zpět.
                        </p> : <p style={{color: 'var(--color-shadow-7)', lineHeight: '1.5', fontSize: '16px'}}>
                            Jste si jisti, že chcete smazat tento klip? <br/> Smazání klipu jej trvale odstraní z vašeho
                            profilu. Tuto operaci nelze vrátit zpět.
                        </p>}

                    <PopupCheckboxContainer>
                        <PopupStyledCheckbox
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        <Label style={{color: 'var(--color-shadow-6)', lineHeight: '1.5', fontSize: '14px'}}>
                            Souhlasím se smazáním {type === 'deleteAccount' ? 'účtu' : 'klipu'}
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