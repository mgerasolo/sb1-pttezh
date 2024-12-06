import { v4 as uuidv4 } from 'uuid';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  correlationId: string;
  metadata?: Record<string, any>;
}

class BrowserLogger {
  private static instance: BrowserLogger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor() {
    window.addEventListener('error', (event) => {
      this.error('Uncaught error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', {
        reason: event.reason
      });
    });
  }

  static getInstance(): BrowserLogger {
    if (!BrowserLogger.instance) {
      BrowserLogger.instance = new BrowserLogger();
    }
    return BrowserLogger.instance;
  }

  private addLog(level: LogLevel, message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      correlationId: uuidv4(),
      metadata
    };

    this.logs.push(entry);
    
    // Trim old logs if exceeding max size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with styling
    const style = this.getConsoleStyle(level);
    console.log(
      `%c${entry.timestamp} [${entry.correlationId}] ${level.toUpperCase()}: ${message}`,
      style,
      metadata
    );
  }

  private getConsoleStyle(level: LogLevel): string {
    switch (level) {
      case 'error': return 'color: #ff0000; font-weight: bold';
      case 'warn': return 'color: #ffa500; font-weight: bold';
      case 'info': return 'color: #0000ff';
      case 'debug': return 'color: #808080';
      default: return '';
    }
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.addLog('debug', message, metadata);
  }

  info(message: string, metadata?: Record<string, any>) {
    this.addLog('info', message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.addLog('warn', message, metadata);
  }

  error(message: string, metadata?: Record<string, any>) {
    this.addLog('error', message, metadata);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = BrowserLogger.getInstance();

// Performance monitoring
export const measurePerformance = async <T>(
  operation: string,
  fn: () => Promise<T>,
  context: Record<string, any> = {}
): Promise<T> => {
  const start = performance.now();
  const correlationId = uuidv4();
  
  try {
    const result = await fn();
    const duration = performance.now() - start;
    
    logger.info(`Performance measurement for ${operation}`, {
      correlationId,
      duration,
      success: true,
      ...context
    });
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    
    logger.error(`Failed operation: ${operation}`, {
      correlationId,
      duration,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context
    });
    
    throw error;
  }
};