import Styled from "styled-components";

const KSidebar = Styled.nav`
    min-Height : 100vh;
    max-Height:100vh;
    min-Width : 200px;
    max-Width:500px;
    width:200px;
    background:white;
    background:${(props) => props.Mode !== "Dark" ? "var(--primaryDashMenuColor)" : "var(--primary-light)"};
    position:absolute;
    top:-2rem;
    left:0;
    z-index:2002;
    transition:1s;
    transform: ${(props) => props.Open !== "Open" ? "translateX(0%)" : "translateX(-100%)"};
`

export const TopKSidebar = Styled.nav`
    min-Height : 300px;
    max-Height:300px;
    min-Width : 100%;
    max-Width:100%;
    width:100%;
    background:white;
    background:${(props) => props.Mode !== "Dark" ? "var(--primaryDashMenuColor)" : "var(--primary-light)"};
    position:absolute;
    top:-2rem;
    left:0;
    z-index:2002;
    transition:1s;
    transform: ${(props) => props.Open !== "Open" ? "translateY(0%)" : "translateY(-100%)"};
`
export const BottomKSidebar = Styled.nav`
    min-Height : 300px;
    max-Height:300px;
    min-Width : 100%;
    max-Width:100%;
    width:100%;
    background:white;
    background:${(props) => props.Mode !== "Dark" ? "var(--primaryDashMenuColor)" : "var(--primary-light)"};
    position:absolute;
    bottom:2rem;
    z-index:2002;
    left:0;
    transition:1s;
    transform: ${(props) => props.Open !== "Open" ? "translateY(0%)" : "translateY(100%)"};
`
export const RightKSidebar = Styled.nav`
    min-Height : 100vh;
    max-Height:100vh;
    min-Width : 200px;
    max-Width:400px;
    width:fit-content;
    position:absolute;
    background:${(props) => props.Mode !== "Dark" ? "rgba(250, 250, 250, .8)" : "var(--primary-light)"};
    top:0;
    border-left:1px solid rgba(0,0,0,.2);
    right:0;
    z-index:2002;
    padding:1rem;
    transition:1s;
    
    transform: ${(props) => props.Open !== "Open" ? "translateX(0%)" : "translateX(100%)"};
`

export default KSidebar