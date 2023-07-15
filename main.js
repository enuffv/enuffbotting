const fs = require('fs');
const path = require('path');

const directory = __dirname; // Use the current directory where the code is located

// Function to filter files with "cookie" in the filename
function filterCookiesFiles(file) {
  return file.includes('cookie');
}

// Function to read contents from each file
function readFiles(files) {
  const cookiesList = [];
  
  files.forEach((file, index) => {
    const filePath = path.join(directory, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const cookies = JSON.parse(fileContent);
    
    cookiesList.push(cookies);
    
    if (index !== files.length - 1) {
      cookiesList.push(); // Add a null value to separate cookie sets
    }
  });
  
  return cookiesList;
}

// Function to write contents to cookieslist.json
function writeToFile(contents) {
  const jsonData = JSON.stringify(contents, null, 2);
  const updatedJsonData = jsonData.replace(/\[\],/g, '],');
  fs.writeFileSync('cookieslist.json', updatedJsonData);
}

// Get a list of files in the directory
fs.readdir(directory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }
  
  // Filter files with "cookie" in the filename
  const cookiesFiles = files.filter(filterCookiesFiles);
  
  // Read contents from each file
  const contents = readFiles(cookiesFiles);
  
  // Write contents to cookieslist.json
  writeToFile(contents);
  
  console.log('Cookies list created successfully!');
});
