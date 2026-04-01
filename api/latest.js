const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const config = {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    };

    // Step 1: Club ki Activity Feed check karna (Ye private clubs ke liye bhi open hoti hai)
    const response = await axios.get('https://www.chess.com/callback/club/activity/da-unemployed', config);
    
    // Step 2: Activity mein se 'joined' wala pehla message dhundna
    const activities = response.data.activities || [];
    const joinActivity = activities.find(a => a.type === 'joined' || a.type === 'member_joined');
    
    // Agar activity mil gayi toh naam nikaalo, warna general info dikhao
    let latestUser = "New Member";
    if (joinActivity && joinActivity.user) {
      latestUser = joinActivity.user.username;
    } else {
      // Fallback: Agar activity na mile toh club ki general API se count le lo
      const clubBase = await axios.get('https://api.chess.com/pub/club/da-unemployed', config);
      latestUser = `${clubBase.data.members_count} Members`;
    }

    // Step 3: Design Output
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');

    res.send(`
      <svg width="260" height="70" viewBox="0 0 260 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="70" rx="20" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>
        <circle cx="35" cy="35" r="18" fill="#00ff88" />
        <text x="27" y="42" fill="black" font-family="sans-serif" font-size="18" font-weight="bold">👤</text>
        <text x="65" y="32" fill="white" font-family="sans-serif" font-size="14" font-weight="bold">@${latestUser}</text>
        <text x="65" y="50" fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="10">NEWEST JOINING • LIVE ⚡</text>
      </svg>
    `);
  } catch (error) {
    // Agar Chess.com ne callback block kiya toh simple count dikhao
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`
      <svg width="260" height="70" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="70" fill="#222" rx="20"/>
        <text x="60" y="40" fill="white" font-family="sans-serif" font-size="14">Syncing DA UNEMPLOYED...</text>
      </svg>
    `);
  }
};
