import styled from "styled-components";

const StyledHeader = styled.nav`
  background-color: #007bff;
  padding: 0.5rem 1rem;

  a {
    color: white;
    font-size: 1.25rem;
  }
`;

export const Header = () => {
  return (
    <StyledHeader>
      <a href="#">GUIL Token Exchange</a>
    </StyledHeader>
  );
};
