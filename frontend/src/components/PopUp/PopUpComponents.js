import styled, {keyframes} from "styled-components";
import "reactjs-popup/dist/index.css";

export const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const PopupTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  color: var(--color-shadow-9);
  font-weight: 700;
`;

export const CloseButton = styled.span`
  font-size: 25px;
  cursor: pointer;
  color: var(--color-shadow-6);
`;

export const PopupInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--color-shadow-4);
  border-radius: 4px;
  font-size: 14px;
    
    &:focus {
        outline: none;
        border: 1px solid var(--home-blue-light);
    }
`;

export const PopupFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const PopupCheckboxContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

export const PopupStyledCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

/** Animace načítání klipu **/
const shimmer = keyframes`
    0% {
        background-position: -200px 0;
    }
    100% {
        background-position: 200px 0;
    }
`;

export const ClipSection = styled.div`
    width: 100%;
    height: 200px;
    background: linear-gradient(90deg, var(--color-shadow-9) 25%, var(--color-shadow-7) 50%, var(--color-shadow-9) 75%);
    animation: backwards ${shimmer} 1.5s infinite;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const PlayButtonOverlay = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &::after {
        content: '';
        display: block;
        width: 0;
        height: 0;
        border-left: 12px solid #333;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
    }
`;

export const Loader = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const CardContent = styled.div`
    padding: 20px;
`;

export const EditableTitle = styled.input`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  border: none;
  border-bottom: 2px solid #007bff;
  margin-bottom: 10px;
  text-align: left;
  width: 100%;
  background: transparent;
  outline: none;
  margin-top: 25px;
`;

export const FileMetaInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

export const ActionButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ActionButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background: ${(props) => props.bg || "#007bff"};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => props.hover || "#0056b3"};
  }
`;

export const ProjectDescriptionInput = styled.textarea`
  font-size: 14px;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  height: 80px;
  padding: 10px;
  resize: none;
  outline: none;
  margin-top: 25px;
`;