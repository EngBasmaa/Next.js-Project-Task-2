import { Injectable } from '@nestjs/common';
import { CustomLogger } from './custom.logger';

@Injectable()
export class ExampleService {
    constructor(private readonly logger: CustomLogger) { }

    // Example of different logging levels
    exampleLogging() {
        // Info level - for general information
        this.logger.log('This is an info message', 'ExampleService');

        // Debug level - for detailed debugging information
        this.logger.debug('This is a debug message', 'ExampleService');

        // Warn level - for warnings
        this.logger.warn('This is a warning message', 'ExampleService');

        // Error level - for errors
        this.logger.error('This is an error message', 'ExampleService');

        // Verbose level - for very detailed information
        this.logger.verbose('This is a verbose message', 'ExampleService');
    }

    // Example of logging objects
    exampleObjectLogging() {
        const user = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
        };

        this.logger.log(user, 'ExampleService');
    }

    // Example of logging errors with stack traces
    exampleErrorLogging() {
        try {
            throw new Error('Something went wrong');
        } catch (error) {
            this.logger.logError(error as Error, 'ExampleService');
        }
    }

    // Example of performance logging
    async examplePerformanceLogging() {
        const startTime = Date.now();

        // Simulate some work
        await new Promise(resolve => setTimeout(resolve, 1500));

        const duration = Date.now() - startTime;
        this.logger.logPerformance('Database query', duration, 'ExampleService');
    }

    // Example of custom business logging
    exampleBusinessLogging() {
        // Log order-related events
        this.logger.logOrderCreated('order-123', 456, 99.99, 'ExampleService');
        this.logger.logOrderUpdated('order-123', { amount: 150.00 }, 'ExampleService');
        this.logger.logOrderDeleted('order-123', 'ExampleService');

        // Log HTTP requests
        this.logger.logRequest('GET', '/api/orders', 250, 200, 'ExampleService');

        // Log database operations
        this.logger.logDatabase('SELECT * FROM orders WHERE client_id = 1', 45, 'ExampleService');
    }
}
