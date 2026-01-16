const sharp = require('sharp');
console.log('Sharp version:', require('sharp/package.json').version);
console.log('Formats:', sharp.format);
console.log('HEIF support:', sharp.format.heif);
