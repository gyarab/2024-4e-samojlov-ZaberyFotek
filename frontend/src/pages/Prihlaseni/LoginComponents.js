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
    box-shadow: 0 5px 20px 0 #d6aaff;
    padding: 40px 32px;
    width: 400px;
`;

export const Title = styled.h1`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const InputWrapper = styled.div`
    margin-bottom: 16px;
`;

export const Label = styled.label`
    font-size: 14px;
    font-weight: 400;
    color: var(--color-shadow-8);
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
    box-shadow: 0 0 4px rgba(0, 115, 230, 0.4);
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 16px;
  margin-left: 8px;
  margin-top: 2px;
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
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
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

    p {
        transition: 0.1s ease-in;
    }

    &:hover p {
        transform: translateX(50%);
    }
`;

export const SignUpLink = styled.a`
    display: block;
    font-size: 14px;
    color: var(--color-shadow-8);
    text-align: center;
    margin-top: 20px;
    cursor: pointer;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
        text-decoration-color: var(--color-shadow-4);
    }
`;