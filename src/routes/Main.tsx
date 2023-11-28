import { Outlet } from 'react-router-dom';

import { PageLayout } from 'components/navigation';

const Main = ({ showFooter }: { showFooter?: boolean }) => {
  return (
    <PageLayout showFooter={showFooter}>
      <Outlet />
    </PageLayout>
  );
};

export default Main;
