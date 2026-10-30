// ==================== TELEGRAM CONFIG ====================
// Telegram Bot Disabled in Standalone Preview
// ==================== PRODUCT DATA (10 products) ====================
// ⚠️ الصور المحلية: ضع مجلد "images" بجانب ملفات الموقع
// مثال: images/ensemble/IMG-20260424-WA0000.jpg
const PRODUCTS = {};

// ==================== WILAYAS ====================
const WILAYAS = {
  "01 - أدرار": ["أدرار", "رقان", "أولف"],
  "02 - الشلف": ["الشلف", "تنس", "أبو الحسن"],
  "03 - الأغواط": ["الأغواط", "آفلو", "حاسي الرمل"],
  "04 - أم البواقي": ["أم البواقي", "عين البيضاء", "عين مليلة"],
  "05 - باتنة": ["باتنة", "عين توتة", "مروانة"],
  "06 - بجاية": ["بجاية", "أقبو", "تيشي"],
  "07 - بسكرة": ["بسكرة", "طولقة", "سيدي عقبة"],
  "08 - بشار": ["بشار", "عبادلة", "كنادسة"],
  "09 - البليدة": ["البليدة", "بوفاريك", "الأربعاء"],
  "10 - البويرة": ["البويرة", "سور الغزلان", "عين بسام"],
  "11 - تمنراست": ["تمنراست", "عين صالح", "إن گر"],
  "12 - تبسة": ["تبسة", "الشريعة", "بئر العاتر"],
  "13 - تلمسان": ["تلمسان", "مغنية", "غزوات"],
  "14 - تيارت": ["تيارت", "سوق أهراس", "رحابية"],
  "15 - تيزي وزو": ["تيزي وزو", "بومرداس", "أزفون"],
  "16 - الجزائر": ["الجزائر الوسطى", "باب الوادي", "حيدرة", "الحراش", "بئر مراد رايس", "الدار البيضاء"],
  "17 - الجلفة": ["الجلفة", "عين وسارة", "مسعد"],
  "18 - جيجل": ["جيجل", "الطاهير", "الميلية"],
  "19 - سطيف": ["سطيف", "عين أزال", "بئر العرش"],
  "21 - سكيكدة": ["سكيكدة", "عزابة", "القل"],
  "23 - عنابة": ["عنابة", "البوني", "سرايدي"],
  "25 - قسنطينة": ["قسنطينة", "الخروب", "عين سمارة", "ديدوش مراد"],
  "26 - المدية": ["المدية", "البرواقية", "كاف لخضر"],
  "27 - مستغانم": ["مستغانم", "سيدي علي", "عين تادلس"],
  "28 - المسيلة": ["المسيلة", "بوسعادة", "برج بوعريريج"],
  "29 - معسكر": ["معسكر", "تيغنيف", "محمد بن علي"],
  "31 - وهران": ["وهران", "بئر الجير", "السانية", "عين الترك", "مرسى الكبير"],
  "32 - البيض": ["البيض", "بوغار", "الأبيض سيدي الشيخ"],
  "33 - إليزي": ["إليزي", "دبداب", "إن أميناس"],
  "34 - برج بوعريريج": ["برج بوعريريج", "رأس العيون", "منسورة"],
  "35 - بومرداس": ["بومرداس", "رويبة", "ثنية العابد"],
  "36 - الطارف": ["الطارف", "بن مهيدي", "قالمة"],
  "37 - تندوف": ["تندوف", "أميمور"],
  "38 - تيسمسيلت": ["تيسمسيلت", "خميستي", "عين الكبيرة"],
  "39 - الوادي": ["الوادي", "الرباح", "الطالب لعريبي"],
  "40 - خنشلة": ["خنشلة", "بغاي", "كاف لخضر"],
  "41 - سوق أهراس": ["سوق أهراس", "سدراتة", "تاورة"],
  "42 - تيبازة": ["تيبازة", "شرشال", "حجوط"],
  "43 - ميلة": ["ميلة", "فرجيوة", "شلغوم العيد"],
  "44 - عين الدفلى": ["عين الدفلى", "خميس مليانة", "العطاف"],
  "45 - النعامة": ["النعامة", "عسلة", "مشرية"],
  "46 - عين تموشنت": ["عين تموشنت", "بوزجار", "المساحل"],
  "47 - غرداية": ["غرداية", "متليلي", "زلفانة"],
  "48 - غليزان": ["غليزان", "أولاد يعيش", "جديوية"]
};

// ==================== GLOBAL STATE ====================
let cart = [];
let currentProduct = null;

// ==================== UTILS ====================
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
  localStorage.setItem('fashion_hanin_cart', JSON.stringify(cart));
}

