import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";
import {
    AccountContainer, CreateButton,
    EmptyMessage,
    MainContent,
    ProjectsContainer, SettingsContainer,
    Sidebar,
    SidebarItem,
    Title
} from "./AccountComponents";

/** Komponenta Account umožňuje uživateli prohlížet a spravovat jeho vytvořené klipy **/
function Account() {

    const [activeItem, setActiveItem] = useState('Moje projekty');

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    const loggedInUser = localStorage.getItem("user");

    const data = JSON.parse(loggedInUser);

    return (
        <AccountContainer>
            <Sidebar>
                <SidebarItem
                    active={activeItem === 'Moje projekty'}
                    onClick={() => handleItemClick('Moje projekty')}
                >
                    Moje projekty
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
                    Nastavení účtu
                </SidebarItem>
            </Sidebar>
            <MainContent>
                <Title>{activeItem}</Title>
                {activeItem === 'Moje projekty' && (
                    <ProjectsContainer>
                        <EmptyMessage>Zatím žádné projekty.</EmptyMessage>
                        <CreateButton>Vytvořit nový klip</CreateButton>
                    </ProjectsContainer>
                )}
                {/*{activeItem === 'Můj plán' && (*/}
                {/*    <PlanContainer>*/}
                {/*        <EmptyMessage>Your plan details will appear here.</EmptyMessage>*/}
                {/*    </PlanContainer>*/}
                {/*)}*/}
                {activeItem === 'Nastavení účtu' && (
                    <SettingsContainer>
                        <EmptyMessage>Můj email {data.email}</EmptyMessage>
                    </SettingsContainer>
                )}
            </MainContent>
        </AccountContainer>
    );
}

export default Account;