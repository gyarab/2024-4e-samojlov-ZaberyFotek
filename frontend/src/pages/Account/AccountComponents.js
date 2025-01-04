import styled from 'styled-components';

export const AccountContainer = styled.div`
    display: flex;
    background-color: #f9f9f9;
    height: 100vh;
    justify-content: flex-start;
`;

export const Sidebar = styled.aside`
    display: flex;
    flex-direction: column;
    width: 240px;
    background-color: #fff;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid #eaeaea;
    border-radius: 10px;
    margin-top: 120px; 
    margin-left: 25px;
    height: 50rem;
`;

export const SidebarItem = styled.div.withConfig({
    shouldForwardProp: (prop) => !['active'].includes(prop),
})`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    padding: 15px 20px;
    font-size: 16px;
    color: ${({ active }) => (active ? '#007bff' : '#333')};
    background-color: ${({ active }) => (active ? '#f0f8ff' : 'transparent')};
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    font-weight: 600;
    gap: 20px;

    &:hover {
        background-color: ${({ active }) => (active ? '#e6f2ff' : '#f8f9fa')};
    }
`;

export const MainContent = styled.main`
    flex: 1;
    padding: 40px;
    margin-top: 80px;
`;

export const ProjectsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #eaeaea;
    border-radius: 10px;
    background-color: #fff;
    padding: 40px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-height: 300px;
    width: 100%;
    height: 50rem;
`;
export const PlanContainer = styled(ProjectsContainer)`
    background-color: #fefefe;
`;

export const SettingsContainer = styled(ProjectsContainer)`
    background-color: #f8f8f8;
`;

export const EmptyMessage = styled.p`
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
`;

export const CreateButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    gap: 20px;

    &:hover {
        background-color: #0056b3;
    }
`;

export const LogOutBtn = styled.button`
    border-radius: 25%;
    padding: 5px;
    background-color: var(--color-shadow-4);
    opacity: 1;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        background-color: var(--color-shadow-2);
    }
`;

export const AccountSettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    height: 50rem;
`;

export const SectionTitle = styled.h2`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
`;

export const InfoCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #f7f7f7;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    position: relative;
`;

export const InfoLabel = styled.span`
    font-size: 16px;
    color: #666;
    flex: 1;
`;

export const InfoValue = styled.span`
    font-size: 16px;
    font-weight: 500;
    color: #333;
    flex: 3; 
`;

export const EditIcon = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #0073e6;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%); 

    &:hover {
        color: #005bb5;
    }
`;


export const LoginOptions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const OptionRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #f7f7f7;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
`;

export const OptionLabel = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    img {
        width: 24px;
        height: 24px;
    }

    span {
        font-size: 16px;
        font-weight: 500;
        color: #333;
    }
`;

export const OptionButton = styled.button`
    padding: 5px 15px;
    font-size: 14px;
    background-color: ${({ connected }) =>
    connected ? "#e0e0e0" : "#0073e6"};
    color: ${({ connected }) => (connected ? "#666" : "#fff")};
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: ${({ connected }) =>
    connected ? "#c0c0c0" : "#005bb5"};
    }
`;

export const DeleteAccountButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 14px;
    color: #d9534f;
    background-color: transparent;
    border: 1px solid #d9534f;
    border-radius: 4px;
    cursor: pointer;
    width: 50%;

    &:hover {
        background-color: #f2dede;
    }
`;

export const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    font-size: 12px;
    color: #999;

    a {
        color: #0073e6;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export const LanguageSelect = styled.select`
    padding: 5px 10px;
    font-size: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        border-color: #0073e6;
    }
`;
