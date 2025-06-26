# Performance Optimizations for Yale Art Gallery API

This document outlines the performance optimizations implemented to improve query speed, especially for art object details.

## 🚀 Optimizations Implemented

### 1. Database Indexing
- **Added comprehensive indexes** on frequently queried columns:
  - `objects(id, label, accession_no)`
  - `agents(id, name, type)`
  - `production(obj_id, agt_id)`
  - `objects_classifier(obj_id, cls_id)`
  - `objects_department(obj_id, dep_id)`
  - `objects_place(obj_id, pl_id)`
  - `agents_nationality(agt_id, nat_id)`

### 2. SQLite Database Optimizations
- **WAL Mode**: Enabled Write-Ahead Logging for better concurrency
- **Memory Cache**: Increased SQLite cache size to 10MB
- **Memory Storage**: Temporary storage in memory for faster operations
- **Connection Pooling**: Optimized connection pool settings

### 3. Query Optimizations
- **Selective Attributes**: Only fetch required columns instead of entire records
- **Optimized Includes**: Better structured nested queries with ordering
- **SubQuery Disabled**: Improved performance for complex includes
- **Logging Disabled**: Reduced overhead in production

### 4. Caching System
- **In-Memory Cache**: 5-minute TTL for object details
- **Cache Manager**: Advanced cache management with statistics
- **Automatic Cleanup**: Expired entries are automatically removed
- **Cache Monitoring**: Real-time cache hit/miss statistics

### 5. Performance Monitoring
- **Request Timing**: Track response times for all endpoints
- **Slow Query Detection**: Identify queries taking >1000ms
- **Performance Metrics**: Average response times and query statistics
- **Real-time Monitoring**: Live performance dashboard endpoints

## 📊 Performance Endpoints

### Cache Management
- `GET /api/cache/stats` - View cache statistics
- `POST /api/cache/clear` - Clear specific or all caches

### Performance Monitoring
- `GET /api/performance` - Overall performance metrics
- `GET /api/performance/slow-queries` - List of slow queries
- `POST /api/performance/reset` - Reset performance metrics

## 🔧 Configuration

### Database Configuration (`src/config/database.js`)
```javascript
{
  dialect: 'sqlite',
  storage: './lux.sqlite',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    pragma: {
      journal_mode: 'WAL',
      synchronous: 'NORMAL',
      cache_size: 10000,
      temp_store: 'MEMORY'
    }
  }
}
```

### Cache Configuration
- **Object Details**: 5-minute TTL
- **Departments**: 10-minute TTL
- **Automatic Cleanup**: Every 5 minutes

## 📈 Expected Performance Improvements

### Before Optimization
- Object detail queries: 2-5 seconds
- Complex searches: 3-8 seconds
- No caching mechanism
- No performance monitoring

### After Optimization
- Object detail queries: 200-500ms (cached)
- Object detail queries: 800-1500ms (uncached)
- Complex searches: 1-3 seconds
- 80-90% cache hit rate for popular objects
- Real-time performance monitoring

## 🛠️ Usage Examples

### Check Cache Performance
```bash
curl http://localhost:5000/api/cache/stats
```

### Monitor Query Performance
```bash
curl http://localhost:5000/api/performance
```

### View Slow Queries
```bash
curl http://localhost:5000/api/performance/slow-queries?limit=20
```

## 🔍 Troubleshooting

### High Response Times
1. Check cache hit rates: `GET /api/cache/stats`
2. Review slow queries: `GET /api/performance/slow-queries`
3. Verify database indexes are created
4. Monitor memory usage

### Cache Issues
1. Clear cache: `POST /api/cache/clear`
2. Check cache statistics for hit rates
3. Adjust TTL values if needed

### Database Performance
1. Verify SQLite WAL mode is enabled
2. Check database file size and fragmentation
3. Monitor connection pool usage

## 📝 Best Practices

1. **Monitor Regularly**: Check performance metrics weekly
2. **Cache Wisely**: Don't cache frequently changing data
3. **Index Strategically**: Add indexes based on query patterns
4. **Clean Up**: Regularly clear old cache entries
5. **Scale Gradually**: Monitor performance as user base grows

## 🔄 Future Optimizations

1. **Redis Integration**: Replace in-memory cache with Redis
2. **Query Result Caching**: Cache complex search results
3. **Database Sharding**: Split large tables if needed
4. **CDN Integration**: Cache static assets and images
5. **Database Migration**: Consider PostgreSQL for larger scale