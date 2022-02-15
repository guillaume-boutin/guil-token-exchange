import styled from "styled-components";

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  color: white;

  & thead {
    border-bottom: 2px solid grey;
  }

  & th,
  td {
    padding: 4px;
  }

  & tbody tr {
    border-bottom: 1px solid grey;

    &:last-child {
      border-bottom: revert;
    }
  }
`;
