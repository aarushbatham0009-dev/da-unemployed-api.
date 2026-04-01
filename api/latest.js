const axios = require('axios');

module.exports = async (req, res) => {
  try {
    // 1. Sabse pehle headers set karo
    const config = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 5000 // 5 seconds wait karega
    };

    // 2. Data fetch karo (Check karo ki 'da-unemployed' spelling sahi hai na?)
    const response = await axios.get('https://api.chess.com/pub/club/da-unemployed/members', config);
    
    // 3. Check karo data kahan hai (Kabhi 'weekly' mein hota hai, kabhi 'all_time' mein)
    const members = response.data.weekly || response.data.all_time || [];
    const latest = members.length > 0 ? members[members.length - 1].username : "No Member";

    // 4. SVG Image Output
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`
      <svg width="260" height="70" viewBox="0 0 260 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="70" rx="20" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>
        <circle cx="35" cy="35" r="18" fill="#00ff88" />
        <text x="27" y="42" fill="black" font-family="sans-serif" font-size="18">👤</text>
        <text x="65" y="35" fill="white" font-family="sans-serif" font-size="14" font-weight="bold">@${latest}</text>
        <text x="65" y="52" fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="10">LIVE MEMBER ⚡</text>
      </svg>
    `);
  } catch (error) {
    // AGAR AB BHI ERROR AAYA, TO YE SCREEN PAR DIKHEGA
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(`
      <svg width="260" height="70" xmlns="http://www.w3.org/2000/svg">
        <rect width="260" height="70" fill="#222" rx="15"/>
        <text x="10" y="40" fill="red" font-family="sans-serif" font-size="12">ERROR: ${error.message}</text>
      </svg>
    `);
  }
};
