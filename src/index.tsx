import { render } from 'solid-js/web';
import { Router } from 'solid-app-router';
import './index.css';
import App from './App';

const renderApp = () =>
  render(
    () => (
      <Router>
        <App />
      </Router>
    ),
    document.getElementById('root') as HTMLElement
  );

if (import.meta.env.MODE === 'msw') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start().then(renderApp);
    console.log('Mock service worker started');
  });
} else {
  renderApp();
}
