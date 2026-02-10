const fs = require('fs');
const c = fs.readFileSync('src/app/admin/page.tsx', 'utf8').split('\n');
c.forEach((l, i) => {
  if (/fetchData|\.from\(["']videos|\.from\(["']media/.test(l))
    console.log((i + 1) + ': ' + l.trim());
});
