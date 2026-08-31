document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const outputDiv = document.getElementById('output');

    // Prompt Şablonları
    const templates = {
        standard: (role, task, context, format) => `
# Rol
Sen bir ${role || 'uzman'}'sın.

# Görev
${task || 'Belirtilen görevi yerine getir.'}

# Bağlam
${context || 'Ek bir bağlam sağlanmadı.'}

# Çıktı Formatı
Lütfen cevabını ${format || 'düz metin'} formatında ver.
`.trim(),

        cot: (role, task, context, format) => `
# Rol
Sen deneyimli bir ${role || 'uzman'}'sın.

# Görev
${task || 'Sorunu çöz.'}

# Adım Adım Düşünme Talimatı
1. Önce problemi parçalarına ayır.
2. Her adımı mantıksal olarak değerlendir.
3. Sonuca varmadan önce alternatifleri düşün.
4. Nihai cevabı net bir şekilde ifade et.

# Bağlam
${context || 'Genel bir senaryo.'}

# Çıktı Formatı
Cevabını ${format || 'açıklayıcı metin'} olarak sun.
`.trim(),

        fewshot: (role, task, context, format) => `
# Rol
Sen bir ${role || 'profesyonel'}'sın.

# Görev
${task || 'Örnekleri takip ederek görevi tamamla.'}

# Örnekler
Girdi: "Basit bir örnek"
Çıktı: "Beklenen basit çıktı yapısı"

Girdi: "Daha karmaşık bir örnek"
Çıktı: "Detaylı ve yapılandırılmış cevap"

# Bağlam
${context || 'Kullanıcıdan gelen yeni girdi.'}

# Yeni Girdi İçin Beklenti
Yukarıdaki örneklerdeki kalite ve formatta cevap üret.
Format: ${format || 'metin'}
`.trim(),

        refiner: (role, task, context, format) => `
# Rol
Sen eleştirel düşünen bir ${role || 'uzman'}'sın.

# Görev
Aşağıdaki isteği en iyi şekilde yerine getir, ancak cevabı vermeden önce kendi kendine şu soruları sor:
- Bu cevap kullanıcının ihtiyacını tam karşılıyor mu?
- Daha net veya daha detaylı olabilir miyim?
- Olası hatalar veya eksiklikler var mı?

# İstek
${task || 'Konuyu derinlemesine analiz et.'}

# Bağlam
${context || 'Kalite odaklı bir yaklaşım.'}

# Çıktı Formatı
Önce kısa bir öz-değerlendirme yap, ardından nihai cevabı ${format || 'metin'} formatında sun.
`.trim()
    };

    generateBtn.addEventListener('click', () => {
        const role = document.getElementById('role').value;
        const task = document.getElementById('task').value;
        const context = document.getElementById('context').value;
        const technique = document.getElementById('technique').value;
        const format = document.getElementById('format').options[document.getElementById('format').selectedIndex].text;

        if (!task) {
            outputDiv.textContent = "⚠️ Lütfen en azından 'Görev' alanını doldurun.";
            return;
        }

        const generator = templates[technique] || templates.standard;
        const prompt = generator(role, task, context, format);

        outputDiv.textContent = prompt;
    });

    copyBtn.addEventListener('click', () => {
        const text = outputDiv.textContent;
        if (!text || text.startsWith("⚠️")) {
            alert("Kopyalanacak içerik yok!");
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "✅ Kopyalandı!";
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Kopyalama hatası:', err);
            alert("Kopyalama başarısız oldu.");
        });
    });
});
