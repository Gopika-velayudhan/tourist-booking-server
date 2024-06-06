import Category from "../Model/CategorySchema.js"
import { trycatchmidddleware } from '../Middleware/trycatch.js';


export const createCategory = async (req, res,next) => {
    const { category } = req.body;
    try {
        const newCategory = new Category({ category });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        next(error)
    }
};


export const getCategories = async (req, res,next) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        next(error)
    }
};

export const getCategoryById = async (req, res,next) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        next(error)
    }
};
export const updateCategory = async (req, res,next) => {
    const { id } = req.params;
    const { category } = req.body;
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, { category }, { new: true, runValidators: true });
        if (updatedCategory) {
            res.status(200).json(updatedCategory);
        } else {
            next(trycatchmidddleware(404,"category not found"))
        }
    } catch (error) {
        next(error)
    }
};


export const deleteCategory = async (req, res,next) => {
    const { id } = req.params;
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (deletedCategory) {
            res.status(200).json({ message: 'Category deleted' });
        } else {
            next(trycatchmidddleware(404,"category not found"))
        }
    } catch (error) {
        next(error)
    }
};
