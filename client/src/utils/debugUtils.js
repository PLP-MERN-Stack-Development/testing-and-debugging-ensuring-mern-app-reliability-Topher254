// Development debugging utilities
export const debug = {
  log: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 ${message}:`, data);
    }
  },
  
  warn: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ ${message}:`, data);
    }
  },
  
  error: (message, data) => {
    console.error(`❌ ${message}:`, data);
  },
  
  time: (label) => {
    if (process.env.NODE_ENV === 'development') {
      console.time(`⏱️ ${label}`);
    }
  },
  
  timeEnd: (label) => {
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(`⏱️ ${label}`);
    }
  },
  
  // Performance monitoring for functions
  measurePerformance: (fn, label = 'Function') => {
    return (...args) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🏎️ ${label} took ${(end - start).toFixed(2)}ms`);
      }
      
      return result;
    };
  }
};

// React component debugging
export const withDebug = (Component) => {
  return (props) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 ${Component.name} props:`, props);
    }
    return <Component {...props} />;
  };
};