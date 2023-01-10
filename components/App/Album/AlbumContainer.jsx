import styled from "styled-components";

const AlbumContainer = styled.div`
  height: 100%;
  max-height: 100%;
  overflow-y: hidden;
`;

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const Album = ({ children }) => {
  return (
    <AlbumContainer>
      <Wrap>
        <main>{children}</main>
      </Wrap>
    </AlbumContainer>
  );
};
