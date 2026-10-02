import mongoose from 'mongoose';
import Product from '../models/Product.js';

const FIELDS = ['name', 'description', 'price', 'category', 'material',
    'gemstone', 'weight', 'size', 'image', 'inStock'];

function pickFields(body) {
    const data = {};
    for (const f of FIELDS) {
        if (body[f] !== undefined) data[f] = body[f];
    }
    return data;
}

function badId(res) {
    return res.status(400).json({ message: 'Некоректний id' });
}

export async function getProducts(req, res) {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getProductById(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return badId(res);
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Товар не знайдено' });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function createProduct(req, res) {
    try {
        const product = await Product.create(pickFields(req.body));
        res.status(201).json(product);
    } catch (err) {
        const code = err.name === 'ValidationError' ? 400 : 500;
        res.status(code).json({ message: err.message });
    }
}

export async function updateProduct(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return badId(res);
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            pickFields(req.body),
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ message: 'Товар не знайдено' });
        res.status(200).json(product);
    } catch (err) {
        const code = err.name === 'ValidationError' ? 400 : 500;
        res.status(code).json({ message: err.message });
    }
}

export async function deleteProduct(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) return badId(res);
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Товар не знайдено' });
        res.status(200).json({ message: 'Товар успішно видалено' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}