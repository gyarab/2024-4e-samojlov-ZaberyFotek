import styled from 'styled-components';

export const AccountContainer = styled.div`
    display: flex;
    height: 100vh;
    background-color: #f9f9f9;
`;

export const Sidebar = styled.aside`
    width: 240px;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 100px;
    border: 1px solid #eaeaea;
    border-radius: 10px;
`;

export const SidebarItem = styled.div.withConfig({
    shouldForwardProp: (prop) => !['active'].includes(prop),
})`
    padding: 15px 20px;
    font-size: 16px;
    color: ${({ active }) => (active ? '#007bff' : '#333')};
    background-color: ${({ active }) => (active ? '#f0f8ff' : 'transparent')};
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;

    &:hover {
        background-color: ${({ active }) => (active ? '#e6f2ff' : '#f8f9fa')};
    }
`;

export const MainContent = styled.main`
    flex: 1;
    padding: 40px;
`;

export const Title = styled.h1`
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
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
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;