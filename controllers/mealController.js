const mealService = require('../services/mealService');
const photoUploder = require('../middlewares/photoUploader');


async function index(req, res) {
    const meals = await mealService.getAll();

    return res.status(200).json({ meals });
}

async function show(req, res, next) {
    try {
        const id = req.params.id;

        const meal = await mealService.getById(id);

        return res.status(200).json({ meal });
    } catch (error) {
        next(error);
    }
}

async function store(req, res, next) {
    try {
        const { name, price } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'File is required' });
        }
        console.log(`Photo : ${req.file} \n recived`);
        
        const photoUrl = await photoUploder.uploadToGoogleDrive(req.file, "meals_images", name);
        console.log(`Photo uploaded to : ${photoUrl}`);

        const newMeal = await mealService.create(name, photoUrl, price);
    
        return res.status(201).json({id: newMeal.id});

    } catch (error) {
        next(error);
    }
}

async function update(req, res) {
    try {
        const id = req.params.id;
        const { name, price, status } = req.body;
        let photoUrl = null;

        if (req.file) {
            photoUrl = await photoUploder.uploadToGoogleDrive(req.file, "meals_images", name);
            console.log(`Photo uploaded to : ${photoUrl}`);
        }

        const updatedMeal = await mealService.updateById(id, name, photoUrl, price, status);
    
        return res.status(201).json({id: updatedMeal.id});

    } catch (error) {
        next(error);
    }
}

async function destroy(req, res, next) {
    try {
        const id = req.params.id;

        const deletedMeal = await mealService.deleteById(id);
    
        return res.status(201).json({deletedMeal});

    } catch (error) {
        next(error);
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy
}
