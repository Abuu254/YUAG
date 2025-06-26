// Performance monitoring utility
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            queries: new Map(),
            slowQueries: [],
            totalRequests: 0,
            averageResponseTime: 0
        };

        // Keep only last 1000 slow queries
        this.maxSlowQueries = 1000;
    }

    // Start timing a query
    startTimer(queryName) {
        return {
            name: queryName,
            startTime: process.hrtime.bigint()
        };
    }

    // End timing and record metrics
    endTimer(timer) {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - timer.startTime) / 1000000; // Convert to milliseconds

        // Record query metrics
        if (!this.metrics.queries.has(timer.name)) {
            this.metrics.queries.set(timer.name, {
                count: 0,
                totalTime: 0,
                averageTime: 0,
                minTime: Infinity,
                maxTime: 0
            });
        }

        const queryMetrics = this.metrics.queries.get(timer.name);
        queryMetrics.count++;
        queryMetrics.totalTime += duration;
        queryMetrics.averageTime = queryMetrics.totalTime / queryMetrics.count;
        queryMetrics.minTime = Math.min(queryMetrics.minTime, duration);
        queryMetrics.maxTime = Math.max(queryMetrics.maxTime, duration);

        // Track slow queries (over 1000ms)
        if (duration > 1000) {
            this.metrics.slowQueries.push({
                name: timer.name,
                duration: duration,
                timestamp: new Date().toISOString()
            });

            // Keep only recent slow queries
            if (this.metrics.slowQueries.length > this.maxSlowQueries) {
                this.metrics.slowQueries = this.metrics.slowQueries.slice(-this.maxSlowQueries);
            }
        }

        this.metrics.totalRequests++;
        this.metrics.averageResponseTime =
            (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + duration) / this.metrics.totalRequests;

        return duration;
    }

    // Get performance metrics
    getMetrics() {
        const queryStats = {};
        for (const [name, metrics] of this.metrics.queries) {
            queryStats[name] = {
                ...metrics,
                averageTime: Math.round(metrics.averageTime * 100) / 100
            };
        }

        return {
            totalRequests: this.metrics.totalRequests,
            averageResponseTime: Math.round(this.metrics.averageResponseTime * 100) / 100,
            slowQueriesCount: this.metrics.slowQueries.length,
            recentSlowQueries: this.metrics.slowQueries.slice(-10), // Last 10 slow queries
            queryStats
        };
    }

    // Get slow queries
    getSlowQueries(limit = 50) {
        return this.metrics.slowQueries.slice(-limit);
    }

    // Reset metrics
    reset() {
        this.metrics = {
            queries: new Map(),
            slowQueries: [],
            totalRequests: 0,
            averageResponseTime: 0
        };
    }
}

// Create global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

// Middleware to monitor request performance
const performanceMiddleware = (req, res, next) => {
    const timer = performanceMonitor.startTimer(`${req.method} ${req.path}`);

    // Override res.end to capture response time
    const originalEnd = res.end;
    res.end = function(...args) {
        performanceMonitor.endTimer(timer);
        originalEnd.apply(this, args);
    };

    next();
};

module.exports = {
    performanceMonitor,
    performanceMiddleware
};