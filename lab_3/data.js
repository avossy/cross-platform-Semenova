export const users = [];
let nextUserId = 1;

// Повертає новий унікальний id користувача
export function getNextUserId() {
    const id = String(nextUserId);
    nextUserId += 1;
    return id;
}