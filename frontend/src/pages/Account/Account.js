import React, {useEffect, useState} from "react";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {useLocation} from "react-router-dom";
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
    OptionLabel,
    OptionButton,
    DeleteAccountButton,
    LanguageSelect,
    SectionTitle, LogOutBtn
} from "./AccountComponents";
import {FaApple, FaGoogle, FaRegFolder, FaRegUserCircle} from "react-icons/fa";
import {MdLogout} from "react-icons/md";
import {FcGoogle} from "react-icons/fc";
import {FiEdit} from "react-icons/fi";
import {IoSettingsOutline} from "react-icons/io5";
import {TbPhotoVideo} from "react-icons/tb";

/** Komponenta Account umožňuje uživateli prohlížet a spravovat jeho vytvořené klipy **/
function Account() {

    const [activeItem, setActiveItem] = useState('Moje projekty');

    const location = useLocation();

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    const loggedInUser = localStorage.getItem("user");

    const data = JSON.parse(loggedInUser);

    /** Zobrazení oznámení **/
    useEffect(() => {

        if (location.state?.successMessage) {
            toast.success(location.state.successMessage);
        }

    }, [location.state]);

    return (
        <AccountContainer>
            <Sidebar>
                <SidebarItem
                    active={activeItem === 'Moje projekty'}
                    onClick={() => handleItemClick('Moje projekty')}
                >
                    <FaRegFolder style={{fontSize: '18px'}} /> Moje projekty
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
                    <IoSettingsOutline style={{fontSize: '20px'}} /> Nastavení účtu
                </SidebarItem>
            </Sidebar>
            <MainContent>
                {activeItem === 'Moje projekty' && (
                    <ProjectsContainer>
                        <SectionTitle>{activeItem}</SectionTitle>
                        <EmptyMessage>Zatím žádné projekty.</EmptyMessage>
                        <CreateButton><TbPhotoVideo style={{fontSize: '20px'}}/> Vytvořit nový klip</CreateButton>
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
                            <LogOutBtn>
                                <MdLogout
                                    style={{cursor: 'pointer'}}
                                    title={'Odhlásit se'}/>
                        </LogOutBtn>
                        </SectionTitle>


                        <InfoCard>
                            <InfoLabel>Jméno</InfoLabel>
                            <InfoValue>{data?.name}</InfoValue>
                            <EditIcon><FiEdit /></EditIcon>
                        </InfoCard>
                        <InfoCard>
                            <InfoLabel>Email</InfoLabel>
                            <InfoValue>{data?.email}</InfoValue>
                            <EditIcon><FiEdit /></EditIcon>
                        </InfoCard>


                        <SectionTitle style={{marginTop: '15px'}}>Možnosti přihlášení</SectionTitle>
                        <LoginOptions>

                            <OptionRow>
                                <OptionLabel>
                                    <FaRegUserCircle />
                                    <span>Výchozí</span>
                                </OptionLabel>
                                <OptionButton>Připojit</OptionButton>
                            </OptionRow>

                            <OptionRow>
                                <OptionLabel>
                                    <FcGoogle />
                                    <span>Google</span>
                                </OptionLabel>
                                <OptionButton connected>Odpojit</OptionButton>
                            </OptionRow>
                        </LoginOptions>

                        <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <DeleteAccountButton>Smazat účet</DeleteAccountButton>
                        </div>

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