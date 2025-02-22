const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");

const INPUT_FOLDER = "E:/AljazariTemplate/converter-icon/icons";
const OUTPUT_FOLDER = "E:/AljazariTemplate/converter-icon/iconsresults";
const README_FILE = "E:/AljazariTemplate/converter-icon/README.md";
const SIZES = [16, 32, 64, 128, 256];

if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
}

async function convertImage(file) {
    if (!file.endsWith(".png")) return;
    
    const inputPath = path.join(INPUT_FOLDER, file);
    const baseName = path.basename(file, ".png");

    try {
        console.log(`🔄 Processing: ${inputPath}`);
        const image = await Jimp.read(inputPath);

        for (const size of SIZES) {
            const outputPath = path.join(OUTPUT_FOLDER, `${baseName}_${size}.png`);
            await image.resize(size, size).writeAsync(outputPath);
            console.log(`✅ Created: ${outputPath}`);
        }
    } catch (err) {
        console.error(`❌ Error processing ${file}:`, err);
    }
}

// Proses semua gambar
fs.readdirSync(INPUT_FOLDER).forEach(convertImage);

setTimeout(() => {
    const icons = fs.readdirSync(OUTPUT_FOLDER).filter(file => file.endsWith(".png"));

    // Buat struktur grouping
    const groupedIcons = {};
    icons.forEach(file => {
        const match = file.match(/^(.+?)_\d+\.png$/);
        if (match) {
            const baseName = match[1];
            if (!groupedIcons[baseName]) {
                groupedIcons[baseName] = [];
            }
            groupedIcons[baseName].push(file);
        }
    });

    // Buat isi README.md
    let markdownContent = `# Icon List\n\n`;
    Object.keys(groupedIcons).forEach(group => {
        markdownContent += `## ${group}.png\n`;
        groupedIcons[group].forEach(icon => {
            markdownContent += `- ![${icon}](./iconsresults/${icon}) \`${icon}\`\n`;
        });
        markdownContent += "\n";
    });

    fs.writeFileSync(README_FILE, markdownContent);
    console.log(`🎉 README.md updated successfully!`);
}, 3000);
