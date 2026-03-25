require('dotenv').config();
const MemBrainClient = require('./config/memBrain');

async function testAPI() {
  console.log('🚀 Testing Mem-Brain API Connection...');
  console.log('API Key:', process.env.MEMBRAIN_API_KEY ? '✅ Loaded' : '❌ Missing');
  
  const client = new MemBrainClient(process.env.MEMBRAIN_API_KEY);
  
  try {
    // Test 1: Store a memory
    console.log('\n📝 Test 1: Storing a memory...');
    const storeResult = await client.storeMemory(
      'Student is learning Algebra and understands basic equations',
      ['student.test', 'concept.algebra', 'type.test'],
      'test'
    );
    console.log('Store result:', storeResult);
    
    // Test 2: Search for memories
    console.log('\n🔍 Test 2: Searching memories...');
    const searchResult = await client.searchMemories(
      'algebra equations',
      5,
      'interpreted'
    );
    console.log('Search result:', JSON.stringify(searchResult, null, 2));
    
    console.log('\n✅ All tests passed! Your API key is working!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();