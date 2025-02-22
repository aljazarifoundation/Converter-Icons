const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");

const INPUT_FOLDER = "E:/AljazariTemplate/converter-icon/icons";
const OUTPUT_FOLDER = "E:/AljazariTemplate/converter-icon/resized-icons";
const README_FILE = "E:/AljazariTemplate/converter-icon/README.md";

if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
}

const sizes = [16, 32, 48, 64, 128, 256, 512];

async function processImages() {
    const imagesData = {};
    const files = fs.readdirSync(INPUT_FOLDER).filter(file => file.endsWith(".png"));

    await Promise.all(files.map(async (file) => {
        const inputPath = path.join(INPUT_FOLDER, file);
        const baseName = path.basename(file, ".png");
        imagesData[baseName] = [];

        try {
            const image = await Jimp.read(inputPath);
            await Promise.all(sizes.map(async (size) => {
                const outputFileName = `${baseName}_${size}.png`;
                const outputPath = path.join(OUTPUT_FOLDER, outputFileName);
                await image.clone().resize(size, size).quality(100).writeAsync(outputPath);
                imagesData[baseName].push(outputFileName);
            }));
            console.log(`✅ Processed: ${file}`);
        } catch (err) {
            console.error(`❌ Error processing ${file}:`, err);
        }
    }));

    return imagesData;
}

async function updateReadme() {
    const imagesData = await processImages();
    let markdownContent = `# Resized Icons\n\n`;

    Object.entries(imagesData).forEach(([baseName, files]) => {
        markdownContent += `## ${baseName}\n\n`;
        markdownContent += "| 16px | 32px | 48px | 64px | 128px | 256px | 512px |\n";
        markdownContent += "|------|------|------|------|-------|-------|-------|\n";
        markdownContent += `| ${files.map(f => `![${f}](./resized-icons/${f})`).join(" | ")} |\n\n`;
    });

    fs.writeFileSync(README_FILE, markdownContent);
    console.log(`📄 README.md updated with ${Object.keys(imagesData).length} images!`);
}

updateReadme();
