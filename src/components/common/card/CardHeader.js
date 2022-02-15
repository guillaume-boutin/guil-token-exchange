import styled from "styled-components";

const StyledCardHeader = styled.div`
  padding: 8px 4px;
  color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
`;

export const CardHeader = ({ children }) => (
  <StyledCardHeader>{children}</StyledCardHeader>
);
