// Simple performance test script
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testPerformance() {
    console.log('🚀 Testing Performance Optimizations...\n');

    try {
        // Test 1: Check if server is running
        console.log('1. Testing server connectivity...');
        const healthCheck = await axios.get(`${BASE_URL}/objects?limit=1`);
        console.log('✅ Server is running\n');

        // Test 2: Test cache functionality
        console.log('2. Testing cache functionality...');
        const startTime = Date.now();

        // First request (should be slow)
        const firstRequest = await axios.get(`${BASE_URL}/objects/1`);
        const firstTime = Date.now() - startTime;

        // Second request (should be fast due to cache)
        const secondStartTime = Date.now();
        const secondRequest = await axios.get(`${BASE_URL}/objects/1`);
        const secondTime = Date.now() - secondStartTime;

        console.log(`   First request: ${firstTime}ms`);
        console.log(`   Second request: ${secondTime}ms`);
        console.log(`   Cache improvement: ${Math.round((firstTime - secondTime) / firstTime * 100)}%\n`);

        // Test 3: Check cache statistics
        console.log('3. Testing cache statistics...');
        const cacheStats = await axios.get(`${BASE_URL}/cache/stats`);
        console.log('   Cache Stats:', JSON.stringify(cacheStats.data.data, null, 2));
        console.log('');

        // Test 4: Check performance metrics
        console.log('4. Testing performance metrics...');
        const perfMetrics = await axios.get(`${BASE_URL}/performance`);
        console.log('   Performance Metrics:', JSON.stringify(perfMetrics.data.data, null, 2));
        console.log('');

        // Test 5: Test search performance
        console.log('5. Testing search performance...');
        const searchStartTime = Date.now();
        const searchResults = await axios.get(`${BASE_URL}/objects?query=art&criteria=title&limit=10`);
        const searchTime = Date.now() - searchStartTime;
        console.log(`   Search request: ${searchTime}ms`);
        console.log(`   Results found: ${searchResults.data.total}\n`);

        console.log('🎉 All performance tests completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Object detail queries: ${firstTime}ms (first), ${secondTime}ms (cached)`);
        console.log(`   - Search queries: ${searchTime}ms`);
        console.log(`   - Cache hit rate: ${cacheStats.data.data.hitRate * 100}%`);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the test
testPerformance();