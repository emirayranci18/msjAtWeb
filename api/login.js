// Basit login API
export default function handler(req, res) {
  // CORS ayarları
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Basit kullanıcı kontrolü (şimdilik hardcoded)
  const users = [
    { username: 'admin', password: '123456' },
    { username: 'test', password: 'test123' },
    { username: 'demo', password: 'demo123' }
  ];

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Başarılı giriş
    res.status(200).json({ 
      success: true, 
      message: 'Giriş başarılı!',
      user: { username: user.username }
    });
  } else {
    // Başarısız giriş
    res.status(401).json({ 
      success: false, 
      message: 'Kullanıcı adı veya şifre hatalı!' 
    });
  }
}
