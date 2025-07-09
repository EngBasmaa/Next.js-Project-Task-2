# Custom Logger System

This directory contains a comprehensive logging system for the NestJS application.

## Features

- **Multiple Log Levels**: ERROR, WARN, INFO, DEBUG, VERBOSE
- **File-based Logging**: Logs are written to separate files by level and date
- **Log Rotation**: Automatic log file rotation when size exceeds 10MB
- **Context-aware**: Each log entry includes context information
- **Performance Monitoring**: Built-in performance logging
- **Business-specific Methods**: Specialized methods for order operations
- **HTTP Request Logging**: Automatic HTTP request/response logging via interceptor

## Files

- `custom.logger.ts` - Main logger service
- `logger.module.ts` - NestJS module for dependency injection
- `logging.interceptor.ts` - HTTP interceptor for automatic request logging
- `logger.example.ts` - Usage examples

## Usage

### Basic Usage

```typescript
import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../common/logger/custom.logger';

@Injectable()
export class MyService {
  constructor(private readonly logger: CustomLogger) {}

  async someMethod() {
    this.logger.log('Operation started', 'MyService');

    try {
      // Your code here
      this.logger.log('Operation completed successfully', 'MyService');
    } catch (error) {
      this.logger.error('Operation failed', error.stack, 'MyService');
    }
  }
}
```

### Log Levels

```typescript
// Info level - for general information
this.logger.log('This is an info message', 'ServiceName');

// Debug level - for detailed debugging
this.logger.debug('This is a debug message', 'ServiceName');

// Warn level - for warnings
this.logger.warn('This is a warning message', 'ServiceName');

// Error level - for errors
this.logger.error('This is an error message', 'ServiceName');

// Verbose level - for very detailed information
this.logger.verbose('This is a verbose message', 'ServiceName');
```

### Business-specific Methods

```typescript
// Order operations
this.logger.logOrderCreated(orderId, clientId, amount, 'ServiceName');
this.logger.logOrderUpdated(orderId, changes, 'ServiceName');
this.logger.logOrderDeleted(orderId, 'ServiceName');

// HTTP requests
this.logger.logRequest(method, url, duration, statusCode, 'ServiceName');

// Database operations
this.logger.logDatabase(query, duration, 'ServiceName');

// Performance monitoring
this.logger.logPerformance(operation, duration, 'ServiceName');
```

### Error Logging

```typescript
try {
  // Your code here
} catch (error) {
  this.logger.logError(error, 'ServiceName');
}
```

## Log Files

Logs are stored in the `logs/` directory with the following structure:

- `error-YYYY-MM-DD.log` - Error level logs
- `warn-YYYY-MM-DD.log` - Warning level logs
- `info-YYYY-MM-DD.log` - Info level logs
- `debug-YYYY-MM-DD.log` - Debug level logs
- `verbose-YYYY-MM-DD.log` - Verbose level logs

## Configuration

The logger can be configured by modifying the following properties in `custom.logger.ts`:

- `logDir`: Directory where log files are stored (default: 'logs')
- `maxLogSize`: Maximum size of log files in bytes (default: 10MB)
- `maxLogFiles`: Maximum number of rotated log files (default: 5)

## Integration

The logger is automatically available throughout the application via the `LoggerModule`. The `LoggingInterceptor` automatically logs all HTTP requests and responses.

## Example Output

```
[2024-01-15T10:30:45.123Z] [INFO] [OrdersService] Order created - ID: order-123, Client: 456, Amount: 99.99
[2024-01-15T10:30:46.456Z] [DEBUG] [HTTP_REQUEST] Incoming GET request to /api/orders
[2024-01-15T10:30:46.789Z] [INFO] [HTTP] GET /api/orders - 200 - 333ms
```
