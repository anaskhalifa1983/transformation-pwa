/**
 * Performance Testing Script for Transformation PWA
 * Run this in the browser console to measure performance metrics
 */

class PerformanceTester {
    constructor() {
        this.metrics = {};
        this.startTime = performance.now();
    }

    // Measure DOM query performance
    measureDOMQueries() {
        const iterations = 1000;
        const startTime = performance.now();
        
        for (let i = 0; i < iterations; i++) {
            document.getElementById('currentTime');
            document.getElementById('weekGrid');
            document.querySelectorAll('.view');
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.metrics.domQueries = {
            iterations,
            duration,
            averageTime: duration / iterations
        };
        
        console.log(`DOM Queries (${iterations} iterations):`, {
            totalTime: `${duration.toFixed(2)}ms`,
            averageTime: `${(duration / iterations).toFixed(4)}ms per query`
        });
    }

    // Measure schedule generation performance
    measureScheduleGeneration() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const results = {};
        
        days.forEach(day => {
            const startTime = performance.now();
            
            // Simulate schedule generation
            const scheduleEl = document.getElementById(`${day}Schedule`);
            if (scheduleEl) {
                const fragment = document.createDocumentFragment();
                for (let i = 0; i < 9; i++) {
                    const timeBlock = document.createElement('div');
                    timeBlock.className = 'time-block';
                    timeBlock.innerHTML = `
                        <div class="time">Test Time</div>
                        <div class="activity">Test Activity</div>
                        <div class="description">Test Description</div>
                    `;
                    fragment.appendChild(timeBlock);
                }
                scheduleEl.appendChild(fragment);
            }
            
            const endTime = performance.now();
            results[day] = endTime - startTime;
        });
        
        this.metrics.scheduleGeneration = results;
        
        const totalTime = Object.values(results).reduce((sum, time) => sum + time, 0);
        console.log('Schedule Generation Performance:', {
            totalTime: `${totalTime.toFixed(2)}ms`,
            averageTime: `${(totalTime / days.length).toFixed(2)}ms per day`,
            breakdown: results
        });
    }

    // Measure view switching performance
    measureViewSwitching() {
        const views = ['week-overview', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const results = {};
        
        views.forEach(viewId => {
            const startTime = performance.now();
            
            // Simulate view switching
            document.querySelectorAll('.view').forEach(view => {
                view.classList.remove('active');
            });
            
            const targetView = document.getElementById(viewId);
            if (targetView) {
                targetView.classList.add('active');
            }
            
            const endTime = performance.now();
            results[viewId] = endTime - startTime;
        });
        
        this.metrics.viewSwitching = results;
        
        const totalTime = Object.values(results).reduce((sum, time) => sum + time, 0);
        console.log('View Switching Performance:', {
            totalTime: `${totalTime.toFixed(2)}ms`,
            averageTime: `${(totalTime / views.length).toFixed(2)}ms per switch`,
            breakdown: results
        });
    }

    // Measure memory usage
    measureMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            this.metrics.memory = {
                usedJSHeapSize: memory.usedJSHeapSize,
                totalJSHeapSize: memory.totalJSHeapSize,
                jsHeapSizeLimit: memory.jsHeapSizeLimit
            };
            
            console.log('Memory Usage:', {
                used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
                total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
                limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
                usagePercentage: `${((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100).toFixed(1)}%`
            });
        } else {
            console.log('Memory usage not available in this browser');
        }
    }

    // Measure animation performance
    measureAnimationPerformance() {
        return new Promise((resolve) => {
            const card = document.querySelector('.day-card');
            if (!card) {
                console.log('No day card found for animation testing');
                resolve();
                return;
            }

            let frameCount = 0;
            const startTime = performance.now();
            
            const animate = () => {
                frameCount++;
                card.style.transform = `translateY(${Math.sin(frameCount * 0.1) * 5}px)`;
                
                if (frameCount < 60) { // 1 second at 60fps
                    requestAnimationFrame(animate);
                } else {
                    const endTime = performance.now();
                    const duration = endTime - startTime;
                    const fps = frameCount / (duration / 1000);
                    
                    this.metrics.animation = {
                        frameCount,
                        duration,
                        fps
                    };
                    
                    console.log('Animation Performance:', {
                        frames: frameCount,
                        duration: `${duration.toFixed(2)}ms`,
                        fps: `${fps.toFixed(1)} FPS`
                    });
                    
                    card.style.transform = '';
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }

    // Measure overall page load performance
    measurePageLoadPerformance() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            this.metrics.pageLoad = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
            };
            
            console.log('Page Load Performance:', {
                domContentLoaded: `${this.metrics.pageLoad.domContentLoaded.toFixed(2)}ms`,
                loadComplete: `${this.metrics.pageLoad.loadComplete.toFixed(2)}ms`,
                totalLoadTime: `${this.metrics.pageLoad.totalLoadTime.toFixed(2)}ms`
            });
        }
    }

    // Run all performance tests
    async runAllTests() {
        console.log('🚀 Starting Performance Tests...\n');
        
        this.measurePageLoadPerformance();
        this.measureDOMQueries();
        this.measureScheduleGeneration();
        this.measureViewSwitching();
        this.measureMemoryUsage();
        await this.measureAnimationPerformance();
        
        const totalTime = performance.now() - this.startTime;
        console.log(`\n✅ All tests completed in ${totalTime.toFixed(2)}ms`);
        
        return this.metrics;
    }

    // Generate performance report
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            metrics: this.metrics
        };
        
        console.log('\n📊 Performance Report:', JSON.stringify(report, null, 2));
        
        // Save to localStorage for comparison
        const reports = JSON.parse(localStorage.getItem('performanceReports') || '[]');
        reports.push(report);
        localStorage.setItem('performanceReports', JSON.stringify(reports));
        
        return report;
    }

    // Compare with previous reports
    compareWithPrevious() {
        const reports = JSON.parse(localStorage.getItem('performanceReports') || '[]');
        if (reports.length < 2) {
            console.log('Need at least 2 reports for comparison');
            return;
        }
        
        const current = reports[reports.length - 1];
        const previous = reports[reports.length - 2];
        
        console.log('\n📈 Performance Comparison:');
        
        if (current.metrics.domQueries && previous.metrics.domQueries) {
            const improvement = ((previous.metrics.domQueries.averageTime - current.metrics.domQueries.averageTime) / previous.metrics.domQueries.averageTime * 100);
            console.log(`DOM Queries: ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}% improvement`);
        }
        
        if (current.metrics.animation && previous.metrics.animation) {
            const improvement = ((current.metrics.animation.fps - previous.metrics.animation.fps) / previous.metrics.animation.fps * 100);
            console.log(`Animation FPS: ${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}% improvement`);
        }
    }
}

// Auto-run performance tests when script is loaded
const tester = new PerformanceTester();

// Export for manual testing
window.PerformanceTester = PerformanceTester;
window.runPerformanceTests = () => tester.runAllTests().then(() => {
    tester.generateReport();
    tester.compareWithPrevious();
});

console.log('🎯 Performance testing script loaded!');
console.log('Run "runPerformanceTests()" to start testing');
console.log('Or create a new instance: new PerformanceTester().runAllTests()');