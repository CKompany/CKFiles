import { useEffect, useState } from 'react';

const dbName = 'teste';

export default function useDatabase() {
  const [database, setDatabase] = useState<IDBDatabase>();

  useEffect(() => {
    const createDb = indexedDB.open(dbName);

    createDb.onsuccess = () => {
      setDatabase(createDb.result);
      console.log('Database opened successfully', createDb.result);
    };

    createDb.onerror = (event) => {
      const error: IDBOpenDBRequest = event.target as IDBOpenDBRequest;
      console.error(`Error opening database ${error?.error?.message}`);
    };

    createDb.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      const objectStore = db.createObjectStore(dbName, { keyPath: 'id' });
      objectStore.createIndex('id', 'id', { unique: true });
    };
  }, []);

  function insert<T>(id: number, data: T) {
    if (!database) return;
    const transaction = database.transaction(dbName, 'readwrite');
    const objectStore = transaction.objectStore(dbName);

    const request = objectStore.put({
      id,
      ...data
    });

    request.onsuccess = () => {
      console.log('Object added successfully');
    };
  }

  function get<T>(id: number, callback: (result: T) => void) {
    if (!database) return;
    const transaction = database.transaction(dbName, 'readonly');
    const objectStore = transaction.objectStore(dbName);

    const request = objectStore.get(id);

    request.onsuccess = () => {
      callback(request.result);
    };
  }

  function del(id: number, callback: () => void) {
    if (!database) return;
    const transaction = database.transaction(dbName, 'readwrite');
    const objectStore = transaction.objectStore(dbName);

    const request = objectStore.delete(id);

    request.onsuccess = () => {
      callback();
    };
  }
  return {
    get,
    insert,
    del
  };
}
