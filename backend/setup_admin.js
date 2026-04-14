// Script to create admin user and activate admin dashboard

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to database
const db = new sqlite3.Database(path.join(__dirname, 'ethiopian_electronics.db'));

// Create admin user
async function createAdminUser() {
  return new Promise((resolve, reject) => {
    console.log('Creating admin user...');
    
    // First, let's check if admin user already exists
    db.get("SELECT * FROM users WHERE username = 'admin'", (err, row) => {
      if (err) {
        console.error('Error checking admin user:', err);
        reject(err);
        return;
      }
      
      if (row) {
        console.log('✅ Admin user already exists!');
        console.log(`👤 Username: ${row.username}`);
        console.log(`📧 Email: ${row.email}`);
        console.log(`🔑 Role: ${row.role}`);
        resolve(row);
        return;
      }
      
      // Create admin user
      const adminSQL = `
        INSERT INTO users (username, email, password, role, phone, is_verified) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const adminData = [
        'admin',
        'admin@dilla-electronics.com',
        'admin123', // Simple password for testing
        'admin',
        '+251900000000',
        1 // Verified
      ];
      
      db.run(adminSQL, adminData, function(err) {
        if (err) {
          console.error('Error creating admin user:', err);
          reject(err);
          return;
        }
        
        console.log('✅ Admin user created successfully!');
        console.log(`👤 Username: admin`);
        console.log(`📧 Email: admin@dilla-electronics.com`);
        console.log(`🔑 Password: admin123`);
        console.log(`🔑 Role: admin`);
        console.log(`📱 Phone: +251900000000`);
        console.log(`✅ Verified: Yes`);
        
        resolve({ id: this.lastID, username: 'admin' });
      });
    });
  });
}

// Check admin dashboard access
function checkAdminDashboard() {
  console.log('\n🔍 Checking admin dashboard access...');
  console.log('📍 Admin Dashboard URL: http://localhost:3000/admin');
  console.log('📍 Login URL: http://localhost:3000/login');
  console.log('\n📋 Login Instructions:');
  console.log('1. Go to http://localhost:3000/login');
  console.log('2. Username: admin');
  console.log('3. Password: admin123');
  console.log('4. Click Login');
  console.log('5. You should see admin dashboard');
}

// Create admin login page if it doesn't exist
function createAdminLoginPage() {
  const fs = require('fs');
  const path = require('path');
  
  const adminLoginHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - Ethiopian Electronics</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-width: 400px;
            width: 100%;
        }
        .admin-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .admin-header h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 28px;
        }
        .admin-header p {
            color: #7f8c8d;
            margin: 5px 0 0 0;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #2c3e50;
            font-weight: bold;
        }
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            box-sizing: border-box;
        }
        .form-group input:focus {
            border-color: #667eea;
            outline: none;
        }
        .login-btn {
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .admin-info {
            background: #e8f4fd;
            border: 1px solid #bee5eb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .admin-info h3 {
            color: #0c5460;
            margin: 0 0 10px 0;
        }
        .admin-info p {
            color: #0c5460;
            margin: 5px 0;
            font-size: 14px;
        }
        .back-link {
            text-align: center;
            margin-top: 20px;
        }
        .back-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: bold;
        }
        .back-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="admin-header">
            <h1>🔐 Admin Login</h1>
            <p>Ethiopian Electronics Marketplace</p>
        </div>
        
        <div class="admin-info">
            <h3>📋 Admin Credentials</h3>
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> admin123</p>
            <p><strong>Role:</strong> Administrator</p>
        </div>
        
        <form id="adminLoginForm">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" value="admin" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" value="admin123" required>
            </div>
            
            <button type="submit" class="login-btn">🚀 Login to Admin Dashboard</button>
        </form>
        
        <div class="back-link">
            <a href="http://localhost:3000">← Back to Homepage</a>
        </div>
    </div>

    <script>
        document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple login simulation (in real app, this would authenticate with backend)
            if (username === 'admin' && password === 'admin123') {
                // Store admin session
                localStorage.setItem('adminToken', 'admin-session-token');
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('username', 'admin');
                
                // Redirect to admin dashboard
                window.location.href = 'http://localhost:3000/admin';
            } else {
                alert('❌ Invalid credentials! Please use admin/admin123');
            }
        });
    </script>
</body>
</html>`;
  
  const adminLoginPath = path.join(__dirname, '..', 'admin-login.html');
  fs.writeFileSync(adminLoginPath, adminLoginHTML);
  console.log('✅ Admin login page created: admin-login.html');
}

// Run the script
async function setupAdmin() {
  try {
    await createAdminUser();
    createAdminLoginPage();
    checkAdminDashboard();
    
    console.log('\n🎉 Admin setup completed!');
    console.log('\n📱 Next Steps:');
    console.log('1. Open: admin-login.html (in your project folder)');
    console.log('2. Login with: admin / admin123');
    console.log('3. Access: Admin dashboard');
    console.log('4. Control: Users, shops, products');
    
    db.close();
  } catch (error) {
    console.error('❌ Admin setup failed:', error);
    db.close();
  }
}

setupAdmin();
