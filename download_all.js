const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const downloads = [
  {
    name: 'mkz-02-agha-noor-kurti.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0252/1160/0992/files/WhatsAppImage2026-09-05at4.16.09PM.jpg?width=1000'
  },
  {
    name: 'mkz-03-asim-jofa-jacquard.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0690/7320/7593/files/01_aa0ad884-7ad5-44f1-addd-829715f7bc8d.jpg?width=1000'
  },
  {
    name: 'mkz-04-gul-ahmed-lawn.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0706/3253/8159/files/3PCLawnPrintedSuitIUSTKSD-2694_Front1_102f3134-bb2f-4986-83df-b48eb816e043.jpg?width=1000'
  },
  {
    name: 'mkz-05-grace-washwear.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0702/2487/1584/files/JJMS-4236.jpg?width=1000'
  },
  {
    name: 'mkz-06-boski-silk.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0702/2487/1584/files/JJMS-4129.jpg?width=1000'
  },
  {
    name: 'mkz-07-embroidered-kurta.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0702/2487/1584/files/JJKS-KP-90579_3.jpg?width=1000'
  },
  {
    name: 'mkz-08-j-cotton-kurta.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0702/2487/1584/files/JJK-60204_2.jpg?width=1000'
  },
  {
    name: 'mkz-09-bridal-velvet-bedding.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0706/3253/8159/files/AW25-BB-008-_1.jpg?width=1000'
  },
  {
    name: 'mkz-10-cotton-bedsheet.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0706/3253/8159/files/AW26-006-_2_930a0cc0-ac88-4372-ba84-43a05634b4ff.jpg?width=1000'
  },
  {
    name: 'mkz-11-mattress-protector.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0706/3253/8159/files/White-Fitted-sheet-_1.jpg?width=1000'
  },
  {
    name: 'mkz-12-cambodian-oudh.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0434/3604/8550/files/DunhilOud_af36e3bd-5f81-4aa5-917c-c3c7251e8863.webp?width=1000'
  },
  {
    name: 'mkz-13-bleu-perfume-oil.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0434/3604/8550/files/PASSIONOUD_118fe553-b726-4dfd-80d4-02f6fb18ee4e.webp?width=1000'
  },
  {
    name: 'mkz-14-white-musk-tahara.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0434/3604/8550/files/WhiteOud12ml.webp?width=1000'
  },
  {
    name: 'mkz-17-gan-charger.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0695/8832/0569/files/01_e962ed57-3981-4d90-8dea-c0dd108af643.webp?width=1000'
  },
  {
    name: 'mkz-19-rfid-leather-wallet.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0466/9653/0085/files/US-WL-5309.jpg?width=1000'
  },
  {
    name: 'mkz-20-zalmi-chappal.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0466/9653/0085/files/US-PW-6303_BLACK_1.jpg?width=1000'
  },
  {
    name: 'mkz-21-heavy-food-chopper.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0669/7716/9617/files/S51d99f79367d4788810b48572de83eb1N.jpg_720x720q80_1.jpg'
  },
  {
    name: 'mkz-22-water-dispenser-pump.jpg',
    url: 'https://kitchenly.pk/cdn/shop/files/33e0b91ea8ea420ed8c12abcae548784.jpg?width=1000'
  },
  {
    name: 'mkz-23-mandoline-slicer.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0669/7716/9617/files/2e471a52a29d8ee3972d2588ba325c1d.jpg?width=1000'
  },
  {
    name: 'mkz-24-vacuum-thermal-flask.jpg',
    url: 'https://cdn.shopify.com/s/files/1/0669/7716/9617/files/368819050_1252597148785625_4587975821074754667_n_800x_78909946-dbff-49ad-85cf-b2679bdb8792.webp?width=1000'
  }
];

const destDir = 'c:/Users/Dw/Desktop/e-commerce/public/products';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with HTTP ${res.statusCode} for ${url}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', reject);
    });
    req.on('error', reject);
  });
}

async function run() {
  for (const item of downloads) {
    const target = path.join(destDir, item.name);
    try {
      console.log(`Downloading ${item.name}...`);
      await downloadFile(item.url, target);
      const stat = fs.statSync(target);
      console.log(`  -> SUCCESS! (${(stat.size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`  -> ERROR for ${item.name}: ${e.message}`);
    }
  }
  console.log('All downloads finished!');
}

run();
