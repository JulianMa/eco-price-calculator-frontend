import { render } from 'solid-js/web';
import { Router } from 'solid-app-router';
import './index.css';
import App from './App';



if (process.env.NODE_ENV === 'development') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start();
  });
}

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
);