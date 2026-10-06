import bcrypt from "bcryptjs";
import { users, getNextUserId } from "./data.js";
import { createToken } from "./auth.js";

const products = [];
let nextProductId = 1;

export const resolvers = {
    Query: {
        // Список усіх користувачів
        users() {
            return users;
        },
        // Поточний авторизований користувач
        me(parent, args, context) {
            return context.user;
        },
        // Список усіх ювелірних виробів
        products() {
            return products;
        },
        // Отримати ювелірний виріб за id
        product(parent, args) {
            return products.find((item) => item.id === args.id);
        },
    },

    Mutation: {
        // Реєстрація нового користувача
        async register(parent, args) {
            const { name, email, password } = args;
            const existingUser = users.find((user) => user.email === email);
            if (existingUser) {
                throw new Error("Користувач з таким email вже існує.");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                id: getNextUserId(),
                name,
                email,
                password: hashedPassword,
            };
            users.push(newUser);
            return { token: createToken(newUser), user: newUser };
        },

        // Авторизація користувача
        async login(parent, args) {
            const { email, password } = args;
            const user = users.find((item) => item.email === email);
            if (!user) {
                throw new Error("Користувача з таким email не знайдено.");
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Неправильний пароль.");
            }
            return { token: createToken(user), user};
        },

        // Додати ювелірний виріб може лише авторизований користувач
        createProduct(parent, args, context) {
            if (!context.user) {
                throw new Error("Потрібна авторизація.");
            }

            const product = {
                id: String(nextProductId++),
                name: args.name,
                description: args.description,
                price: args.price,
                material: args.material,
                gemstone: args.gemstone,
                weight: args.weight,
                size: args.size,
                inStock: true,
                quantity: args.quantity,
                owner: context.user,
            };
            products.push(product);
            return product;
        },

        // Видалити ювелірний виріб за id
        deleteProduct(parent, args, context) {
            if (!context.user) {
                throw new Error("Потрібна авторизація.");
            }
            const index = products.findIndex((item) => item.id === args.id);
            if (index === -1) return false;
            products.splice(index, 1);
            return true;
        },
    },
};