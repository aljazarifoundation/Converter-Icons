const fs = require("fs");
const path = require("path");
const Jimp = require("jimp").default || require("jimp"); // ✅ FIXED

const INPUT_FOLDER = "E:/AljazariTemplate/generator-icon/icons";
const OUTPUT_FOLDER = "E:/AljazariTemplate/generator-icon/resized-icons";
const SIZES = [16, 32, 48, 64, 128, 256, 512];

if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
}

const pngFiles = fs.readdirSync(INPUT_FOLDER).filter(file => file.endsWith(".png"));

if (pngFiles.length === 0) {
    console.error("❌ No PNG files found in", INPUT_FOLDER);
    process.exit(1);
}

(async () => {
    for (const file of pngFiles) {
        const imageName = path.basename(file, ".png");
        const inputPath = path.join(INPUT_FOLDER, file);

        try {
            const image = await Jimp.read(inputPath); // ✅ FIXED
            for (const size of SIZES) {
                const outputPath = path.join(OUTPUT_FOLDER, `${imageName}_${size}x${size}.png`);
                await image.clone().resize(size, size).writeAsync(outputPath);
                console.log(`✅ Generated: ${outputPath}`);
            }
        } catch (err) {
            console.error(`❌ Error processing ${file}:`, err);
        }
    }
    console.log(`🎉 All images resized and saved in "${OUTPUT_FOLDER}"`);
})();
