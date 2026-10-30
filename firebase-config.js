/**
 * ========================================================
 * Fashion by Hanin — Firebase & Cloudinary Integration Layer
 * ========================================================
 * يوفر هذا الملف اتصالاً سلساً مع:
 * 1. Firebase Authentication (لتأمين لوحة التحكم)
 * 2. Cloud Firestore (لحفظ ومزامنة المنتجات، الطلبات، والدردشة المباشرة)
 * 3. Cloudinary (لرفع وحفظ صور المنتجات بجودة عالية وسرعة CDN)
 */

// 1. إعدادات Firebase الخاصة بالمتجر
const firebaseConfig = {
  apiKey: "AIzaSyB1od5C_RXspWF2oNYvvgaLpj5Ta2_bn-o",
  authDomain: "fashion-hanin.firebaseapp.com",
  projectId: "fashion-hanin",
  storageBucket: "fashion-hanin.firebasestorage.app",
  messagingSenderId: "680554386640",
  appId: "1:680554386640:web:defd50c505113729ae7ad5",
  measurementId: "G-REMRW59R7Q"
};

// 2. إعدادات Cloudinary (يمكن تعديلها من لوحة التحكم أو حفظها في التخزين)
const CLOUDINARY_DEFAULTS = {
  cloudName: localStorage.getItem('fashion_hanin_cloudinary_name') || 'vunqsror',
  uploadPreset: localStorage.getItem('fashion_hanin_cloudinary_preset') || 'fashion_hanin'
};

// 3. تهيئة خدمات Firebase
let firebaseApp = null;
let firebaseAuth = null;
let firestoreDb = null;
let isFirebaseInitialized = false;

try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
      firebaseApp = firebase.app();
    }
    firebaseAuth = firebase.auth();
    firestoreDb = firebase.firestore();
    isFirebaseInitialized = true;
    console.log('[FashionDB] ✅ تم تهيئة Firebase لمتجر Fashion by Hanin بنجاح.');
  } else {
    console.warn('[FashionDB] ⚠️ لم يتم العثور على مكتبة Firebase SDK في الصفحة.');
  }
} catch (err) {
  console.error('[FashionDB] خطأ في تهيئة Firebase:', err);
}

