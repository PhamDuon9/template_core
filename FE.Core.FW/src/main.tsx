import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import PageLoading from '@/components/PageLoading';
// Register icon sprite
import 'virtual:svg-icons-register';
// css
import '@/assets/css/index.less';
// App
import App from '@/App';
import { Suspense } from 'react';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <BrowserRouter>
    <RecoilRoot>
      <Suspense fallback={<PageLoading />}>
        <App />
      </Suspense>
    </RecoilRoot>
  </BrowserRouter>,
);
