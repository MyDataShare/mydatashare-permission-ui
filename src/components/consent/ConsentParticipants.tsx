import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';

import { useAuth } from 'services/auth';
import { capitalize, getRecordStatusIcon } from 'utils/fn';
import { ParticipantStatus, ProcessingRecordParticipant } from 'utils/types';

interface Props {
  nonDataSubjectParticipants: ProcessingRecordParticipant[];
  userParticipant: ProcessingRecordParticipant;
}

const ConsentParticipants = ({
  userParticipant,
  nonDataSubjectParticipants,
}: Props) => {
  // If we don't have display name for logged-in user's participant, we can use username
  const { user } = useAuth();
  const username = user?.username || null;

  const { t } = useTranslation();
  return (
    <StyledWrapper>
      {nonDataSubjectParticipants.map(prp => {
        const participantIsUser = prp.uuid === userParticipant.uuid;
        let name = prp.identifier_display_name;
        if (participantIsUser && (!name || name.length === 0)) {
          name = username;
        }
        if (participantIsUser && (!name || name.length === 0)) {
          name = t('labelYou');
        }
        return (
          <StyledParticipantWrapper
            key={prp.uuid}
            $isUser={participantIsUser}
            $notApplicable={prp.status === ParticipantStatus.NOT_APPLICABLE}
          >
            <div>
              {name && name.length > 0 ? (
                name
              ) : (
                <i>{t('labelNameNotAvailable')}</i>
              )}
              :
            </div>
            <StyledStatusWrapper>
              <FontAwesomeIcon
                icon={getRecordStatusIcon(prp.status)}
                size="1x"
              />
              <div>{capitalize(t(prp.status))}</div>
            </StyledStatusWrapper>
          </StyledParticipantWrapper>
        );
      })}
    </StyledWrapper>
  );
};

export default ConsentParticipants;

/* Styled Components */

const StyledWrapper = styled.div`
  margin: 0.5em 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

type StyledParticipantWrapperProps = {
  $notApplicable: boolean;
  $isUser: boolean;
};

const StyledParticipantWrapper = styled.div<StyledParticipantWrapperProps>`
  display: flex;
  gap: 1em;
  color: ${p => (p.$notApplicable ? p.theme.colors.linkMuted : 'inherit')};
  font-weight: ${p =>
    p.$isUser
      ? p.theme.typography.semibold.fontWeight
      : p.theme.typography.body.fontWeight};
`;

const StyledStatusWrapper = styled.div`
  display: flex;
  gap: 0.5em;
`;
