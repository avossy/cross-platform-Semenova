export function validateProduct(req, res, next) {
    const { name, description, price, category, material } = req.body || {};

    const textFields = { name, description, category, material };
    for (const [field, value] of Object.entries(textFields)) {
        if (typeof value !== 'string' || value.trim() === '') {
            return res.status(400).json({ message: `Поле "${field}" обов'язкове і не може бути порожнім` });
        }
    }

    if (price === undefined || price === null || price === '' || isNaN(Number(price)) || Number(price) < 0) {
        return res.status(400).json({ message: 'Поле "price" обов\'язкове і має бути невід\'ємним числом' });
    }

    next();
}