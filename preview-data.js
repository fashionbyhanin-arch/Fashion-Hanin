/**
 * ========================================================
 * Fashion by Hanin — متجر الأزياء والموضة (Preview Data Layer)
 * ========================================================
 * طبقة بيانات وتخزين محلي 100% Client-side ومعزولة تماماً.
 */

const PREVIEW_PRODUCTS = [
  {
    id: "hanin_p1",
    name: "طقم كاجوال سليم فيت / جيم (Slim Fit T-Shirt + Jogger)",
    subtitle: "Fashion by Hanin Casual",
    price: 3600,
    oldPrice: 4200,
    price2: 3400,
    price3: 3200,
    description: "طقم كاجوال عصري أنيق، يجمع بين تيشيرت أسود سليم فيت فائق النعومة مع سروال جوغر رمادي مريح برباط مطاطي، مثالي للجيم والخروج اليومي.",
    image: "images/outfit_gym_flat.jpg",
    images: ["images/outfit_gym_flat.jpg", "images/outfit_gym_model.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "أسود ورمادي", hex: "#18181b" }
    ],
    videoUrl: ""
  },
  {
    id: "hanin_p2",
    name: "طقم هودي مريح فاخر (Premium Hoodie & Jogger)",
    subtitle: "Fashion by Hanin Winter Collection",
    price: 5000,
    oldPrice: 5800,
    price2: 4800,
    price3: 4500,
    description: "طقم شتوي راقٍ يتكون من هودي قطني مريح متوفر بـ 6 ألوان جذابة مع سروال جوغر رمادي دافئ. العرض يشمل التوصيل المجاني لجميع الولايات.",
    image: "images/hoodie_jogger.jpg",
    images: ["images/hoodie_jogger.jpg"],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "أبيض قطني", hex: "#ffffff" },
      { name: "رمادي ميلانج", hex: "#888888" },
      { name: "أسود فاحم", hex: "#111111" }
    ],
    videoUrl: ""
  },
  {
    id: "hanin_p3",
    name: "طقم ستريت وير أسود بالكامل (All Black Street Outfit)",
    subtitle: "Fashion by Hanin Streetwear",
    price: 3600,
    oldPrice: 4400,
    price2: 3400,
    price3: 3200,
    description: "إطلالة أول بلاك شبابية متناسقة. العرض يشمل تيشيرت أسود كاجوال مع جوغر أسود مريح بسعر العرض الترويجي 3600 دج بدل 4400 دج عند طلب الطقم.",
    image: "images/all_black_street.jpg",
    images: ["images/all_black_street.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "أسود ملكي", hex: "#0a0a0c" }
    ],
    videoUrl: ""
  },
  {
    id: "hanin_p4",
    name: "طقم كلاسيك فاخر أول بلاك (All Black Old Money Set)",
    subtitle: "Fashion by Hanin Luxury Formal",
    price: 5500,
    oldPrice: 6700,
    price2: 5200,
    price3: 5000,
    description: "إطلالة كلاسيكية ساحرة راقية بنمط أولد موني. تيشيرت أسود سليم فيت مع بنطلون كلاسيك بكسرات راقية وأنيقة بسعر 5500 دج بدل 6700 دج للقطع منفردة.",
    image: "images/all_black_classic.jpg",
    images: ["images/all_black_classic.jpg"],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "أسود فاخر", hex: "#121217" }
    ],
    videoUrl: ""
  }
];

const INITIAL_DEMO_ORDERS = [
  {
    id: "ord_hanin_101",
    name: "حمزة بن عمار",
    phone: "0550112233",
    wilaya: "16 - الجزائر",
    commune: "سيدي يحيى - حيدرة",
    address: "شارع العربي بن مهيدي",
    delivery: "home",
    payment: "cash",
    products: [
      { name: "طقم كلاسيك فاخر أول بلاك", price: 5500, quantity: 1, size: "L", color: "أسود فاخر", colorHex: "#121217", image: "images/all_black_classic.jpg" }
    ],
    total: 5500,
    productName: "طقم كلاسيك فاخر أول بلاك",
    createdAt: Date.now() - (2 * 3600 * 1000),
    done: false
  }
];

const INITIAL_DEMO_CHATS = [
  {
    id: 'chat_hanin_1',
    customerName: 'كريم بلحاج',
    customerPhone: '0662112233',
    orderId: 'ord_hanin_101',
    orderTotal: 5500,
    lastMessage: 'السلام عليكم، هل مقاس L متوفر في طقم أولد موني الكلاسيك؟',
    lastMessageTime: Date.now() - 3600000,
    unreadByAdmin: true,
    messages: [
      { sender: 'client', text: 'السلام عليكم، هل مقاس L متوفر في طقم أولد موني الكلاسيك؟', time: '14:20' },
      { sender: 'agent', text: 'وعليكم السلام، نعم المقاس متوفر وجاهز للشحن الفوري لكافة الولايات!', time: '14:22' }
    ]
  },
  {
    id: 'chat_hanin_2',
    customerName: 'سفيان مرابط',
    customerPhone: '0555889900',
    orderId: '',
    orderTotal: 0,
    lastMessage: 'شكراً لكم، تم استلام الطلبية وجودة القماش ممتازة جداً!',
    lastMessageTime: Date.now() - 7200000,
    unreadByAdmin: false,
    messages: [
      { sender: 'client', text: 'شكراً لكم، تم استلام الطلبية وجودة القماش ممتازة جداً!', time: '12:05' }
    ]
  }
];

const STORAGE_KEYS = {
  PRODUCTS: 'fashion_hanin_store_products',
  ORDERS: 'fashion_hanin_store_orders',
  CHATS: 'fashion_hanin_store_chats',
  SETTINGS: 'fashion_hanin_store_settings'
};

// تصفير وتهيئة التخزين المعزول لمتجر Fashion by Hanin
try {
  if (!localStorage.getItem('fashion_hanin_clean_v1')) {
    localStorage.setItem('fashion_hanin_clean_v1', '1');
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(PREVIEW_PRODUCTS));
  }
} catch(e) {}

function getStoredProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (data !== null) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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

