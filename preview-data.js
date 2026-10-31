/**
 * ========================================================
 * Fashion by Hanin — متجر الأزياء والموضة (Preview Data Layer)
 * ========================================================
 * طبقة بيانات وتخزين محلي 100% Client-side ومعزولة تماماً.
 */

// المنتجات التجريبية القديمة التي تم حذفها بطلب المتجر (لضمان عدم ظهورها في أي جهاز)
const DELETED_LEGACY_IDS = new Set(['hanin_p1', 'hanin_p2', 'hanin_p3', 'hanin_p4']);

const PREVIEW_PRODUCTS = [
  {
    id: "hanin_p5",
    name: "فستان سهرة ماكسي حرير فاخر (Luxury Silk Evening Dress)",
    subtitle: "Fashion by Hanin Couture",
    price: 7800,
    oldPrice: 9500,
    price2: 7200,
    price3: 6800,
    description: "فستان سهرة ماكسي راقٍ وأنيق مصنوع من خامة الحرير الساتان الفاخر، بقصة انسيابية ساحرة وخصر محدد يبرز جمال الإطلالة. مثالي للمناسبات الخاصة، الأعراس والحفلات الراقية. خياطة وتفصيل عالي الجودة وتصميم محتشم وعصري.",
    image: "images/luxury_dress.jpg",
    images: ["images/luxury_dress.jpg"],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "أخضر زمردي ملكي", hex: "#0b4f3f" },
      { name: "عنابي بوردو فاخر", hex: "#5a111a" },
      { name: "أسود ملكي ساحر", hex: "#141416" },
      { name: "بيج شمبانيا ناعم", hex: "#d8c4a5" }
    ],
    videoUrl: ""
  }
];

const INITIAL_DEMO_ORDERS = [];

const INITIAL_DEMO_CHATS = [];

const STORAGE_KEYS = {
  PRODUCTS: 'fashion_hanin_store_products',
  ORDERS: 'fashion_hanin_store_orders',
  CHATS: 'fashion_hanin_store_chats',
  SETTINGS: 'fashion_hanin_store_settings'
};

// تصفير وتهيئة التخزين الحقيقي لمتجر Fashion by Hanin وتنظيف المنتجات القديمة والمحادثات التجريبية تلقائياً
try {
  const currentProds = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (currentProds) {
    let list = JSON.parse(currentProds);
    if (Array.isArray(list)) {
      const filtered = list.filter(item => item && !DELETED_LEGACY_IDS.has(item.id));
      if (filtered.length !== list.length) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered.length ? filtered : PREVIEW_PRODUCTS));
      }
    }
  } else {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(PREVIEW_PRODUCTS));
  }

  // تنظيف المحادثات التجريبية من التخزين المحلي لمرة واحدة
  if (!localStorage.getItem('fashion_hanin_chats_cleaned_v1')) {
    localStorage.setItem('fashion_hanin_chats_cleaned_v1', '1');
    localStorage.removeItem(STORAGE_KEYS.CHATS);
  }
} catch(e) {}

function getStoredProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (data !== null) {
      let parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // استبعاد أي منتجات محذوفة سابقة من التخزين المحلي
        const beforeLen = parsed.length;
        parsed = parsed.filter(item => item && !DELETED_LEGACY_IDS.has(item.id));
        let hasChanges = (parsed.length !== beforeLen);

        // إذا أصبحت القائمة فارغة نعيد تعيينها بقائمة المنتجات المعتمدة الحالية
        if (parsed.length === 0) {
          parsed = [...PREVIEW_PRODUCTS];
          hasChanges = true;
        } else {
          // دمج المنتجات الافتراضية الجديدة تلقائياً في حال لم تكن مضافة مسبقاً
          PREVIEW_PRODUCTS.forEach(p => {
            if (!parsed.some(item => item && item.id === p.id)) {
              parsed.push(p);
              hasChanges = true;
            }
          });
        }

        if (hasChanges) {
          saveStoredProducts(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn("[Preview] Could not parse stored products:", e);
  }
  saveStoredProducts(PREVIEW_PRODUCTS);
  return [...PREVIEW_PRODUCTS];
}

function saveStoredProducts(productsList) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsList || []));
  } catch (e) {
    console.error("[Preview] Could not save products to localStorage:", e);
  }
}

