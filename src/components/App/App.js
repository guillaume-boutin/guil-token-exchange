import { Header } from "../Header/Header";
import { Content } from "../content/Content";
import styled from "styled-components";

const StyledApp = styled.div`
  display: grid;
  min-height: 100%;
  grid-template-rows: 48px 1fr;
  grid-template-columns: 1fr;
`;

function App() {
  return (
    <StyledApp>
      <Header />

      <Content />
    </StyledApp>
  );
}

export default App;
