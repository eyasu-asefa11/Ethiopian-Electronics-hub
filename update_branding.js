const fs = require('fs');
const path = require('path');

// Function to update all files in a directory
function updateFilesInDirectory(directory, oldText, newText, extensions) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      updateFilesInDirectory(filePath, oldText, newText, extensions);
    } else if (extensions.includes(path.extname(file))) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(oldText)) {
          content = content.replace(new RegExp(oldText, 'g'), newText);
          fs.writeFileSync(filePath, content);
          console.log(`Updated: ${filePath}`);
        }
      } catch (error) {
        console.log(`Error reading ${filePath}:`, error.message);
      }
    }
  });
}

// Update all files
console.log('Updating "Ethiopian Electronics" to "Ethiopian Electronics"...');
updateFilesInDirectory('.', 'Ethiopian Electronics', 'Ethiopian Electronics', ['.js', '.html', '.css', '.json', '.sql']);
updateFilesInDirectory('.', 'ethiopian electronics', 'ethiopian electronics', ['.js', '.html', '.css', '.json', '.sql']);
updateFilesInDirectory('.', 'ethiopian_electronics', 'ethiopian_electronics', ['.js', '.html', '.css', '.json', '.sql']);

console.log('Update complete!');
