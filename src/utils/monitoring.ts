// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    
    // Log performance metrics
    console.log({
      type: 'performance',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: Math.round(duration * 100) / 100, // Round to 2 decimal places
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });

    // Send metrics to CloudWatch (if AWS environment)
    if (process.env.AWS_REGION && process.env.NODE_ENV === 'production') {
      // In production, you would use AWS SDK to send metrics to CloudWatch
      // This is a placeholder for CloudWatch integration
      console.log('CloudWatch metrics:', {
        metricName: 'ApiRequestDuration',
        value: Math.round(duration * 100) / 100,
        unit: 'Milliseconds',
        dimensions: {
          Method: req.method,
          Path: req.path,
          StatusCode: res.statusCode.toString(),
        },
      });
    }
  });
  
  next();
};

// Health check with system metrics
export const healthCheck = async (req: Request, res: Response) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100,
    },
    cpu: {
      usage: process.cpuUsage(),
    },
    services: {
      database: 'checking...',
      cache: 'checking...',
    },
  };

  try {
    // Check database connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      health.services.database = 'connected';
    } else {
      health.services.database = 'disconnected';
      health.status = 'degraded';
    }
  } catch (error) {
    health.services.database = 'error';
    health.status = 'degraded';
  }

  try {
    // Check Redis connection
    const { connectRedis } = require('./cache');
    const redis = await connectRedis();
    await redis.ping();
    health.services.cache = 'connected';
  } catch (error) {
    health.services.cache = 'disconnected';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
};

// Error tracking
export const trackError = (error: Error, req: Request) => {
  const errorData = {
    type: 'error',
    message: error.message,
    stack: error.stack,
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
  };

  console.error('Application Error:', errorData);

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Placeholder for Sentry, DataDog, or similar service
    console.log('Error tracking service integration point');
  }
};

// Custom metrics collector
export class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: Map<string, number> = new Map();

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  increment(metricName: string, value: number = 1): void {
    const current = this.metrics.get(metricName) || 0;
    this.metrics.set(metricName, current + value);
  }

  gauge(metricName: string, value: number): void {
    this.metrics.set(metricName, value);
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  reset(): void {
    this.metrics.clear();
  }

  // Periodic metrics reporting
  startReporting(intervalMs: number = 60000): void {
    setInterval(() => {
      const metrics = this.getMetrics();
      console.log('Metrics Report:', metrics);
      
      // In production, send to monitoring service
      if (process.env.NODE_ENV === 'production') {
        console.log('Monitoring service integration point');
      }
      
      this.reset();
    }, intervalMs);
  }
}

// Request counter middleware
export const requestCounter = (req: Request, res: Response, next: NextFunction) => {
  const metrics = MetricsCollector.getInstance();
  
  metrics.increment(`requests.${req.method.toLowerCase()}`);
  metrics.increment(`requests.${req.method.toLowerCase()}.${req.path}`);
  
  res.on('finish', () => {
    metrics.increment(`responses.${res.statusCode}`);
    metrics.increment(`responses.${req.method.toLowerCase()}.${res.statusCode}`);
  });
  
  next();
};
