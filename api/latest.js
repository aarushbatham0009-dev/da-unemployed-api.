const axios = require('axios');

module.exports = async (req, res) => {
  try {
    // Aapke club ka data fetch ho raha hai
    const response = await axios.get('https://api.chess.com/pub/club/da-unemployed/members');
    const members = response.data.weekly;
    
    // Sabse naya member nikalna
    const latest = members[members.length - 1].username;

    // Glass Theme wala SVG Image banana
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    
    res.send(`
      <svg width="250" height="70" viewBox="0 0 250 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="250" height="70" rx="20" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>
        <circle cx="35" cy="35" r="20" fill="#00ff88"/>
        <text x="28" y="42" fill="black" font-family="sans-serif" font-size="18">👤</text>
        <text x="65" y="32" fill="white" font-family="sans-serif" font-size="14" font-weight="bold">@${latest}</text>
        <text x="65" y="50" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-size="10">Newest Member • Live ⚡</text>
      </svg>
    `);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
};
