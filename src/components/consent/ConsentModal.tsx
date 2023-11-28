import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro';

import ConsentAccessLog from './ConsentAccessLog';
import ConsentEventLog from './ConsentEventLog';
import { InfiniteScrollModal } from 'components/common';
import { RecordData } from 'utils/types';

interface Props {
  data: RecordData;
}

const ConsentModal = ({ data }: Props) => {
  const { hash, pathname } = useLocation();
  const navigate = useNavigate();

  const onClose = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(pathname, { replace: true });
    }
  };

  return (
    <>
      {data.provider && hash === '#access' && (
        <StyledModal title="Consent modal" onClose={onClose} showCloseButton>
          <ConsentAccessLog recordData={data} />
        </StyledModal>
      )}
      {hash === '#events' && (
        <StyledModal title="Consent modal" onClose={onClose} showCloseButton>
          <ConsentEventLog recordData={data} />
        </StyledModal>
      )}
    </>
  );
};

const StyledModal = styled(InfiniteScrollModal)`
  height: calc(100% - ${({ theme }) => theme.em(2 * theme.spacing.xxlarge)});
  width: calc(100% - ${({ theme }) => theme.em(2 * theme.spacing.xxxlarge)});
  @media only screen and (max-width: 780px) {
    width: 100%;
    margin: 0 ${({ theme }) => theme.em(theme.spacing.small)};
  }
`;

export default ConsentModal;
