import { ReactQueryDevtools } from 'react-query/devtools';

import Providers from './Providers';
import Routes from './routes';
import { NotificationContainer } from 'components/common';
import { MainLayout } from 'components/navigation';

function App() {
  return (
    <Providers>
      <MainLayout>
        <Routes />
      </MainLayout>
      <NotificationContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </Providers>
  );
}

export default App;
