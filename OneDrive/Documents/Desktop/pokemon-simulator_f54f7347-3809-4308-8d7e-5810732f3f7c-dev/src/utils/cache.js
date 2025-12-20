const cache = new Map();

const get = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  
  const now = Date.now();
  if (now > item.expiry) {
    cache.delete(key);
    return null;
  }
  
  return item.value;
};

const set = (key, value, ttlInSeconds) => {
  const now = Date.now();
  const expiry = now + ttlInSeconds * 1000; 
  cache.set(key, { value, expiry });
};

const deleteKey = (key) => {
  cache.delete(key);
};

const clear = () => {
  cache.clear();
};

/*
 Understand and use this functions to implement the local cache system with TTL for the GET API endpoints.
*/

module.exports = {
  get,
  set,
  delete: deleteKey,
  clear
};