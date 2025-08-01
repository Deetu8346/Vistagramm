const mongoose = require('mongoose');
const Post = require('../models/Post');
require('dotenv').config();

// AI-generated realistic post data
const generateSeedData = () => {
  const usernames = [
    'sarah_explores', 'adventure_mike', 'cityscape_lens', 'nature_lover_23',
    'foodie_dreams', 'travel_diaries', 'urban_photographer', 'coffee_chronicles',
    'mountain_seeker', 'beach_vibes_only', 'artsy_captures', 'sunset_chaser',
    'street_stories', 'wanderlust_sam', 'local_flavors', 'hidden_gems_finder',
    'morning_rituals', 'weekend_warrior', 'creative_shots', 'life_moments'
  ];

  const captions = [
    "Golden hour hits different when you're chasing dreams ✨",
    "Found this hidden café and my soul is happy ☕️",
    "Sometimes the best adventures are in your own backyard 🏡",
    "Sunset therapy session complete 🌅",
    "Local markets always tell the best stories 📚",
    "When nature becomes your art gallery 🎨",
    "Coffee and contemplation - perfect Monday mood ☕️",
    "Street art that speaks to the heart ❤️",
    "Fresh ingredients, fresh perspective 🥬",
    "Urban exploration at its finest 🏙️",
    "Slow mornings are the best mornings ⏰",
    "Capturing light, capturing life 📸",
    "Weekend vibes in full effect 🎉",
    "Simple moments, profound beauty 🌸",
    "Architecture that takes your breath away 🏗️",
    "Food that tastes like home 🏠",
    "When the city sleeps, the magic awakens 🌙",
    "Nature's masterpiece never disappoints 🍃",
    "Finding peace in busy places 🧘‍♀️",
    "Every corner has a story to tell 📖"
  ];

  const imageUrls = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1429552077091-836152271555?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1543418219-44e4c1ad84a5?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1520637836862-4d197d17c726?w=800&h=800&fit=crop"
  ];

  const posts = [];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    // Generate timestamps spread across the past year
    const daysAgo = Math.floor(Math.random() * 365);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(timestamp.getHours() - hoursAgo);
    timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

    posts.push({
      username: usernames[i],
      imageUrl: imageUrls[i],
      caption: captions[i],
      timestamp: timestamp,
      likesCount: Math.floor(Math.random() * 150), // 0-149 likes
      shareCount: Math.floor(Math.random() * 50),  // 0-49 shares
      likedBy: [] // Empty for seed data
    });
  }

  // Sort by timestamp descending (most recent first)
  return posts.sort((a, b) => b.timestamp - a.timestamp);
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing posts
    const deleteResult = await Post.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing posts`);

    // Generate and insert seed data
    const seedData = generateSeedData();
    const insertedPosts = await Post.insertMany(seedData);
    console.log(`🎉 Successfully inserted ${insertedPosts.length} posts`);

    // Display some stats
    const totalPosts = await Post.countDocuments();
    const avgLikes = await Post.aggregate([
      { $group: { _id: null, avgLikes: { $avg: '$likesCount' } } }
    ]);
    const avgShares = await Post.aggregate([
      { $group: { _id: null, avgShares: { $avg: '$shareCount' } } }
    ]);

    console.log('\n📊 Database Statistics:');
    console.log(`   Total posts: ${totalPosts}`);
    console.log(`   Average likes per post: ${Math.round(avgLikes[0]?.avgLikes || 0)}`);
    console.log(`   Average shares per post: ${Math.round(avgShares[0]?.avgShares || 0)}`);
    
    // Show sample posts
    console.log('\n📝 Sample posts created:');
    insertedPosts.slice(0, 3).forEach((post, index) => {
      console.log(`   ${index + 1}. @${post.username}: "${post.caption.substring(0, 50)}..."`);
      console.log(`      Likes: ${post.likesCount}, Shares: ${post.shareCount}, Posted: ${post.timestamp.toLocaleDateString()}\n`);
    });

    console.log('✨ Database seeding completed successfully!');
    console.log('🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit();
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Run the seed function
seedDatabase();