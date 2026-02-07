const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) results = results.concat(walk(fp));
    else results.push(fp);
  });
  return results;
}
console.log(walk('src/app').filter(f => f.endsWith('.tsx')).join('\n'));
