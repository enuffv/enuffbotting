const fs = require('fs');
const path = require('path');

const directory = __dirname;

function filterCookiesFiles(file) {
  return file.includes('cookie');
}
function readFiles(files) {
  const cookiesList = [];
  
  files.forEach((file, index) => {
    const filePath = path.join(directory, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const cookies = JSON.parse(fileContent);
    
    cookiesList.push(cookies);
    
    if (index !== files.length - 1) {
      cookiesList.push();
    }
  });
  
  return cookiesList;
}

function writeToFile(contents) {
  const jsonData = JSON.stringify(contents, null, 2);
  const updatedJsonData = jsonData.replace(/\[\],/g, '],');
  fs.writeFileSync('cookieslist.json', updatedJsonData);
}

fs.readdir(directory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }
  const cookiesFiles = files.filter(filterCookiesFiles);
  const contents = readFiles(cookiesFiles);
  
  writeToFile(contents);
  
  console.log('Cookies list created successfully!');
});
