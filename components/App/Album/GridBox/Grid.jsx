import styled from "styled-components";

const GridContainer = styled.ul`
  /* This renders the buttons above... Edit me! */
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  grid-gap: 20px;
`;

export const GridLayout = ({ children }) => {
  return <GridContainer>{children}</GridContainer>;
};