// 4. كائن واجهة قاعدة البيانات FashionDB
const FashionDB = {
  config: firebaseConfig,
  cloudinary: CLOUDINARY_DEFAULTS,
  isReady: () => isFirebaseInitialized,
  getAuth: () => firebaseAuth,
  getDb: () => firestoreDb,

  // ══════════════ CLOUDINARY UPLOAD ══════════════
  getCloudinaryConfig() {
    return {
      cloudName: localStorage.getItem('fashion_hanin_cloudinary_name') || this.cloudinary.cloudName,
      uploadPreset: localStorage.getItem('fashion_hanin_cloudinary_preset') || this.cloudinary.uploadPreset
    };
  },

  setCloudinaryConfig(cloudName, uploadPreset) {
    this.cloudinary.cloudName = (cloudName || '').trim();
    this.cloudinary.uploadPreset = (uploadPreset || '').trim();
    localStorage.setItem('fashion_hanin_cloudinary_name', this.cloudinary.cloudName);
    localStorage.setItem('fashion_hanin_cloudinary_preset', this.cloudinary.uploadPreset);
  },

  async uploadToCloudinary(file) {
    const { cloudName, uploadPreset } = this.getCloudinaryConfig();
    
    // إذا تم إدخال بيانات Cloudinary، يتم الرفع مباشرة
    if (cloudName && uploadPreset) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'fashion_by_hanin');

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || ('Cloudinary Error HTTP ' + res.status));
        }
        const data = await res.json();
        return data.secure_url;
      } catch (err) {
        console.error('[FashionDB] فشل الرفع إلى Cloudinary:', err);
        throw err;
      }
    }

    // إذا لم تُدخل بيانات Cloudinary بعد، يتم الاحتفاظ بالصورة محلياً كـ DataURL مؤقتاً
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('فشل قراءة الملف محلياً'));
      reader.readAsDataURL(file);
    });
  },

  // ══════════════ AUTHENTICATION ══════════════
  onAuthStateChanged(callback) {
    if (firebaseAuth) {
      return firebaseAuth.onAuthStateChanged(callback);
    }
    // وضع احتياطي محلي في حال تعطل الشبكة
    setTimeout(() => callback(null), 50);
    return () => {};
  },

  async login(email, password) {
    if (!firebaseAuth) throw new Error('Firebase Auth غير مهيأ');
    return await firebaseAuth.signInWithEmailAndPassword(email, password);
  },

  async logout() {
    if (firebaseAuth) {
      return await firebaseAuth.signOut();
    }
  },

  getCurrentUser() {
    return firebaseAuth ? firebaseAuth.currentUser : null;
  },

  // ══════════════ PRODUCTS (المنتجات) ══════════════
  async seedInitialProductsIfEmpty() {
    if (!firestoreDb) return;
    try {
      const snap = await firestoreDb.collection('products').limit(1).get();
      if (snap.empty && typeof PREVIEW_PRODUCTS !== 'undefined' && Array.isArray(PREVIEW_PRODUCTS) && PREVIEW_PRODUCTS.length > 0) {
        console.log('[FashionDB] 📦 جاري رفع المنتجات التأسيسية إلى Cloud Firestore...');
        const batch = firestoreDb.batch();
        PREVIEW_PRODUCTS.forEach(p => {
          const docRef = firestoreDb.collection('products').doc(p.id);
          batch.set(docRef, { ...p, createdAt: Date.now() });
        });
        await batch.commit();
        console.log('[FashionDB] ✅ تم رفع المنتجات التأسيسية إلى Firestore بنجاح.');
      }
    } catch (e) {
      console.warn('[FashionDB] تعذر التحقق من المنتجات الأولية في Firestore (تأكد من تفعيل قواعد Firestore):', e.message);
    }
  },

  onProductsChange(callback) {
    // جلب البيانات المخزنة محلياً أولاً للتحميل الفوري
    const local = window.PREVIEW_DATA ? window.PREVIEW_DATA.getStoredProducts() : (typeof PREVIEW_PRODUCTS !== 'undefined' ? PREVIEW_PRODUCTS : []);
    callback(local);

    if (!firestoreDb) return () => {};

    // محاولة رفع المنتجات الأولية إذا كانت المجموعة فارغة
    this.seedInitialProductsIfEmpty();

    // الاستماع الحي والمباشر لـ Firestore
    return firestoreDb.collection('products').onSnapshot(snap => {
      if (!snap.empty) {
        const list = [];
        snap.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
        // تحديث الكاش المحلي
        if (window.PREVIEW_DATA) window.PREVIEW_DATA.saveStoredProducts(list);
        callback(list);
      }
    }, err => {
      console.warn('[FashionDB] تعذر الاستماع لمنتجات Firestore، العمل بالبيانات المحلية:', err.message);
    });
  },

  async saveProduct(product) {
    const id = product.id || ('prod_' + Date.now().toString(36));
    const toSave = { ...product, id, updatedAt: Date.now() };

    // مزامنة محلية فورية
    if (window.PREVIEW_DATA) {
      let prods = window.PREVIEW_DATA.getStoredProducts();
      const idx = prods.findIndex(p => p.id === id);
      if (idx !== -1) prods[idx] = toSave;
      else prods.unshift(toSave);
      window.PREVIEW_DATA.saveStoredProducts(prods);
    }

    // مزامنة Firestore السحابية
    if (firestoreDb) {
      await firestoreDb.collection('products').doc(id).set(toSave, { merge: true });
    }
    return toSave;
  },

  async deleteProduct(productId) {
    // حذف محلي
    if (window.PREVIEW_DATA) {
      let prods = window.PREVIEW_DATA.getStoredProducts().filter(p => p.id !== productId);
      window.PREVIEW_DATA.saveStoredProducts(prods);
    }
    // حذف سحابي من Firestore
    if (firestoreDb) {
      await firestoreDb.collection('products').doc(productId).delete();
    }
  },

  // ══════════════ ORDERS (الطلبات) ══════════════
  async createOrder(orderPayload) {
    const orderId = 'ord_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const newOrder = {
      id: orderId,
      ...orderPayload,
      createdAt: Date.now(),
      done: false
    };

    // حفظ محلي فوري
    if (window.PREVIEW_DATA) {
      window.PREVIEW_DATA.addStoredOrder(newOrder);
    }

    // حفظ سحابي في Firestore
    if (firestoreDb) {
      try {
        await firestoreDb.collection('orders').doc(orderId).set(newOrder);
        console.log('[FashionDB] ✅ تم تسجيل الطلب الجديد في Firestore:', orderId);
      } catch (err) {
        console.warn('[FashionDB] تعذر حفظ الطلب في Firestore، تم حفظه محلياً:', err.message);
      }
    }
    return newOrder;
  },

  onOrdersChange(callback) {
    const local = window.PREVIEW_DATA ? window.PREVIEW_DATA.getStoredOrders() : [];
    callback(local);

    if (!firestoreDb) return () => {};

    return firestoreDb.collection('orders').orderBy('createdAt', 'desc').onSnapshot(snap => {
      const orders = [];
      snap.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      if (window.PREVIEW_DATA) window.PREVIEW_DATA.saveStoredOrders(orders);
      callback(orders);
    }, err => {
      console.warn('[FashionDB] تعذر الاستماع لطلبات Firestore، العمل بالبيانات المحلية:', err.message);
    });
  },

  async updateOrderStatus(orderId, isDone) {
    if (window.PREVIEW_DATA) {
      window.PREVIEW_DATA.toggleStoredOrderStatus(orderId);
    }
    if (firestoreDb) {
      await firestoreDb.collection('orders').doc(orderId).update({ done: isDone, updatedAt: Date.now() });
    }
  },

  async deleteOrder(orderId) {
    if (window.PREVIEW_DATA) {
      window.PREVIEW_DATA.deleteStoredOrder(orderId);
    }
    if (firestoreDb) {
      await firestoreDb.collection('orders').doc(orderId).delete();
    }
  },

  // ══════════════ LIVE CHATS (المحادثة الحية) ══════════════
  onAllChatsChange(callback) {
    const local = window.PREVIEW_DATA ? window.PREVIEW_DATA.getStoredChats() : [];
    callback(local);

    if (!firestoreDb) return () => {};

    return firestoreDb.collection('chats').orderBy('lastMessageTime', 'desc').onSnapshot(snap => {
      const chats = [];
      snap.forEach(doc => {
        chats.push({ id: doc.id, ...doc.data() });
      });
      if (window.PREVIEW_DATA) window.PREVIEW_DATA.saveStoredChats(chats);
      callback(chats);
    }, err => {
      console.warn('[FashionDB] تعذر الاستماع لمحادثات Firestore:', err.message);
    });
  },

  onCustomerChatChange(chatId, callback) {
    if (!firestoreDb || !chatId) {
      const local = window.PREVIEW_DATA ? window.PREVIEW_DATA.getStoredChats() : [];
      const found = local.find(c => c.id === chatId);
      callback(found ? found.messages : []);
      return () => {};
    }

    return firestoreDb.collection('chats').doc(chatId).onSnapshot(doc => {
      if (doc.exists) {
        const data = doc.data();
        callback(data.messages || []);
      } else {
        callback([]);
      }
    }, err => {
      console.warn('[FashionDB] تعذر الاستماع لرسائل العميل في Firestore:', err.message);
    });
  },

  async sendChatMessage(chatId, messageObj, customerMeta = {}) {
    if (!chatId) return;

    // مزامنة محلية
    if (window.PREVIEW_DATA) {
      const chats = window.PREVIEW_DATA.getStoredChats();
      let cur = chats.find(c => c.id === chatId);
      if (!cur) {
        cur = {
          id: chatId,
          customerName: customerMeta.name || 'عميل المتجر',
          customerPhone: customerMeta.phone || '',
          orderId: customerMeta.orderId || '',
          orderTotal: customerMeta.orderTotal || 0,
          lastMessage: messageObj.text,
          lastMessageTime: Date.now(),
          unreadByAdmin: messageObj.sender === 'client',
          messages: [messageObj]
        };
        chats.unshift(cur);
      } else {
        cur.messages.push(messageObj);
        cur.lastMessage = messageObj.text;
        cur.lastMessageTime = Date.now();
        if (messageObj.sender === 'client') cur.unreadByAdmin = true;
      }
      window.PREVIEW_DATA.saveStoredChats(chats);
    }

    // مزامنة سحابية في Firestore
    if (firestoreDb) {
      try {
        const chatRef = firestoreDb.collection('chats').doc(chatId);
        const doc = await chatRef.get();
        if (!doc.exists) {
          await chatRef.set({
            id: chatId,
            customerName: customerMeta.name || 'عميل المتجر',
            customerPhone: customerMeta.phone || '',
            orderId: customerMeta.orderId || '',
            orderTotal: customerMeta.orderTotal || 0,
            lastMessage: messageObj.text,
            lastMessageTime: Date.now(),
            unreadByAdmin: messageObj.sender === 'client',
            messages: [messageObj]
          });
        } else {
          await chatRef.update({
            lastMessage: messageObj.text,
            lastMessageTime: Date.now(),
            unreadByAdmin: messageObj.sender === 'client',
            messages: firebase.firestore.FieldValue.arrayUnion(messageObj)
          });
        }
      } catch (err) {
        console.warn('[FashionDB] تعذر إرسال الرسالة إلى Firestore:', err.message);
      }
    }
  }
};

window.FashionDB = FashionDB;

