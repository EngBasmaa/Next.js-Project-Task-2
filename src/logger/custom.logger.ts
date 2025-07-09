import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    VERBOSE = 'VERBOSE',
}

@Injectable()
export class CustomLogger implements LoggerService {
    private logDir = 'logs';
    private maxLogSize = 10 * 1024 * 1024; // 10MB
    private maxLogFiles = 5;

    constructor() {
        this.ensureLogDirectory();
    }

    private ensureLogDirectory(): void {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    private getLogFileName(level: LogLevel): string {
        const date = new Date().toISOString().split('T')[0];
        return path.join(this.logDir, `${level.toLowerCase()}-${date}.log`);
    }

    private writeToFile(level: LogLevel, message: string, context?: string): void {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${context ? `[${context}] ` : ''}${message}\n`;
        const fileName = this.getLogFileName(level);

        try {
            fs.appendFileSync(fileName, logEntry);
            this.rotateLogFile(fileName);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    private rotateLogFile(fileName: string): void {
        try {
            const stats = fs.statSync(fileName);
            if (stats.size > this.maxLogSize) {
                const dir = path.dirname(fileName);
                const ext = path.extname(fileName);
                const base = path.basename(fileName, ext);

                // Remove oldest log file if we have too many
                for (let i = this.maxLogFiles - 1; i >= 1; i--) {
                    const oldFile = path.join(dir, `${base}.${i}${ext}`);
                    const newFile = path.join(dir, `${base}.${i + 1}${ext}`);
                    if (fs.existsSync(oldFile)) {
                        fs.renameSync(oldFile, newFile);
                    }
                }

                // Rename current log file
                const backupFile = path.join(dir, `${base}.1${ext}`);
                fs.renameSync(fileName, backupFile);
            }
        } catch (error) {
            console.error('Failed to rotate log file:', error);
        }
    }

    private formatMessage(message: any): string {
        if (typeof message === 'object') {
            return JSON.stringify(message, null, 2);
        }
        return String(message);
    }

    log(message: any, context?: string): void {
        const formattedMessage = this.formatMessage(message);
        console.log(`[INFO] ${context ? `[${context}] ` : ''}${formattedMessage}`);
        this.writeToFile(LogLevel.INFO, formattedMessage, context);
    }

    error(message: any, trace?: string, context?: string): void {
        const formattedMessage = this.formatMessage(message);
        console.error(`[ERROR] ${context ? `[${context}] ` : ''}${formattedMessage}`);
        if (trace) {
            console.error(`[ERROR] Stack trace: ${trace}`);
            this.writeToFile(LogLevel.ERROR, `${formattedMessage}\nStack trace: ${trace}`, context);
        } else {
            this.writeToFile(LogLevel.ERROR, formattedMessage, context);
        }
    }

    warn(message: any, context?: string): void {
        const formattedMessage = this.formatMessage(message);
        console.warn(`[WARN] ${context ? `[${context}] ` : ''}${formattedMessage}`);
        this.writeToFile(LogLevel.WARN, formattedMessage, context);
    }

    debug(message: any, context?: string): void {
        const formattedMessage = this.formatMessage(message);
        console.debug(`[DEBUG] ${context ? `[${context}] ` : ''}${formattedMessage}`);
        this.writeToFile(LogLevel.DEBUG, formattedMessage, context);
    }

    verbose(message: any, context?: string): void {
        const formattedMessage = this.formatMessage(message);
        console.log(`[VERBOSE] ${context ? `[${context}] ` : ''}${formattedMessage}`);
        this.writeToFile(LogLevel.VERBOSE, formattedMessage, context);
    }

    // Custom methods for specific use cases
    logRequest(method: string, url: string, duration: number, statusCode: number, context?: string): void {
        const message = `${method} ${url} - ${statusCode} - ${duration}ms`;
        this.log(message, context || 'HTTP');
    }

    logDatabase(query: string, duration: number, context?: string): void {
        const message = `Database query executed in ${duration}ms: ${query}`;
        this.debug(message, context || 'DATABASE');
    }

    logOrderCreated(orderId: string, clientId: number, amount: number, context?: string): void {
        const message = `Order created - ID: ${orderId}, Client: ${clientId}, Amount: ${amount}`;
        this.log(message, context || 'ORDERS');
    }

    logOrderUpdated(orderId: string, changes: any, context?: string): void {
        const message = `Order updated - ID: ${orderId}, Changes: ${JSON.stringify(changes)}`;
        this.log(message, context || 'ORDERS');
    }

    logOrderDeleted(orderId: string, context?: string): void {
        const message = `Order deleted - ID: ${orderId}`;
        this.log(message, context || 'ORDERS');
    }

    logError(error: Error, context?: string): void {
        this.error(error.message, error.stack, context);
    }

    // Performance logging
    logPerformance(operation: string, duration: number, context?: string): void {
        const message = `${operation} completed in ${duration}ms`;
        if (duration > 1000) {
            this.warn(message, context || 'PERFORMANCE');
        } else {
            this.debug(message, context || 'PERFORMANCE');
        }
    }
}
