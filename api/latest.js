const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');

  const clubTag = 'da-unemployed';
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36';

  try {
    // METHOD 1: Sabse naya member nikalne ki koshish (Public/Private bypass)
    const memberRes = await axios.get(`https://api.chess.com/pub/club/${clubTag}/members`, {
      headers: { 'User-Agent': userAgent },
      timeout: 4000
    });

    let latestUser = "New Member";
    if (memberRes.data && memberRes.data.weekly && memberRes.data.weekly.length > 0) {
      latestUser = memberRes.data.weekly[memberRes.data.weekly.length - 1].username;
    } else if (memberRes.data && memberRes.data.all_time && memberRes.data.all_time.length > 0) {
      latestUser = memberRes.data.all_time[memberRes.data.all_time.length - 1].username;
    }

    // METHOD 2: Agar username nahi mila, toh club ka count uthao
    const clubRes = await axios.get(`https://api.chess.com/pub/club/${clubTag}`, {
      headers: { 'User-Agent': userAgent },
      timeout: 4000
    });
    const count = clubRes.data.members_count || "170+";

    // Design Output
    res.send(`
      <svg width="260" height="70" viewBox="0 0 260 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="70" rx="20" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)"/>
        <circle cx="35" cy="35" r="18" fill="#00ff88" />
        <text x="27" y="42" fill="black" font-family="sans-serif" font-size="18">👤</text>
        <text x="65" y="32" fill="white" font-family="sans-serif" font-size="14" font-weight="bold">@${latestUser}</text>
        <text x="65" y="50" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-size="10">${count} Members • Live ⚡</text>
      </svg>
    `);

  } catch (error) {
    // METHOD 3: Agar sab fail ho jaye toh bhi ek sunder box dikhao "Error" ki jagah
    res.send(`
      <svg width="260" height="70" viewBox="0 0 260 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="70" rx="20" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)"/>
        <circle cx="35" cy="35" r="18" fill="#555" />
        <text x="27" y="42" fill="white" font-family="sans-serif" font-size="18">♟️</text>
        <text x="65" y="32" fill="white" font-family="sans-serif" font-size="14" font-weight="bold">DA UNEMPLOYED</text>
        <text x="65" y="50" fill="#00ff88" font-family="sans-serif" font-size="10">Active & Growing • Live ⚡</text>
      </svg>
    `);
  }
};
