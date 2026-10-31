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
  uploadPreset: localStorage.getItem('fashion_hanin_cloudinary_preset') || 'fashion hanin'
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

    // تمكين التخزين المؤقت المحلي لـ Firestore لضمان السرعة الفورية وحل الوعود دون انتظار الشبكة
    if (typeof firestoreDb.enablePersistence === 'function') {
      firestoreDb.enablePersistence({ synchronizeTabs: true }).catch(err => {
        console.warn('[FashionDB] تنبيه التخزين المحلي:', err.code);
      });
    }

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

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || ('Cloudinary Error HTTP ' + res.status));
        }
        const data = await res.json();
        return data.secure_url;
      } catch (err) {
        console.warn('[FashionDB] تعذر الرفع إلى Cloudinary، استخدام DataURL بديل فوري:', err.message);
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
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
    // تم إيقاف إعادة الرفع التلقائي لضمان عدم عودة المنتجات بعد قيام المدير بحذفها
    return;
  },

  onProductsChange(callback) {
    // جلب البيانات المخزنة محلياً أولاً للتحميل الفوري
    const local = window.PREVIEW_DATA ? window.PREVIEW_DATA.getStoredProducts() : [];
    callback(local);

    if (!firestoreDb) return () => {};

    // الاستماع الحي والمباشر لـ Firestore
    return firestoreDb.collection('products').onSnapshot(snap => {
      const list = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // تحديث الكاش المحلي فوراً
      if (window.PREVIEW_DATA) window.PREVIEW_DATA.saveStoredProducts(list);
      callback(list);
    }, err => {
      console.warn('[FashionDB] تعذر الاستماع لمنتجات Firestore، العمل بالبيانات المحلية:', err.message);
    });
  },

  async saveProduct(product) {
    const id = product.id || ('prod_' + Date.now().toString(36));
    const toSave = { ...product, id, updatedAt: Date.now() };

    // 1. مزامنة محلية فورية دائماً
    if (window.PREVIEW_DATA) {
      let prods = window.PREVIEW_DATA.getStoredProducts();
      const idx = prods.findIndex(p => p.id === id);
      if (idx !== -1) prods[idx] = toSave;
      else prods.unshift(toSave);
      window.PREVIEW_DATA.saveStoredProducts(prods);
    }

    // 2. مزامنة Firestore السحابية مع مهلة أمان صارمة (2.5 ثانية) لضمان عدم تعليق الواجهة أبداً
    if (firestoreDb) {
      try {
        const firestoreWrite = firestoreDb.collection('products').doc(id).set(toSave, { merge: true });
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2500));
        await Promise.race([firestoreWrite, timeoutPromise]);
      } catch (err) {
        console.warn('[FashionDB] تعذر الحفظ الفوري في Firestore، تم الحفظ محلياً:', err.message);
      }
    }
    return toSave;
  },

  async deleteProduct(productId) {
    // 1. حذف محلي فوري
    if (window.PREVIEW_DATA) {
      let prods = window.PREVIEW_DATA.getStoredProducts().filter(p => p.id !== productId);
      window.PREVIEW_DATA.saveStoredProducts(prods);
    }
    // 2. حذف سحابي من Firestore مع مهلة أمان
    if (firestoreDb) {
      try {
        const firestoreDelete = firestoreDb.collection('products').doc(productId).delete();
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2500));
        await Promise.race([firestoreDelete, timeoutPromise]);
      } catch (err) {
        console.warn('[FashionDB] تعذر الحذف الفوري من Firestore، تم الحذف محلياً:', err.message);
      }
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
      if (snap.size > 0 || !local.length) {
        if (window.PREVIEW_DATA) window.PREVIEW_DATA.saveStoredOrders(orders);
        callback(orders);
      } else {
        callback(local);
      }
    }, err => {
      console.warn('[FashionDB] تعذر الاستماع لطلبات Firestore، العمل بالبيانات المحلية:', err.message);
    });
  },

  async updateOrderStatus(orderId, isDone) {
    if (window.PREVIEW_DATA) {
      window.PREVIEW_DATA.toggleStoredOrderStatus(orderId);
    }
    if (firestoreDb) {
      try {
        const firestoreUpdate = firestoreDb.collection('orders').doc(orderId).update({ done: isDone, updatedAt: Date.now() });
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2500));
        await Promise.race([firestoreUpdate, timeoutPromise]);
      } catch (err) {
        console.warn('[FashionDB] تعذر تحديث حالة الطلب في Firestore:', err.message);
      }
    }
  },

  async deleteOrder(orderId) {
    if (window.PREVIEW_DATA) {
      window.PREVIEW_DATA.deleteStoredOrder(orderId);
    }
    if (firestoreDb) {
      try {
        const firestoreDelete = firestoreDb.collection('orders').doc(orderId).delete();
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2500));
        await Promise.race([firestoreDelete, timeoutPromise]);
      } catch (err) {
        console.warn('[FashionDB] تعذر حذف الطلب من Firestore:', err.message);
      }
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
  },

  async markChatAsRead(chatId) {
    if (!chatId) return;
    if (window.PREVIEW_DATA) {
      try {
        const chats = window.PREVIEW_DATA.getStoredChats() || [];
        const cur = chats.find(c => String(c.id) === String(chatId));
        if (cur) {
          cur.unreadByAdmin = false;
          window.PREVIEW_DATA.saveStoredChats(chats);
        }
      } catch(e) {}
    }
    if (firestoreDb) {
      try {
        await firestoreDb.collection('chats').doc(chatId).update({
          unreadByAdmin: false
        });
      } catch (err) {
        console.warn('[FashionDB] تعذر تحديث حالة القراءة:', err.message);
      }
    }
  },

  async deleteChat(chatId) {
    if (!chatId) return;
    // 1. حذف محلي فوري
    if (window.PREVIEW_DATA) {
      try {
        const chats = (window.PREVIEW_DATA.getStoredChats() || []).filter(c => String(c.id) !== String(chatId));
        window.PREVIEW_DATA.saveStoredChats(chats);
      } catch(e) {}
    }
    // 2. حذف سحابي حقيقي من Firestore
    if (firestoreDb) {
      try {
        const firestoreDelete = firestoreDb.collection('chats').doc(chatId).delete();
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2500));
        await Promise.race([firestoreDelete, timeoutPromise]);
      } catch (err) {
        console.warn('[FashionDB] تعذر حذف المحادثة من Firestore:', err.message);
      }
    }
  },

  async clearAllChats() {
    // 1. مسح محلي فوري
    if (window.PREVIEW_DATA) {
      try {
        window.PREVIEW_DATA.saveStoredChats([]);
      } catch(e) {}
    }
    // 2. مسح سحابي كامل من Firestore
    if (firestoreDb) {
      try {
        const snap = await firestoreDb.collection('chats').get();
        if (!snap.empty) {
          const batch = firestoreDb.batch();
          snap.forEach(doc => batch.delete(doc.ref));
          await batch.commit();
        }
      } catch (err) {
        console.warn('[FashionDB] تعذر مسح جميع المحادثات من Firestore:', err.message);
      }
    }
  }
};

window.FashionDB = FashionDB;

