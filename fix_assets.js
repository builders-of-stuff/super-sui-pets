import { Jimp } from 'jimp';

async function process() {
    try {
        console.log('Starting asset fix...');
        
        // Create Pets Placeholder
        // 5 pets: 160x32
        const newPets = new Jimp({ width: 160, height: 32, color: 0x00000000 });
        
        // Draw blocks
        // Ant (0) - Red
        newPets.scan(0, 0, 32, 32, (x, y, idx) => {
            newPets.bitmap.data[idx + 0] = 255; // R
            newPets.bitmap.data[idx + 1] = 0;   // G
            newPets.bitmap.data[idx + 2] = 0;   // B
            newPets.bitmap.data[idx + 3] = 255; // A
        });
        
        // Fish (1) - Blue
        newPets.scan(32, 0, 32, 32, (x, y, idx) => {
            newPets.bitmap.data[idx + 0] = 0;
            newPets.bitmap.data[idx + 1] = 0;
            newPets.bitmap.data[idx + 2] = 255;
            newPets.bitmap.data[idx + 3] = 255;
        });
        
        // Mosquito (2) - Green
        newPets.scan(64, 0, 32, 32, (x, y, idx) => {
            newPets.bitmap.data[idx + 0] = 0;
            newPets.bitmap.data[idx + 1] = 255;
            newPets.bitmap.data[idx + 2] = 0;
            newPets.bitmap.data[idx + 3] = 255;
        });
        
        // Cricket (3) - Yellow
        newPets.scan(96, 0, 32, 32, (x, y, idx) => {
            newPets.bitmap.data[idx + 0] = 255;
            newPets.bitmap.data[idx + 1] = 255;
            newPets.bitmap.data[idx + 2] = 0;
            newPets.bitmap.data[idx + 3] = 255;
        });
        
        // Beaver (4) - Brown
        newPets.scan(128, 0, 32, 32, (x, y, idx) => {
            newPets.bitmap.data[idx + 0] = 128;
            newPets.bitmap.data[idx + 1] = 64;
            newPets.bitmap.data[idx + 2] = 0;
            newPets.bitmap.data[idx + 3] = 255;
        });

        await newPets.write('static/pets_fixed.png');
        console.log('Created static/pets_fixed.png');

        // Process Food (3 items)
        const newFood = new Jimp({ width: 96, height: 32, color: 0x00000000 });
        // Just make them grey for now
        newFood.scan(0, 0, 96, 32, (x, y, idx) => {
             newFood.bitmap.data[idx + 0] = 128;
             newFood.bitmap.data[idx + 1] = 128;
             newFood.bitmap.data[idx + 2] = 128;
             newFood.bitmap.data[idx + 3] = 255;
        });
        await newFood.write('static/food_fixed.png');
        console.log('Created static/food_fixed.png');

    } catch (err) {
        console.error(err);
    }
}

process();
