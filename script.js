// قائمة المستخدمين المعتمدين (في تطبيق حقيقي، يجب تخزينها في قاعدة بيانات)
const approvedUsers = [6113061454]; // يمكنك إضافة المزيد من المستخدمين هنا
let currentUser = null;

// عناصر DOM
const authSection = document.getElementById('authSection');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const mainMenu = document.getElementById('mainMenu');
const backBtn = document.getElementById('backBtn');

// أحداث تسجيل الدخول
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const userId = document.getElementById('userId').value.trim();
    
    if (!userId) {
        loginError.textContent = 'الرجاء إدخال معرف المستخدم';
        return;
    }
    
    // في تطبيق حقيقي، يجب التحقق من الخادم
    if (approvedUsers.includes(parseInt(userId))) {
        currentUser = userId;
        authSection.style.display = 'none';
        mainMenu.style.display = 'block';
        loginError.textContent = '';
    } else {
        loginError.textContent = 'المستخدم غير معتمد. الرجاء الاتصال بالمسؤول.';
    }
});

// عرض القسم المحدد وإخفاء الباقي
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    document.getElementById(sectionId).style.display = 'block';
    backBtn.style.display = 'block';
    mainMenu.style.display = 'none';
}

// العودة للقائمة الرئيسية
function showMainMenu() {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    backBtn.style.display = 'none';
    mainMenu.style.display = 'block';
}

// عرض IP المستخدم
function showMyIP() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.createElement('div');
            resultDiv.innerHTML = `
                <h3>IP الخاص بك:</h3>
                <p>${data.ip}</p>
                <button onclick="copyToClipboard('${data.ip}')">نسخ</button>
            `;
            
            // عرض النتيجة في نافذة منبثقة
            alert(`IP الخاص بك هو: ${data.ip}`);
        })
        .catch(error => {
            alert('حدث خطأ أثناء جلب IP الخاص بك');
            console.error(error);
        });
}

// نسخ النص إلى الحافظة
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert('تم النسخ إلى الحافظة'))
        .catch(err => console.error('Failed to copy: ', err));
}

// عرض معلومات البوت
function showInfo() {
    document.getElementById('infoModal').style.display = 'block';
}

// عرض القنوات
function showChannels() {
    document.getElementById('channelsModal').style.display = 'block';
}

// إغلاق النافذة المنبثقة
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// معالجة تتبع IP
document.getElementById('ipTrackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const ipAddress = document.getElementById('ipAddress').value.trim();
    const resultDiv = document.getElementById('ipResult');
    
    resultDiv.innerHTML = '<p>جاري التتبع...</p>';
    
    fetch(`https://ipwho.is/${ipAddress}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                resultDiv.innerHTML = '<p class="error">IP غير صالح أو غير مدعوم</p>';
                return;
            }
            
            resultDiv.innerHTML = `
                <h3>نتائج التتبع:</h3>
                <p><strong>الدولة:</strong> ${data.country}</p>
                <p><strong>المدينة:</strong> ${data.city}</p>
                <p><strong>المنطقة:</strong> ${data.region}</p>
                <p><strong>القارة:</strong> ${data.continent}</p>
                <p><strong>الموقع:</strong> <a href="https://maps.google.com/?q=${data.latitude},${data.longitude}" target="_blank">عرض على الخريطة</a></p>
                <p><strong>المزود:</strong> ${data.connection.org || 'غير معروف'}</p>
                <p><strong>ASN:</strong> ${data.connection.asn || 'غير معروف'}</p>
                <p><strong>التوقيت:</strong> ${data.timezone.current_time || 'غير معروف'}</p>
            `;
        })
        .catch(error => {
            resultDiv.innerHTML = '<p class="error">حدث خطأ أثناء جلب البيانات</p>';
            console.error(error);
        });
});

// معالجة تتبع رقم الهاتف
document.getElementById('phoneTrackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const resultDiv = document.getElementById('phoneResult');
    
    resultDiv.innerHTML = '<p>جاري التتبع...</p>';
    
    // في تطبيق حقيقي، يجب استخدام خدمة خارجية أو API
    // هذا مثال مبسط فقط
    try {
        // استخدام مكتبة libphonenumber-js بدلاً من phonenumbers
        const phoneInfo = {
            country: 'مصر', // سيتم تحديدها من رقم الهاتف
            carrier: 'فودافون', // سيتم تحديدها من رقم الهاتف
            timezone: 'Africa/Cairo'
        };
        
        resultDiv.innerHTML = `
            <h3>نتائج التتبع:</h3>
            <p><strong>الموقع:</strong> ${phoneInfo.country}</p>
            <p><strong>المشغل:</strong> ${phoneInfo.carrier}</p>
            <p><strong>المنطقة الزمنية:</strong> ${phoneInfo.timezone}</p>
            <p><strong>ملاحظة:</strong> هذه معلومات تجريبية فقط</p>
        `;
    } catch (error) {
        resultDiv.innerHTML = '<p class="error">رقم الهاتف غير صالح</p>';
        console.error(error);
    }
});

// معالجة تتبع اسم المستخدم
document.getElementById('usernameTrackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const resultDiv = document.getElementById('usernameResult');
    
    resultDiv.innerHTML = '<p>جاري البحث...</p>';
    
    // قائمة المواقع للبحث
    const socialSites = [
        { name: 'Facebook', url: `https://facebook.com/${username}` },
        { name: 'Twitter', url: `https://twitter.com/${username}` },
        { name: 'Instagram', url: `https://instagram.com/${username}` },
        { name: 'LinkedIn', url: `https://linkedin.com/in/${username}` },
        { name: 'GitHub', url: `https://github.com/${username}` },
        { name: 'YouTube', url: `https://youtube.com/${username}` }
    ];
    
    let resultsHTML = '<h3>نتائج البحث:</h3><div class="social-results">';
    
    // التحقق من كل موقع (هذا سيعمل فقط إذا كان الموقع يسمح بذلك)
    socialSites.forEach(site => {
        resultsHTML += `
            <div class="social-site">
                <p><strong>${site.name}:</strong> 
                <a href="${site.url}" target="_blank">${site.url}</a>
                <span class="status">جاري التحقق...</span></p>
            </div>
        `;
    });
    
    resultsHTML += '</div>';
    resultDiv.innerHTML = resultsHTML;
    
    // ملاحظة: في المتصفح، لا يمكنك التحقق من حالة الصفحة بسبب سياسة CORS
    // هذا مثال توضيحي فقط
    setTimeout(() => {
        document.querySelectorAll('.social-site .status').forEach(el => {
            el.textContent = 'غير متأكد (CORS يمنع التحقق)';
            el.style.color = '#e67e22';
        });
    }, 2000);
});

