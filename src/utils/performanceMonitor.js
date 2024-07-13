const performanceMonitor = {
  startTime: null,
  endTime: null,
  measures: {},

  start(label) {
    if (!this.measures[label]) {
      this.measures[label] = [];
    }
    this.measures[label].push({ start: performance.now() });
    console.log(`Starting measurement for: ${label}`);
  },

  end(label) {
    const measure = this.measures[label]?.pop();
    if (measure) {
      measure.end = performance.now();
      measure.duration = measure.end - measure.start;
      console.log(`Ended measurement for: ${label}. Duration: ${measure.duration.toFixed(2)}ms`);
    } else {
      console.warn(`No start measurement found for: ${label}`);
    }
  },

  logMeasures() {
    console.log('Performance Measures:');
    Object.entries(this.measures).forEach(([label, measurements]) => {
      const totalDuration = measurements.reduce((sum, m) => sum + (m.duration || 0), 0);
      const avgDuration = totalDuration / measurements.length;
      console.log(`${label}: Avg ${avgDuration.toFixed(2)}ms (${measurements.length} measurements)`);
    });
  },

  clearMeasures() {
    this.measures = {};
  },
};

export default performanceMonitor;