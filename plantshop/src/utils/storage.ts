// src/utils/storage.ts

/**
 * Lấy dữ liệu từ localStorage
 * @param key Key của item
 * @returns giá trị đã parse JSON hoặc null nếu không tồn tại
 */
export function getItem<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        return JSON.parse(item) as T;
    } catch (error) {
        console.error(`Error getting item ${key} from localStorage`, error);
        return null;
    }
}

/**
 * Lưu dữ liệu vào localStorage
 * @param key Key của item
 * @param value Giá trị sẽ được stringify JSON
 */
export function setItem<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting item ${key} in localStorage`, error);
    }
}

/**
 * Xóa item từ localStorage
 * @param key Key của item
 */
export function removeItem(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing item ${key} from localStorage`, error);
    }
}

/**
 * Clear toàn bộ localStorage
 */
export function clearStorage(): void {
    try {
        localStorage.clear();
    } catch (error) {
        console.error("Error clearing localStorage", error);
    }
}
