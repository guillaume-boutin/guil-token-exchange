import styled from "styled-components";

const StyledCard = styled.div`
  background-color: #343a40;
  width: 100%;
  height: 100%;
`;

export const Card = ({ children }) => <StyledCard>{children}</StyledCard>;