// معالجة إسبام المكالمات
document.getElementById('callSpamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const phoneNumber = document.getElementById('callNumber').value.trim();
    const callCount = document.getElementById('callCount').value;
    const resultDiv = document.getElementById('callSpamResult');
    
    resultDiv.innerHTML = '<p>جاري الإعداد...</p>';
    
    // في تطبيق حقيقي، هذا يتطلب اتصالاً بالخادم
    alert(`هذه الميزة تتطلب اتصالاً بالخادم الخلفي. لا يمكن تنفيذها مباشرة من المتصفح.`);
    
    // محاكاة العملية
    let count = 0;
    const interval = setInterval(() => {
        count++;
        resultDiv.innerHTML = `<p>إرسال المكالمة ${count} من ${callCount}...</p>`;
        
        if (count >= callCount) {
            clearInterval(interval);
            resultDiv.innerHTML += '<p class="success">تم الانتهاء من إسبام المكالمات!</p>';
        }
    }, 1000);
});

// معالجة إسبام الرسائل
document.getElementById('smsSpamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const phoneNumber = document.getElementById('smsNumber').value.trim();
    const smsCount = document.getElementById('smsCount').value;
    const resultDiv = document.getElementById('smsSpamResult');
    
    resultDiv.innerHTML = '<p>جاري الإعداد...</p>';
    
    // في تطبيق حقيقي، هذا يتطلب اتصالاً بالخادم
    alert(`هذه الميزة تتطلب اتصالاً بالخادم الخلفي. لا يمكن تنفيذها مباشرة من المتصفح.`);
    
    // محاكاة العملية
    let count = 0;
    const interval = setInterval(() => {
        count++;
        resultDiv.innerHTML = `<p>إرسال الرسالة ${count} من ${smsCount}...</p>`;
        
        if (count >= smsCount) {
            clearInterval(interval);
            resultDiv.innerHTML += '<p class="success">تم الانتهاء من إسبام الرسائل!</p>';
        }
    }, 800);
});

// معالجة إسبام الجيميل
document.getElementById('gmailSpamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('gmailAddress').value.trim();
    const count = document.getElementById('gmailCount').value;
    const resultDiv = document.getElementById('gmailSpamResult');
    
    resultDiv.innerHTML = '<p>جاري الإعداد...</p>';
    
    // في تطبيق حقيقي، هذا يتطلب اتصالاً بالخادم
    alert(`هذه الميزة تتطلب اتصالاً بالخادم الخلفي. لا يمكن تنفيذها مباشرة من المتصفح.`);
    
    // محاكاة العملية
    let sent = 0;
    const interval = setInterval(() => {
        sent++;
        resultDiv.innerHTML = `<p>إرسال الرسالة ${sent} من ${count} إلى ${email}...</p>`;
        
        if (sent >= count) {
            clearInterval(interval);
            resultDiv.innerHTML += '<p class="success">تم الانتهاء من إسبام الجيميل!</p>';
        }
    }, 500);
});

// متغيرات هجوم DDoS
let ddosActive = false;
let successRequests = 0;
let serverErrors = 0;
let otherErrors = 0;

// معالجة هجوم DDoS
document.getElementById('ddosForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const targetUrl = document.getElementById('targetUrl').value.trim();
    const threadCount = document.getElementById('threadCount').value;
    
    // التحقق من صحة الرابط
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        alert('الرجاء إدخال رابط يبدأ بـ http:// أو https://');
        return;
    }
    
    // بدء الهجوم (محاكاة فقط لأغراض التوضيح)
    alert(`هجوم DDoS الحقيقي لا يمكن تنفيذه من المتصفح بسبب قيود الأمان. هذه محاكاة فقط.`);
    
    ddosActive = true;
    successRequests = 0;
    serverErrors = 0;
    otherErrors = 0;
    
    updateDDoSStats();
    
    // محاكاة إرسال الطلبات
    const interval = setInterval(() => {
        if (!ddosActive) {
            clearInterval(interval);
            return;
        }
        
        // محاكاة نتائج عشوائية
        const random = Math.random();
        if (random > 0.7) {
            successRequests++;
        } else if (random > 0.4) {
            serverErrors++;
        } else {
            otherErrors++;
        }
        
        updateDDoSStats();
    }, 100);
});

// إيقاف هجوم DDoS
function stopDDoS() {
    ddosActive = false;
    document.getElementById('ddosResult').innerHTML += '<p>تم إيقاف الهجوم</p>';
}

// تحديث إحصائيات DDoS
function updateDDoSStats() {
    document.getElementById('successRequests').textContent = successRequests;
    document.getElementById('serverErrors').textContent = serverErrors;
    document.getElementById('otherErrors').textContent = otherErrors;
}