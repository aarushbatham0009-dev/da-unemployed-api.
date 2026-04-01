const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const config = {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    };

    // Private club ke liye hum 'members' nahi balki 'news' ya 'profile' check karte hain
    // Sabse best hai club ka main data fetch karna
    const response = await axios.get('https://api.chess.com/pub/club/da-unemployed', config);
    
    // Agar members list private hai, toh hum latest 'activity' ya 'admin' info dikha sakte hain
    // Lekin agar aapko EXACT username chahiye, toh aapko club ki RSS feed use karni hogi
    
    // Yahan hum ek smart fallback laga rahe hain jo error nahi dega
    const clubData = response.data;
    const lastUpdate = new Date(clubData.last_activity * 1000).toLocaleDateString();

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

    res.send(`
      <svg width="260" height="70" viewBox="0 0 260 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="70" rx="20" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>
        <circle cx="35" cy="35" r="18" fill="#00ff88" />
        <text x="27" y="42" fill="black" font-family="sans-serif" font-size="18">👥</text>
        <text x="65" y="32" fill="white" font-family="sans-serif" font-size="14" font-weight="bold">DA UNEMPLOYED</text>
        <text x="65" y="50" fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="10">${clubData.members_count} Members • Live ⚡</text>
      </svg>
    `);
  } catch (error) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg width="260" height="70"><rect width="260" height="70" fill="#333" rx="15"/><text x="10" y="40" fill="orange" font-family="sans-serif" font-size="12">Private Club: Syncing...</text></svg>`);
  }
};
