import styled from 'styled-components/macro';

import ConsentListCard from './ConsentListCard';
import { Link } from 'components/navigation';
import { RecordData } from 'utils/types';

interface Props {
  item: RecordData;
}

const ConsentListItem = ({ item }: Props) => {
  return (
    <StyledWrapper>
      <Link to={`/processing-record/${item.record.uuid}`}>
        <ConsentListCard data={item} />
      </Link>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.li``;

export default ConsentListItem;
