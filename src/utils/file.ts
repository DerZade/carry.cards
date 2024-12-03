import { openDB, type DBSchema } from 'idb';

interface MyDB extends DBSchema {
    files: {
        key: string;
        value: Blob;
        indexes: { 'key-unique': string };
    };
}

const DB_PROMISE = openDB<MyDB>('files', 1, {
    upgrade(db) {
        db.createObjectStore('files', { keyPath: 'key' });
    },
});

export async function getFile(id: string): Promise<Blob | undefined> {
    const db = await DB_PROMISE;

    return db.get('files', id);
}

export async function storeFile(blob: Blob): Promise<string> {
    const db = await DB_PROMISE;
    const id = crypto.randomUUID();

    await db.put('files', blob, id);

    return id;
}

export async function deleteFile(id: string): Promise<void> {
    const db = await DB_PROMISE;
    await db.delete('files', id);
}

export async function dataURLtoBlob(dataURL: string): Promise<Blob> {
    const response = await fetch(dataURL);
    return response.blob();
}