// ==================== RENDER PRODUCT CARDS ====================
function renderProductCards() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = Object.values(PRODUCTS).map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img-wrap">
        <img class="product-img" src="${p.images[0]}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <div>
          <span class="product-price">${p.price.toLocaleString()} ${p.currency}</span>
          <span class="old-price">${p.oldPrice.toLocaleString()} ${p.currency}</span>
        </div>
        <button class="btn-detail" data-id="${p.id}">اكتشف المنتج</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = `product.html?id=${btn.dataset.id}`;
    });
  });

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = `product.html?id=${card.dataset.id}`;
    });
  });
}

// ==================== RENDER PRODUCT DETAIL PAGE ====================
function renderProductDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  if (!productId || !PRODUCTS[productId]) {
    document.getElementById('productDetail').innerHTML = '<p style="padding:2rem;text-align:center">المنتج غير موجود</p>';
    return;
  }
  currentProduct = { ...PRODUCTS[productId] };
  const p = currentProduct;

  document.title = `Fashion by Hanin – ${p.name}`;

  // Gallery
  let thumbsHtml = '';
  p.images.forEach((img, idx) => {
    thumbsHtml += `<img class="thumb ${idx === 0 ? 'active' : ''}" src="${img}" data-img="${img}" alt="">`;
  });

  // Colors
  let colorsHtml = `<div class="color-selector"><strong>اللون:</strong>`;
  p.colors.forEach((c, idx) => {
    colorsHtml += `<div class="color-swatch ${idx === 0 ? 'active' : ''}" style="background:${c.hex}" data-color="${c.name}" data-img="${c.img}" title="${c.name}"></div>`;
  });
  colorsHtml += `</div>`;

  // Sizes
  let sizesHtml = `<div class="size-selector"><strong>المقاس:</strong><div style="margin-top:0.5rem">`;
  p.sizes.forEach(sz => {
    sizesHtml += `<button class="size-btn" data-size="${sz}">${sz}</button>`;
  });
  sizesHtml += `</div></div>`;

  // العمود الأول: الصور — العمود الثاني: المعلومات (مباشرة داخل .product-detail grid)
  const detailHtml = `
    <div class="product-gallery">
      <div class="main-image">
        <img id="mainImage" src="${p.images[0]}" alt="${p.name}">
      </div>
      <div class="thumb-list" id="thumbList">${thumbsHtml}</div>
    </div>
    <div class="product-info-detail">
      <h1 class="product-name">${p.name}</h1>
      <div class="price-detail">
        ${p.price.toLocaleString()} ${p.currency}
        <span class="old-price" style="font-size:1rem;font-weight:400">${p.oldPrice.toLocaleString()} ${p.currency}</span>
      </div>
      <p style="color:#666;font-size:0.95rem;line-height:1.9;margin-bottom:1.5rem;border-top:1px solid #e8e8e8;padding-top:1.2rem">${p.description}</p>
      ${colorsHtml}
      ${sizesHtml}
      <button class="btn-add-cart" id="addToCartBtn">
        <i class="fas fa-shopping-bag" style="margin-left:0.5rem"></i>أضف إلى السلة
      </button>
    </div>
  `;

  document.getElementById('productDetail').innerHTML = detailHtml;

  // Thumb click
  document.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      document.getElementById('mainImage').src = thumb.dataset.img;
    });
  });

  // Color click
  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      document.getElementById('mainImage').src = sw.dataset.img;
    });
  });

  // Size select
  let selectedSize = p.sizes[0];
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
    });
  });
  document.querySelector('.size-btn')?.classList.add('active');

  // Add to cart
  document.getElementById('addToCartBtn')?.addEventListener('click', () => {
    const selectedColor = document.querySelector('.color-swatch.active')?.dataset.color || p.colors[0].name;
    cart.push({ id: p.id, name: p.name, price: p.price, qty: 1, color: selectedColor, size: selectedSize });
    updateCartBadge();
    showToast(`✓ تمت إضافة "${p.name}" إلى السلة`);
  });

  // ==================== ORDER FORM ====================
  const wilayaOptions = Object.keys(WILAYAS).map(w => `<option value="${w}">${w}</option>`).join('');

  const orderHtml = `
    <h3>معلومات الطلب والتوصيل</h3>
    <div id="orderForm">
      <div class="form-group">
        <label>الاسم الكامل *</label>
        <input type="text" id="fullName" placeholder="أدخل اسمك الكامل" required>
      </div>
      <div class="form-group">
        <label>رقم الهاتف *</label>
        <input type="tel" id="phone" placeholder="06XXXXXXXX أو 07XXXXXXXX" required>
      </div>
      <div class="form-group">
        <label>الولاية *</label>
        <select id="wilayaSelect">
          <option value="">— اختر الولاية —</option>
          ${wilayaOptions}
        </select>
      </div>
      <div class="form-group">
        <label>البلدية *</label>
        <select id="communeSelect">
          <option value="">— اختر البلدية —</option>
        </select>
      </div>
      <div class="form-group">
        <label>العنوان التفصيلي *</label>
        <input type="text" id="address" placeholder="رقم، شارع، حي..." required>
      </div>
      <div class="form-group">
        <label>طريقة التوصيل</label>
        <div class="radio-group">
          <label><input type="radio" name="delivery" value="home" checked> توصيل للمنزل</label>
          <label><input type="radio" name="delivery" value="post"> مكتب البريد</label>
        </div>
      </div>
      <div class="form-group">
        <label>طريقة الدفع</label>
        <div class="radio-group">
          <label><input type="radio" name="payment" value="cod" checked> عند الاستلام</label>
          <label><input type="radio" name="payment" value="ccp"> تحويل CCP</label>
        </div>
      </div>
      <button type="button" class="btn-submit" id="submitOrderBtn">
        <i class="fas fa-paper-plane" style="margin-left:0.5rem"></i>إرسال الطلب
      </button>
    </div>
  `;
  document.getElementById('orderFormSection').innerHTML = orderHtml;

  // Wilaya → commune
  const wilayaSel = document.getElementById('wilayaSelect');
  const communeSel = document.getElementById('communeSelect');
  wilayaSel.addEventListener('change', () => {
    const wilaya = wilayaSel.value;
    communeSel.innerHTML = '<option value="">— اختر البلدية —</option>';
    if (wilaya && WILAYAS[wilaya]) {
      WILAYAS[wilaya].forEach(c => {
        communeSel.innerHTML += `<option value="${c}">${c}</option>`;
      });
    }
  });

  // Submit
  document.getElementById('submitOrderBtn')?.addEventListener('click', async () => {
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const wilaya = wilayaSel.value;
    const commune = communeSel.value;
    const address = document.getElementById('address').value.trim();
    const delivery = document.querySelector('input[name="delivery"]:checked')?.value;
    const payment = document.querySelector('input[name="payment"]:checked')?.value;

    if (!name || !phone || !wilaya || !commune || !address) {
      showToast('⚠ يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const selectedColor = document.querySelector('.color-swatch.active')?.dataset.color || p.colors[0].name;

    const msg = `🛍 طلب جديد – Fashion by Hanin\n\n👤 الاسم: ${name}\n📞 الهاتف: ${phone}\n📍 ${wilaya} – ${commune}\n🏠 ${address}\n🚚 التوصيل: ${delivery === 'home' ? 'منزلي' : 'مكتب البريد'}\n💳 الدفع: ${payment === 'cod' ? 'عند الاستلام' : 'تحويل CCP'}\n\n🛒 المنتج: ${currentProduct.name}\n🎨 اللون: ${selectedColor}\n📐 المقاس: ${selectedSize}\n💰 السعر: ${currentProduct.price.toLocaleString()} ${currentProduct.currency}`;

    const submitBtn = document.getElementById('submitOrderBtn');
    submitBtn.textContent = 'جاري الإرسال...';
    submitBtn.disabled = true;

    try {
      const orderPayload = {
        name,
        phone,
        wilaya,
        commune,
        address,
        delivery,
        payment,
        products: [{
          name: currentProduct.name,
          price: currentProduct.price,
          quantity: 1,
          size: selectedSize,
          color: selectedColor
        }],
        total: currentProduct.price,
        productName: currentProduct.name
      };

      if (window.PREVIEW_DATA) {
        window.PREVIEW_DATA.addStoredOrder(orderPayload);
      }
      
      showToast('✓ تم تسجيل طلبك التجريبي بنجاح (وضع المعاينة)!');
      document.getElementById('fullName').value = '';
      document.getElementById('phone').value = '';
      document.getElementById('address').value = '';
      wilayaSel.value = '';
      communeSel.innerHTML = '<option value="">— اختر البلدية —</option>';
    } catch (err) {
      showToast('حدث خطأ، يرجى المحاولة مجدداً');
    } finally {
      submitBtn.textContent = 'إرسال الطلب';
      submitBtn.disabled = false;
    }
  });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  const savedCart = localStorage.getItem('fashion_hanin_cart');
  if (savedCart) {
    try { cart = JSON.parse(savedCart); } catch(e) { cart = []; }
  }
  updateCartBadge();

  if (document.getElementById('productsGrid')) renderProductCards();
  if (document.getElementById('productDetail')) renderProductDetailPage();

  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      const total = cart.reduce((s, i) => s + i.qty, 0);
      showToast(total > 0 ? `السلة تحتوي على ${total} منتج` : 'السلة فارغة');
    });
  }

  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
});
