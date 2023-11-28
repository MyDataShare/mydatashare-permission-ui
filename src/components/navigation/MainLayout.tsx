import { ReactNode } from 'react';
import styled from 'styled-components/macro';

import GlobalStyle from 'theme/globalStyle';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <StyledRoot>
      <GlobalStyle />
      <StyledContent id="main-content">{children}</StyledContent>
    </StyledRoot>
  );
};

export default MainLayout;

const StyledRoot = styled.div`
  height: 100%;
`;

const StyledContent = styled.div`
  height: 100%;
  position: relative;
  background-color: ${p => p.theme.colors.background};
`;
