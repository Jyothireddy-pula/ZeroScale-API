const ZeroScaleAPI = require('./index.js');

async function main() {
  console.log('🚀 ZeroScale API Node.js Client Example\n');

  // Initialize the API client
  const api = new ZeroScaleAPI({
    baseURL: 'https://api.zeroscale.dev/api/v1'
  });

  try {
    // Example 1: Login
    console.log('\n📝 Logging in...');
    const loginResult = await api.login('user@example.com', 'password123');
    
    if (!loginResult.success) {
      console.error('❌ Login failed:', loginResult.error);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('User:', loginResult.user.name);
    console.log('Token:', loginResult.token.substring(0, 20) + '...');

    // Example 2: Get all hosts
    console.log('\n🏠 Fetching hosts...');
    const hostsResult = await api.getHosts({ page: 1, limit: 5 });
    
    if (hostsResult.success) {
      console.log(`✅ Found ${hostsResult.data.length} hosts:`);
      hostsResult.data.forEach((host, index) => {
        console.log(`\n${index + 1}. ${host.name}`);
        console.log(`   📍 ${host.state}`);
        console.log(`   ⭐ ${host.rating}/5`);
        console.log(`   📝 ${host.description.substring(0, 60)}...`);
      });
    } else {
      console.error('❌ Failed to fetch hosts:', hostsResult.error);
    }

    // Example 3: Get host details
    if (hostsResult.data.length > 0) {
      const firstHost = hostsResult.data[0];
      console.log(`\n🔍 Getting details for: ${firstHost.name}`);
      
      const hostDetail = await api.getHost(firstHost._id);
      if (hostDetail.success) {
        console.log(`✅ Host details: ${hostDetail.data.name}`);
        console.log(`   📍 ${hostDetail.data.state}`);
        console.log(`   ⭐ ${hostDetail.data.rating}/5`);
        console.log(`   📝 ${hostDetail.data.description}`);
      }

      // Example 4: Get reviews for this host
      console.log(`\n💬 Getting reviews for: ${firstHost.name}`);
      const reviewsResult = await api.getReviews(firstHost._id, { page: 1, limit: 3 });
      
      if (reviewsResult.success) {
        console.log(`✅ Found ${reviewsResult.data.length} reviews:`);
        reviewsResult.data.forEach((review, index) => {
          console.log(`\n${index + 1}. ⭐ ${review.rating}/5`);
          console.log(`   💬 "${review.comment}"`);
          console.log(`   📅 ${new Date(review.createdAt).toLocaleDateString()}`);
        });
      }
    }

    // Example 5: Create a new host
    console.log('\n➕ Creating a new host...');
    const newHostResult = await api.createHost({
      name: 'Demo Restaurant',
      state: 'California',
      description: 'A great place to eat with amazing food and service',
      rating: 4.2
    });
    
    if (newHostResult.success) {
      console.log('✅ New host created successfully!');
      console.log(`   ID: ${newHostResult.data._id}`);
      console.log(`   Name: ${newHostResult.data.name}`);
    } else {
      console.error('❌ Failed to create host:', newHostResult.error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
