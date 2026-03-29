interface RequestMetrics {
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  timestamp: string;
  userAgent?: string;
  ip?: string;
}

interface ErrorMetrics {
  message: string;
  stack?: string;
  timestamp: string;
  path: string;
  method: string;
}

interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    external: number;
  };
  cpu: {
    usage: number;
  };
  uptime: number;
  timestamp: string;
}

class AnalyticsCollector {
  private metrics: {
    requests: RequestMetrics[] = [];
    errors: ErrorMetrics[] = [];
    system: SystemMetrics[] = [];
  };

  recordRequest(metrics: RequestMetrics): void {
    this.metrics.requests.push(metrics);
    
    // Keep only last 1000 requests to prevent memory issues
    if (this.metrics.requests.length > 1000) {
      this.metrics.requests = this.metrics.requests.slice(-1000);
    }
  }

  recordError(error: ErrorMetrics): void {
    this.metrics.errors.push(error);
    
    // Keep only last 100 errors
    if (this.metrics.errors.length > 100) {
      this.metrics.errors = this.metrics.errors.slice(-100);
    }
  }

  recordSystem(metrics: SystemMetrics): void {
    this.metrics.system.push(metrics);
    
    // Keep only last 100 system metrics
    if (this.metrics.system.length > 100) {
      this.metrics.system = this.metrics.system.slice(-100);
    }
  }

  getMetrics() {
    return {
      requests: {
        total: this.metrics.requests.length,
        recent: this.metrics.requests.slice(-10),
        averageResponseTime: this.calculateAverageResponseTime(),
        statusDistribution: this.calculateStatusDistribution(),
        topEndpoints: this.getTopEndpoints(),
      },
      errors: {
        total: this.metrics.errors.length,
        recent: this.metrics.errors.slice(-10),
        topErrors: this.getTopErrors(),
      },
      system: {
        current: this.metrics.system[this.metrics.system.length - 1] || null,
        averageMemory: this.calculateAverageMemory(),
        averageCpu: this.calculateAverageCpu(),
        uptime: this.metrics.system[0]?.uptime || 0,
      },
      summary: {
        totalRequests: this.metrics.requests.length,
        errorRate: this.calculateErrorRate(),
        averageResponseTime: this.calculateAverageResponseTime(),
      }
    };
  }

  private calculateAverageResponseTime(): number {
    if (this.metrics.requests.length === 0) return 0;
    
    const totalTime = this.metrics.requests.reduce((sum, req) => sum + req.duration, 0);
    return totalTime / this.metrics.requests.length;
  }

  private calculateStatusDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    this.metrics.requests.forEach(req => {
      const status = req.statusCode.toString();
      distribution[status] = (distribution[status] || 0) + 1;
    });
    
    return distribution;
  }

  private getTopEndpoints(): Array<{ path: string; count: number }> {
    const endpointCounts: Record<string, number> = {};
    
    this.metrics.requests.forEach(req => {
      const path = req.path;
      endpointCounts[path] = (endpointCounts[path] || 0) + 1;
    });
    
    return Object.entries(endpointCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private getTopErrors(): Array<{ message: string; count: number }> {
    const errorCounts: Record<string, number> = {};
    
    this.metrics.errors.forEach(error => {
      const message = error.message;
      errorCounts[message] = (errorCounts[message] || 0) + 1;
    });
    
    return Object.entries(errorCounts)
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateErrorRate(): number {
    if (this.metrics.requests.length === 0) return 0;
    return (this.metrics.errors.length / this.metrics.requests.length) * 100;
  }

  private calculateAverageMemory(): number {
    if (this.metrics.system.length === 0) return 0;
    
    const totalMemory = this.metrics.system.reduce((sum, sys) => sum + sys.memory.used, 0);
    return totalMemory / this.metrics.system.length;
  }

  private calculateAverageCpu(): number {
    if (this.metrics.system.length === 0) return 0;
    
    const totalCpu = this.metrics.system.reduce((sum, sys) => sum + sys.cpu.usage, 0);
    return totalCpu / this.metrics.system.length;
  }

  reset(): void {
    this.metrics = {
      requests: [],
      errors: [],
      system: [],
    };
  }
}

export const analytics = new AnalyticsCollector();
