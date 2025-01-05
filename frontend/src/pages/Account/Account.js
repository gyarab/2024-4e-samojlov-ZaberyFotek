import React, {useEffect, useState} from "react";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {Link, Navigate, useLocation, useNavigate} from "react-router-dom";
import {
    AccountContainer, CreateButton, EditIcon,
    EmptyMessage, Footer,
    MainContent,
    ProjectsContainer,
    Sidebar,
    SidebarItem,
    Title,
    AccountSettingsContainer,
    InfoCard,
    InfoLabel,
    InfoValue,
    LoginOptions,
    OptionRow,
    OptionIcon,
    OptionLabel,
    AccountButton,
    SectionTitle, LogOutBtn, ChangeContainer, Section, ButtonContainer, SectionParagraph
} from "./AccountComponents";
import {FaApple, FaGoogle, FaRegFolder, FaRegUserCircle} from "react-icons/fa";
import {MdLogout} from "react-icons/md";
import {FcGoogle} from "react-icons/fc";
import {FiEdit} from "react-icons/fi";
import {IoSettingsOutline} from "react-icons/io5";
import {TbPhotoVideo} from "react-icons/tb";
import Popup from "reactjs-popup";
import PopUpComponent from "../../components/PopUp/PopUp";
import {Button} from "../Prihlaseni/LoginComponents";

/** Komponenta Account umožňuje uživateli prohlížet a spravovat jeho vytvořené klipy **/
function Account() {

    // Nastavení aktivní položky menu (výchozí je "Moje projekty")
    const [activeItem, setActiveItem] = useState('Moje projekty');

    // Získání aktuálního umístění uživatele (URL) pro případné použití v logice
    const location = useLocation();

    /** Funkce pro změnu aktivní položky menu **/
    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    // Získání dat o přihlášeném uživateli z localStorage
    const loggedInUser = localStorage.getItem("user");

    // Parsování dat uživatele z JSON řetězce
    const data = JSON.parse(loggedInUser);

    // Přesměrování uživatele na jinou stránku pomocí hooku navigate
    const navigate = useNavigate();

    // Nastavení typu akce (např. změna hesla, smazání účtu apod.)
    const [type, setType] = useState('');

    // Efekt pro zobrazení oznámení při úspěšné akci
    useEffect(() => {
        if (location.state?.successMessage) {
            toast.success(location.state.successMessage);
        }
    }, [location.state]);

    // Otevření a zavření modálního okna
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);


    // Ověření typu účtu uživatele
    const connected = data?.verified_email !== null;

    return (
        <AccountContainer>
            <Sidebar>
                <SidebarItem
                    active={activeItem === 'Moje projekty'}
                    onClick={() => handleItemClick('Moje projekty')}
                >
                    <FaRegFolder style={{fontSize: '18px'}}/> Moje projekty
                </SidebarItem>
                {/*<SidebarItem*/}
                {/*    active={activeItem === 'Můj plán'}*/}
                {/*    onClick={() => handleItemClick('Můj plán')}*/}
                {/*>*/}
                {/*    Můj plán*/}
                {/*</SidebarItem>*/}
                <SidebarItem
                    active={activeItem === 'Nastavení účtu'}
                    onClick={() => handleItemClick('Nastavení účtu')}
                >
                    <IoSettingsOutline style={{fontSize: '20px'}}/> Nastavení účtu
                </SidebarItem>
            </Sidebar>
            <MainContent>
                {activeItem === 'Moje projekty' && (
                    <ProjectsContainer>
                        <SectionTitle>{activeItem}</SectionTitle>
                        <EmptyMessage>Zatím žádné projekty.</EmptyMessage>
                        <CreateButton onClick={() => {navigate("/")}}><TbPhotoVideo style={{fontSize: '20px'}}/> Vytvořit nový klip</CreateButton>
                    </ProjectsContainer>
                )}
                {/*{activeItem === 'Můj plán' && (*/}
                {/*    <PlanContainer>*/}
                {/*        <EmptyMessage>Your plan details will appear here.</EmptyMessage>*/}
                {/*    </PlanContainer>*/}
                {/*)}*/}
                {activeItem === 'Nastavení účtu' && (
                    <AccountSettingsContainer>
                        <SectionTitle>{activeItem}
                            <LogOutBtn onClick={() => {
                                localStorage.removeItem("user")
                                navigate('/prihlaseni', {
                                    state: {successMessage: 'Odhlášení proběhlo úspěšně'},
                                });
                            }}
                            >
                                <MdLogout
                                    style={{cursor: 'pointer'}}
                                    title={'Odhlásit se'}/>
                            </LogOutBtn>
                        </SectionTitle>

                        <InfoCard>
                            <InfoLabel>Jméno</InfoLabel>
                            <InfoValue>{data?.username}</InfoValue>
                            <EditIcon onClick={() => {
                                setOpen(o => !o)
                                setType('username')
                            }
                            }>
                                <FiEdit/>
                            </EditIcon>
                            {open && <PopUpComponent open={open}
                                                     closeModal={closeModal}
                                                     userData={data}
                                                     type={type}
                            />}
                        </InfoCard>
                        <InfoCard>
                            <InfoLabel>Email</InfoLabel>
                            <InfoValue>{data?.email}</InfoValue>
                            <EditIcon onClick={() => {
                                setOpen(o => !o)
                                setType('email')
                            }
                            }><FiEdit/>
                            </EditIcon>

                            {open && <PopUpComponent open={open}
                                                     closeModal={closeModal}
                                                     userData={data}
                                                     type={type}
                            />}
                        </InfoCard>


                        <SectionTitle style={{marginTop: '15px'}}>Možnosti přihlášení</SectionTitle>
                        <LoginOptions>

                            <OptionRow>
                                <OptionIcon>
                                    <FaRegUserCircle/>
                                    <span>Výchozí</span>
                                </OptionIcon>
                                <OptionLabel
                                    connected={connected}>{connected ?
                                    '—' :
                                    'Připojeno'}</OptionLabel>
                            </OptionRow>

                            <OptionRow>
                                <OptionIcon>
                                    <FcGoogle/>
                                    <span>Google</span>
                                </OptionIcon>
                                <OptionLabel
                                    connected={!connected}>{!connected ?
                                    '—' :
                                    'Připojeno'}</OptionLabel>
                            </OptionRow>
                        </LoginOptions>

                        <ChangeContainer>
                            {/* Levá sekce - Změna hesla */}
                            <Section>
                                <SectionTitle>Změna hesla</SectionTitle>
                                <SectionParagraph>
                                    Zde můžete změnit své heslo pro lepší zabezpečení
                                </SectionParagraph>
                                <ButtonContainer>
                                    <AccountButton color="#ff7f4e">
                                        <Link to="/zapomenute-heslo">Upravit heslo</Link>
                                    </AccountButton>
                                </ButtonContainer>
                            </Section>

                            {/* Pravá sekce - Smazání účtu */}
                            <Section>
                                <SectionTitle>Smazání účtu</SectionTitle>
                                <SectionParagraph>
                                    Všechna vaše data budou trvale odstraněna
                                </SectionParagraph>
                                <ButtonContainer>
                                    <AccountButton
                                        color="#d9534f"
                                        onClick={() => {
                                            setOpen((o) => !o);
                                            setType('deleteAccount');
                                        }}
                                    >
                                        Smazat účet
                                    </AccountButton>
                                </ButtonContainer>
                            </Section>
                        </ChangeContainer>

                    </AccountSettingsContainer>
                )}
            </MainContent>

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
        </AccountContainer>
    );
}

export default Account;