import styled from 'styled-components/macro';

import {
  ConsentBackLink,
  ConsentDetails,
  ConsentReturnButton,
} from 'components/consent';
import { useAuth } from 'services/auth';
import { getRecordDataFromResponse } from 'utils/client';
import { getReturnUrl } from 'utils/fn';
import { flexColumn } from 'utils/styled';
import type { ProcessingRecordResponse } from 'utils/types';

interface Props {
  processingRecordQuery: ProcessingRecordResponse;
}

const Consent = ({ processingRecordQuery }: Props) => {
  const { user } = useAuth();
  const recordData = getRecordDataFromResponse(processingRecordQuery, user);
  const returnUrl = getReturnUrl();

  return (
    <StyledWrapper>
      {returnUrl ? (
        <ConsentReturnButton url={returnUrl} />
      ) : (
        <ConsentBackLink position="top" />
      )}
      {recordData && <ConsentDetails data={recordData[0]} />}
      {!returnUrl && <ConsentBackLink position="bottom" />}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  ${flexColumn}
`;

export default Consent;
