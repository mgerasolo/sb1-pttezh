import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { logger } from './utils/logger';
import { checkDependencies, validateBuildConfig } from './utils/dependencyCheck';

// Initialize logging
logger.info('Application starting');

// Perform dependency and build configuration checks
Promise.all([
  checkDependencies(),
  validateBuildConfig()
]).catch(error => {
  logger.error('Startup checks failed:', {
    error: error instanceof Error ? error.message : String(error)
  });
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);