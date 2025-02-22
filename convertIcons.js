const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");

const INPUT_FOLDER = "E:/AljazariTemplate/converter-icon/icons";
const OUTPUT_FOLDER = "E:/AljazariTemplate/converter-icon/resized-icons";
const README_FILE = "E:/AljazariTemplate/converter-icon/README.md";

// Ensure output folder exists
if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
}

// Standard sizes for icons
const sizes = [16, 32, 48, 64, 128, 256, 512];
const imagesData = {};

// Process images
fs.readdirSync(INPUT_FOLDER).forEach(async (file) => {
    if (file.endsWith(".png")) {
        const inputPath = path.join(INPUT_FOLDER, file);
        const baseName = path.basename(file, ".png");
        imagesData[baseName] = [];

        try {
            const image = await Jimp.read(inputPath);
            for (const size of sizes) {
                const outputFileName = `${baseName}_${size}.png`;
                const outputPath = path.join(OUTPUT_FOLDER, outputFileName);
                await image.clone().resize(size, size).quality(100).writeAsync(outputPath);
                imagesData[baseName].push(outputFileName);
                console.log(`✅ Resized ${file} → ${outputFileName}`);
            }
        } catch (err) {
            console.error(`❌ Error processing ${file}:`, err);
        }
    }
});

// Generate README after processing images
setTimeout(() => {
    let markdownContent = `# Resized Icons\n\n`;
    
    for (const [baseName, files] of Object.entries(imagesData)) {
        markdownContent += `## ${baseName}\n\n`;
        markdownContent += "| 16px | 32px | 48px | 64px | 128px | 256px | 512px |\n";
        markdownContent += "|------|------|------|------|-------|-------|-------|\n";
        markdownContent += `| ${files.map(f => `![${f}](./resized-icons/${f})`).join(" | ")} |\n\n`;
    }

    fs.writeFileSync(README_FILE, markdownContent);
    console.log(`📄 README.md updated with ${Object.keys(imagesData).length} grouped icons!`);
}, 5000);
