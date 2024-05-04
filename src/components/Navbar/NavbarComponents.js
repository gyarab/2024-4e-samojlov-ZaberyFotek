import styled from 'styled-components';
import {Link} from "react-router-dom";
import {FaBars} from "react-icons/fa";

export function Nav(props) {

    const StyledNav = styled.nav`
        background: #000;
        height: 80px;
        display: flex;
        justify-content: space-between;
        padding: 0.5rem calc((100vw - 1000px) / 2);
        z-index: 10;
    `;

    return <StyledNav {...props} />;
}

export function NavLink(props) {

    const StyledLink = styled(Link)`
        color: white;
        display: flex;
        align-items: center;
        text-decoration: none;
        padding: 0 1rem;
        height: 100%;
        cursor: pointer;

        &:active {

            color: aqua;
        }
    `;

    return <StyledLink {...props} />;
}

export function Bars(props) {

    const StyledBars = styled(FaBars)`
        display: none;
        color: bisque;

        @media screen and (max-width: 768px) {
            display: block;
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(-100%, 65%);
            font-size: 1.8rem;
            cursor: pointer;
        }
    `;

    return <StyledBars {...props} />;
}

export function NavMenu(props) {

    const StyledNav = styled.div`
        display: flex;
        align-items: center;
        margin-right: -15px;


        @media screen and (max-width: 768px) {
            display: none;
        }
    `;

    return <StyledNav {...props} />;
}

export function NavBtn(props) {

    const StyledNavBtn = styled.div`
        display: flex;
        align-items: center;
        margin-right: 24px;

        @media screen and (max-width: 768px) {
            display: none;
        }
    `

    return <StyledNavBtn {...props} />;
}

export function NavBtnLink(props) {

    const NavBtnLink = styled(Link)`
        border-radius: 4px;
        background: #256ce1;
        padding: 10px 22px;
        color: #fff;
        border: none;
        outline: none;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        text-decoration: none;

        &:hover {
            transition: all 0.2s ease-in-out;
            background: #fff;
            color: #010606;
        }`


    return <NavBtnLink {...props} />;
}
