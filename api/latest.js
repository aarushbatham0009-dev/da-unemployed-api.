const axios = require('axios');

module.exports = async (req, res) => {
  try {
    // Ye headers dalna compulsory hai warna Chess.com block kar dega
    const response = await axios.get('https://api.chess.com/pub/club/da-unemployed/members', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Compatible; ChessClubBot/1.0; +https://da-unemployed-api.vercel.app)'
      }
    });

    // Pehle check karo ki data mil raha hai ya nahi
    if (!response.data || !response.data.weekly) {
      throw new Error('Data format mismatch');
    }

    const members = response.data.weekly;
    const latest = members.length > 0 ? members[members.length - 1].username : "No New Member";

    // SVG Design (Transparent Glass Look)
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate'); 
    
    res.send(`
      <svg width="260" height="70" viewBox="0 0 260 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="70" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)"/>
        <circle cx="35" cy="35" r="18" fill="#00ff88" />
        <text x="27" y="42" fill="black" font-family="sans-serif" font-size="18">👤</text>
        <text x="65" y="32" fill="white" font-family="sans-serif" font-size="14" font-weight="bold">@${latest}</text>
        <text x="65" y="50" fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="10">NEWEST MEMBER • LIVE ⚡</text>
      </svg>
    `);
  } catch (error) {
    // Agar error aaye toh image mein hi error dikhega taaki pata chale kya hua
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`<svg width="260" height="70"><text x="10" y="40" fill="red">Error: ${error.message}</text></svg>`);
  }
};
