import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url('/backgroundIMG.jpg');
    background-size: cover;
    background-position: unset;
    background-repeat: no-repeat; 
`;

export const FormWrapper = styled.div`
    background: white;
    border-radius: 16px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    padding: 40px 32px;
    width: 400px;
`;

export const Title = styled.h1`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
`;

export const Subtitle = styled.p`
    font-size: 16px;
    color: #555;
    margin-bottom: 24px;
`;

export const InputWrapper = styled.div`
    margin-bottom: 16px;
`;

export const Label = styled.label`
    font-size: 14px;
    color: #555;
    display: block;
    margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #0073e6;
    box-shadow: 0px 0px 4px rgba(0, 115, 230, 0.4);
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 16px;
`;

export const ForgotPassword = styled.a`
  display: block;
  font-size: 14px;
  color: #0073e6;
  text-align: right;
  margin-bottom: 24px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #0073e6;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005bb5;
  }
`;