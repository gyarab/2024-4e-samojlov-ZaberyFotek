import styled from "styled-components";
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