export const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInMs = duration[0] * 1000 + duration[1] / 1e6;
    
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${durationInMs.toFixed(2)}ms`);
    
    // Log slow requests
    if (durationInMs > 1000) {
      console.warn(`Slow request detected: ${req.method} ${req.originalUrl} took ${durationInMs.toFixed(2)}ms`);
    }
  });
  
  next();
};