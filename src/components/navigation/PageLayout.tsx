import { ReactNode } from 'react';
import styled from 'styled-components/macro';

import Footer from './Footer';
import Toolbar from './Toolbar';
import { contentMaxWidth, flexColumn } from 'utils/styled';

interface Props {
  children: ReactNode;
  showFooter?: boolean;
}

const PageLayout = ({ children, showFooter }: Props) => {
  return (
    <StyledLayout>
      <Toolbar />
      <StyledContent>{children}</StyledContent>
      {showFooter && <Footer />}
    </StyledLayout>
  );
};

const StyledLayout = styled.div`
  ${flexColumn}
  height: 100%;
`;

const StyledContent = styled.main`
  ${flexColumn}
  ${contentMaxWidth}
  flex: 1;
  padding-top: ${p => p.theme.em(p.theme.spacing.xlarge)};
  padding-bottom: ${p => p.theme.em(p.theme.spacing.xxxlarge)};
`;

export default PageLayout;
