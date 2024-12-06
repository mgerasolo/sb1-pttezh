import { logger } from './logger';

export const checkDependencies = async () => {
  try {
    const response = await fetch('/package.json');
    const pkg = await response.json();
    
    const dependencies = {
      ...pkg.dependencies,
      ...pkg.devDependencies
    };

    logger.info('Checking dependencies', {
      totalDependencies: Object.keys(dependencies).length,
      dependencies
    });

    // Log specific dependency versions
    const criticalDeps = ['react', 'vite', '@vitejs/plugin-react', 'typescript'];
    criticalDeps.forEach(dep => {
      if (dependencies[dep]) {
        logger.info(`Critical dependency version`, {
          dependency: dep,
          version: dependencies[dep]
        });
      } else {
        logger.error(`Missing critical dependency: ${dep}`);
      }
    });

  } catch (error) {
    logger.error('Failed to check dependencies', {
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const validateBuildConfig = async () => {
  try {
    const response = await fetch('/vite.config.ts');
    const config = await response.text();
    
    logger.info('Vite configuration found', {
      configPresent: true,
      size: config.length
    });
    
  } catch (error) {
    logger.error('Failed to validate build configuration', {
      error: error instanceof Error ? error.message : String(error)
    });
  }
};