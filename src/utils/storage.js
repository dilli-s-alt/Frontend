const canUseWindow = typeof window !== "undefined";

function getStorage(type) {
  if (!canUseWindow) {
    return null;
  }

  try {
    return window[type];
  } catch {
    return null;
  }
}

function createStorageApi(type) {
  const storage = () => getStorage(type);

  return {
    getItem(key) {
      try {
        return storage()?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        storage()?.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    removeItem(key) {
      try {
        storage()?.removeItem(key);
        return true;
      } catch {
        return false;
      }
    }
  };
}

export const safeLocalStorage = createStorageApi("localStorage");
export const safeSessionStorage = createStorageApi("sessionStorage");

export function readJson(storageApi, key, fallback = null) {
  const raw = storageApi.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function isLocalhostHost() {
  if (!canUseWindow) {
    return false;
  }

  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}
