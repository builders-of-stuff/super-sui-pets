import { Jimp } from 'jimp';

const PETS_PATH = '/Users/kyletruong/.gemini/antigravity/brain/9f4a6593-c191-440e-9e02-3dbad64cf2d4/pixel_art_pets_sprite_sheet_1763752145286.png';
const FOOD_PATH = '/Users/kyletruong/.gemini/antigravity/brain/9f4a6593-c191-440e-9e02-3dbad64cf2d4/pixel_art_food_sprite_sheet_1763752160525.png';

async function process() {
    try {
        console.log('Processing generated assets...');

        // Process Pets
        // Target: 5 pets, 64x64 each -> 320x64
        const pets = await Jimp.read(PETS_PATH);
        pets.resize({ w: 320, h: 64 });
        await pets.write('static/pets_fixed.png');
        console.log('Processed static/pets_fixed.png');

        // Process Food
        // Target: 3 items, 64x64 each -> 192x64
        const food = await Jimp.read(FOOD_PATH);
        food.resize({ w: 192, h: 64 });
        await food.write('static/food_fixed.png');
        console.log('Processed static/food_fixed.png');

    } catch (err) {
        console.error(err);
    }
}

process();
