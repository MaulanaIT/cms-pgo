// Import Library
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as ReduxProvider } from 'react-redux';

// Import Custom Library
import { wrapper } from '@/config/store';

// Import Components
import Guard from '@/layout/Guard';
import LoadingScreen from '@/components/core/LoadingScreen';
import Sidebar from '@/layout/Sidebar';
import ToastMessage from '@/components/core/popup/ToastMessage';

// Import Styles
import '@/styles/globals.css'
import '@/styles/tailwind.css'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps, ...rest }) {
  const { store } = wrapper.useWrappedStore(rest);

  const GetLayout = (page) => {
    switch (Component.layout ?? '') {
      case 'Sidebar':
        if (Component.guard) return <Guard><Sidebar>{page}</Sidebar></Guard>
        return <Sidebar>{page}</Sidebar>;
      default:
        if (Component.guard) return <Guard>{page}</Guard>
        return page;
    }
  };

  return (
    <main className={inter?.className}>
      <Head>
        <title>{Component?.title ?? 'PGO Dashboard'}</title>
      </Head>

      <ReduxProvider store={store}>
        <PersistGate persistor={store.__persistor}>
          <LoadingScreen />
          {GetLayout(<Component {...pageProps} />)}
          <ToastMessage />
        </PersistGate>
      </ReduxProvider >
    </main>
  )
}