function resetProductsToDefault() {
  saveStoredProducts(PREVIEW_PRODUCTS);
  return [...PREVIEW_PRODUCTS];
}

function getStoredOrders() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("[Preview] Could not parse stored orders:", e);
  }
  saveStoredOrders(INITIAL_DEMO_ORDERS);
  return [...INITIAL_DEMO_ORDERS];
}

function saveStoredOrders(ordersList) {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersList || []));
  } catch (e) {
    console.error("[Preview] Could not save orders to localStorage:", e);
  }
}

function addStoredOrder(orderData) {
  const orders = getStoredOrders();
  const orderId = 'ord_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
  const newOrder = {
    id: orderId,
    ...orderData,
    createdAt: Date.now(),
    done: false
  };
  orders.unshift(newOrder);
  saveStoredOrders(orders);
  return newOrder;
}

function toggleStoredOrderStatus(orderId) {
  const orders = getStoredOrders();
  const order = orders.find(o => String(o.id) === String(orderId));
  if (order) {
    order.done = !order.done;
    saveStoredOrders(orders);
    return order.done;
  }
  return false;
}

function deleteStoredOrder(orderId) {
  let orders = getStoredOrders();
  orders = orders.filter(o => String(o.id) !== String(orderId));
  saveStoredOrders(orders);
}

function getStoredChats() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("[Preview] Could not parse stored chats:", e);
  }
  saveStoredChats(INITIAL_DEMO_CHATS);
  return [...INITIAL_DEMO_CHATS];
}

function saveStoredChats(chatsList) {
  try {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chatsList || []));
  } catch (e) {
    console.error("[Preview] Could not save chats to localStorage:", e);
  }
}

function getStoredSettings() {
  try {
    const s = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return s ? JSON.parse(s) : { isDemo: true };
  } catch (e) {
    return { isDemo: true };
  }
}

function saveStoredSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {}
}

window.PREVIEW_DATA = {
  products: PREVIEW_PRODUCTS,
  getStoredProducts,
  saveStoredProducts,
  resetProductsToDefault,
  getStoredOrders,
  saveStoredOrders,
  addStoredOrder,
  toggleStoredOrderStatus,
  deleteStoredOrder,
  getStoredChats,
  saveStoredChats,
  getStoredSettings,
  saveStoredSettings,
  STORAGE_KEYS
};

// ══════ FASHION BY HANIN MEDIA STORAGE (IndexedDB for Large Video Blobs) ══════
var HANIN_MEDIA_DB = 'fashion_hanin_media_db';
var HANIN_MEDIA_STORE = 'media_store';

function openHaninMediaDB() {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(HANIN_MEDIA_DB, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(HANIN_MEDIA_STORE)) {
          db.createObjectStore(HANIN_MEDIA_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

async function saveStoredVideoBlob(key, blob) {
  const db = await openHaninMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HANIN_MEDIA_STORE, 'readwrite');
    tx.objectStore(HANIN_MEDIA_STORE).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getStoredVideoBlob(key) {
  try {
    const db = await openHaninMediaDB();
    return new Promise((resolve) => {
      const tx = db.transaction(HANIN_MEDIA_STORE, 'readonly');
      const req = tx.objectStore(HANIN_MEDIA_STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

async function deleteStoredVideoBlob(key) {
  try {
    const db = await openHaninMediaDB();
    return new Promise((resolve) => {
      const tx = db.transaction(HANIN_MEDIA_STORE, 'readwrite');
      tx.objectStore(HANIN_MEDIA_STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (e) {
    return null;
  }
}

window.HANIN_MEDIA_DB = HANIN_MEDIA_DB;
window.HANIN_MEDIA_STORE = HANIN_MEDIA_STORE;
window.openHaninMediaDB = openHaninMediaDB;
window.saveStoredVideoBlob = saveStoredVideoBlob;
window.getStoredVideoBlob = getStoredVideoBlob;
window.deleteStoredVideoBlob = deleteStoredVideoBlob;
// Aliases for compatibility
window.CROWN_MEDIA_DB = HANIN_MEDIA_DB;
window.CROWN_MEDIA_STORE = HANIN_MEDIA_STORE;
window.openCrownMediaDB = openHaninMediaDB;

