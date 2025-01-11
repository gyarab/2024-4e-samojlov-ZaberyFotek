import React, {useEffect, useState} from "react";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {
    AccountButton,
    AccountContainer,
    AccountSettingsContainer,
    ButtonContainer,
    Card,
    CardContent,
    CardDescription,
    CardMedia,
    CardTitle,
    ChangeContainer,
    CreateButton,
    EditIcon,
    EmptyMessage,
    GridContainer,
    InfoCard,
    InfoLabel,
    InfoValue,
    LoginOptions,
    LogOutBtn,
    MainContent,
    OptionIcon,
    OptionLabel,
    OptionRow,
    ProjectsContainer,
    Section,
    SectionParagraph,
    SectionTitle,
    Sidebar,
    SidebarItem
} from "./AccountComponents";
import {FaRegFolder, FaRegUserCircle} from "react-icons/fa";
import {MdLogout} from "react-icons/md";
import {FcGoogle} from "react-icons/fc";
import {FiEdit} from "react-icons/fi";
import {IoSettingsOutline} from "react-icons/io5";
import {TbPhotoVideo} from "react-icons/tb";
import PopUpComponent from "../../components/PopUp/PopUp";
import axios from "axios";

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
    const userData = JSON.parse(loggedInUser);

    console.log("LOGGED", userData);

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
    const connected = userData?.verified_email !== null;

    const [clips, setClips] = useState([]);

    useEffect(() => {

        console.log("KLIPY", clips);

    }, [clips]);

    return (
        <AccountContainer>
            <Sidebar>
                <SidebarItem
                    active={activeItem === 'Moje projekty'}
                    onClick={() => {
                        handleItemClick('Moje projekty')
                        axios
                            .post('http://localhost:4000/data/getClips', {
                                user_id: userData?.id,
                            })
                            .then((res) => {
                                setClips(res.data?.clips);

                            })
                            .catch((err) => {
                                toast.error('Error fetching clips');
                                console.log(err);
                            });
                    }}
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

                    <div>

                        {clips.length > 0 ? (
                            <ProjectsContainer>
                                <SectionTitle>{activeItem}</SectionTitle>
                                <GridContainer>
                                    {clips.map((clip) => {

                                        let videoSrc = clip.src;

                                        if (clip?.src.toString().startsWith('data:')) {
                                            videoSrc = clip.src;
                                        } else if (clip?.src.toString().startsWith('blob:')) {
                                            videoSrc = clip.src;
                                        } else {
                                            const videoBlob = new Blob([clip.src], { type: 'video/mp4' });
                                            videoSrc = URL.createObjectURL(videoBlob);
                                        }

                                        return (<Card key={clip.id}>
                                            <video
                                                controls
                                                src={videoSrc}
                                                poster={clip.poster}
                                            >
                                                Zdá se, že váš prohlížeč nepodporuje tento typ videa
                                            </video>
                                            <CardContent>
                                                <CardTitle>{clip.name}</CardTitle>
                                                <CardDescription>{clip.description || 'No description provided.'}</CardDescription>
                                            </CardContent>
                                        </Card>);
                                    })}
                                </GridContainer>
                            </ProjectsContainer>

                        ) : (
                            <ProjectsContainer style={{alignItems: 'center', justifyContent: 'center'}}>
                            <SectionTitle>{activeItem}</SectionTitle>
                                <EmptyMessage>Zatím žádné projekty.</EmptyMessage>
                                <CreateButton onClick={() => navigate("/")}>
                                    <TbPhotoVideo style={{fontSize: '20px'}}/> Vytvořit nový klip
                                </CreateButton>
                            </ProjectsContainer>
                        )}
                    </div>
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
                            <InfoValue>{userData?.username}</InfoValue>
                            <EditIcon onClick={() => {
                                setOpen(o => !o);
                                setType('username');
                            }
                            }>
                                <FiEdit/>
                            </EditIcon>
                            {open && <PopUpComponent open={open}
                                                     closeModal={closeModal}
                                                     userData={userData}
                                                     type={type}
                            />}
                        </InfoCard>
                        <InfoCard>
                            <InfoLabel>Email</InfoLabel>
                            <InfoValue>{userData?.email}</InfoValue>
                            <EditIcon onClick={() => {
                                setOpen(o => !o)
                                setType('email')
                            }
                            }><FiEdit/>
                            </EditIcon>

                            {open && <PopUpComponent open={open}
                                                     closeModal={closeModal}
                                                     userData={userData}
                                                     type={type}
                                                     blur={false}
                                                     width={false}
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