const state = {
    platform: 'chatgpt',
    technique: 'standard',
    history: []
};

const platforms = {
    chatgpt: { name: "ChatGPT", icon: "🤖", model: "gpt-4o", tips: `
<strong>ChatGPT için İpuçları:</strong>
<ul>
<li>System ve User mesajlarını net ayır</li>
<li>Rolü system'de tanımla, görevi user'da</li>
<li>Temperature düşük tut (0.2-0.4) net görevler için</li>
<li>Markdown formatını iyi kullanır</li>
<li>JSON istiyorsan şemayı örnekle ver</li>
</ul>
` },
    gemini: { name: "Gemini", icon: "✨", model: "gemini-1.5-pro", tips: `
<strong>Gemini için İpuçları:</strong>
<ul>
<li>System Instruction kullan - güvenlik önemli</li>
<li>Çok modlu: görsel betimleme ekle</li>
<li>1M token bağlam - uzun dokümanları ver</li>
<li>Google Search grounding'i tetiklemek için güncel bilgi iste</li>
<li><thinking> etiketi ile CoT'yi teşvik et</li>
</ul>
` },
    qwen: { name: "Qwen", icon: "🌙", model: "qwen2.5-72b", tips: `
<strong>Qwen için İpuçları:</strong>
<ul>
<li>Çince + İngilizce karışık kullanabilirsin</li>
<li>Matematik için LaTeX: $E=mc^2$</li>
<li>Kod için dil belirt: \`\`\`python</li>
<li>Uzun bağlamda kaybolmaz - detay ver</li>
<li>Tool kullanımı için JSON formatı öğret</li>
</ul>
` },
    zai: { name: "Z.ai GLM", icon: "⚡", model: "glm-4-plus", tips: `
<strong>Z.ai (GLM) için İpuçları:</strong>
<ul>
<li>Mantıksal akıl yürütme - adım adım iste</li>
<li>Çince kaynakları iyi bilir</li>
<li>Role-play'de detaylı persona ver</li>
<li>Web search ve code interpreter tetikle</li>
<li>Çıktıda önce analiz, sonra sonuç</li>
</ul>
` }
};

const techniques = {
    standard: { name: "Standart", icon: "📝", desc: "Net talimat" },
    cot: { name: "Chain of Thought", icon: "🧠", desc: "Adım adım" },
    fewshot: { name: "Few-Shot", icon: "📚", desc: "Örneklerle" },
    roleplay: { name: "Role-Playing", icon: "🎭", desc: "Uzman rolü" },
    react: { name: "ReAct", icon: "🔄", desc: "Düşün+Eylem" },
    tot: { name: "Tree of Thoughts", icon: "🌳", desc: "Çoklu dallar" },
    refiner: { name: "Refiner", icon: "🔍", desc: "Öz-eleştiri" },
    meta: { name: "Meta-Prompting", icon: "♻️", desc: "Prompt tasarlar" }
};

const templates = [
    { title: "E-Ticaret Ürün Açıklaması", icon: "🛒", desc: "SEO uyumlu ürün metni", tags: ["chatgpt","standard"], data: { role: "E-Ticaret Metin Yazarı ve SEO Uzmanı", task: "Shopify mağazam için kablosuz kulaklık ürün açıklaması yaz. Dönüşüm odaklı, SEO uyumlu, faydaları vurgulayan.", context: "Hedef: 25-35 yaş teknoloji severler. Ürün: 30 saat pil, ANC, Bluetooth 5.3, 2 yıl garanti. Rakiplerden fark: premium malzeme, uygun fiyat.", audience: "Teknoloji meraklısı genç profesyoneller", constraints: "300 kelime, emoji kullanma, 3 madde faydası", tone: "friendly" } },
    { title: "Kod Review ve Refactor", icon: "💻", desc: "Kod analizi ve iyileştirme", tags: ["qwen","cot"], data: { role: "Kıdemli Yazılım Mimarı, 15 yıl deneyimli", task: "Aşağıdaki Python kodunu incele, hataları bul, performansı iyileştir ve clean code prensiplerine göre yeniden yaz.", context: "Proje: FastAPI tabanlı e-ticaret API. Kod: def get_products(): products = db.query(Product).all(); return products  # N+1 problemi var", audience: "Orta seviye Python geliştiriciler", constraints: "SOLID prensiplerine uy, type hint ekle, docstring yaz", tone: "expert", technique: "cot" } },
    { title: "Pazar Araştırması", icon: "📊", desc: "ReAct ile derin araştırma", tags: ["gemini","react"], data: { role: "Pazar Araştırma Uzmanı", task: "Türkiye'de yapay zeka girişimleri pazarı 2024-2025 analizi yap. Büyüklük, oyuncular, fırsatlar, riskler.", context: "Yatırım sunumu için. Kaynaklar: TUBISAD, StartupCentrum, haberler. Odak: B2B SaaS AI.", audience: "Yatırımcılar ve girişimciler", constraints: "Veri odaklı, kaynak belirt, 2025 projeksiyonu ekle", tone: "formal", technique: "react" } },
    { title: "Yaratıcı Hikaye", icon: "✨", desc: "Tree of Thoughts ile hikaye", tags: ["zai","tot"], data: { role: "Ödüllü Bilim Kurgu Yazarı", task: "Yapay zekanın bilinç kazandığı bir dünyada geçen, 1000 kelimelik duygusal bir kısa hikaye yaz.", context: "Tema: İnsan-AI dostluğu, etik ikilemler, 2045 İstanbul. Tarz: Black Mirror + Studio Ghibli sıcaklığı.", audience: "Bilim kurgu severler, genel kitle", constraints: "3 karakter, twist ending, diyaloglar doğal olsun", tone: "creative", technique: "tot" } },
    { title: "SEO Blog Yazısı", icon: "📝", desc: "Few-Shot blog üretimi", tags: ["chatgpt","fewshot"], data: { role: "SEO ve İçerik Stratejisti", task: "Prompt mühendisliği nedir? Konulu, SEO uyumlu, 1500 kelimelik blog yazısı yaz.", context: "Anahtar kelimeler: prompt engineering, yapay zeka, ChatGPT. Hedef: Google'da ilk 3. Örnek yapı: Giriş, Nedir, Teknikler, Örnekler, Sonuç.", examples: "Girdi: 'Makine öğrenmesi nedir?' Çıktı: '# Makine Öğrenmesi Nedir?...' (H2, H3, liste, kod örneği içeren yapı)", audience: "Yapay zekaya yeni başlayanlar", constraints: "Yoast SEO uyumlu, okunabilirlik yüksek, iç link önerisi ekle", tone: "friendly", technique: "fewshot" } },
    { title: "İş Planı Oluşturucu", icon: "🚀", desc: "Meta-prompt ile iş planı", tags: ["qwen","meta"], data: { role: "Girişimcilik Mentoru ve VC", task: "AI tabanlı bir prompt marketplace için iş planı oluştur. Lean canvas + finansal projeksiyon.", context: "Fikir: Geliştiriciler prompt satacak, şirketler satın alacak. Gelir modeli: %20 komisyon. Rakip: PromptBase. Fark: Türkçe destek, canlı test.", audience: "Melek yatırımcılar", constraints: "1 sayfa executive summary + detaylı bölümler, 3 yıllık projeksiyon", tone: "formal", technique: "meta" } },
    { title: "Müşteri Destek Botu", icon: "🤖", desc: "Refiner ile bot prompt'u", tags: ["zai","refiner"], data: { role: "Conversational AI Tasarımcısı", task: "E-ticaret müşteri destek chatbotu için system prompt tasarla. İade, kargo, ürün bilgisi konularında yardımcı olacak.", context: "Marka tonu: Samimi, çözüm odaklı. Yasaklar: Fiyat tartışma, rakip övme. Yönlendirme: İnsan desteğe geçiş senaryoları.", audience: "Online alışveriş yapan müşteriler", constraints: "Empatik, kısa cevaplar, Türkçe, gerekirse İngilizce", tone: "friendly", technique: "refiner" } },
];

// DOM
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function init() {
    renderPlatforms();
    renderTechniques();
    renderTemplates();
    bindEvents();
    updatePlatformTips();
    loadHistory();
    loadRecent();
}

function renderPlatforms() {
    const grid = $('#platformGrid');
    grid.innerHTML = Object.entries(platforms).map(([key, p]) => `
        <div class="platform-card ${state.platform === key ? 'active' : ''}" data-platform="${key}">
            <div class="icon">${p.icon}</div>
            <div class="name">${p.name}</div>
            <div class="model">${p.model}</div>
        </div>
    `).join('');
    
    grid.querySelectorAll('.platform-card').forEach(card => {
        card.addEventListener('click', () => {
            state.platform = card.dataset.platform;
            renderPlatforms();
            updatePlatformTips();
            updateIndicators();
        });
    });
}

function renderTechniques() {
    const list = $('#techniqueList');
    list.innerHTML = Object.entries(techniques).map(([key, t]) => `
        <div class="tech-item ${state.technique === key ? 'active' : ''}" data-tech="${key}">
            <div class="icon">${t.icon}</div>
            <div class="info">
                <div class="name">${t.name}</div>
                <div class="desc">${t.desc}</div>
            </div>
        </div>
    `).join('');
    
    list.querySelectorAll('.tech-item').forEach(item => {
        item.addEventListener('click', () => {
            state.technique = item.dataset.tech;
            renderTechniques();
        });
    });
}

function renderTemplates() {
    const list = $('#templateList');
    list.innerHTML = templates.map((t, i) => `
        <div class="template-card" data-index="${i}">
            <div class="t-title">${t.icon} ${t.title}</div>
            <div class="t-desc">${t.desc}</div>
            <div class="t-tags">${t.tags.map(tag => `<span class="t-tag">${tag}</span>`).join('')}</div>
        </div>
    `).join('');
    
    list.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            const tpl = templates[card.dataset.index];
            applyTemplate(tpl);
        });
    });
}

function applyTemplate(tpl) {
    $('#roleInput').value = tpl.data.role || '';
    $('#taskInput').value = tpl.data.task || '';
    $('#contextInput').value = tpl.data.context || '';
    $('#audienceInput').value = tpl.data.audience || '';
    $('#constraintsInput').value = tpl.data.constraints || '';
    $('#examplesInput').value = tpl.data.examples || '';
    if (tpl.data.tone) $('#toneSelect').value = tpl.data.tone;
    if (tpl.data.technique) {
        state.technique = tpl.data.technique;
        renderTechniques();
    }
    updateTaskCount();
    // Auto scroll to task
    $('#taskInput').focus();
}

function updatePlatformTips() {
    const p = platforms[state.platform];
    $('#platformTips').innerHTML = p.tips;
}

function updateIndicators() {
    $$('.p-ind').forEach(el => {
        el.classList.toggle('active', el.dataset.p === state.platform);
    });
}

function updateTaskCount() {
    $('#taskCount').textContent = $('#taskInput').value.length;
}

function bindEvents() {
    $('#taskInput').addEventListener('input', updateTaskCount);
    
    $('#generateBtn').addEventListener('click', generate);
    
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            generate();
        }
    });

    $('#clearBtn').addEventListener('click', () => {
        ['roleInput','taskInput','contextInput','audienceInput','constraintsInput','examplesInput'].forEach(id => {
            $(`#${id}`).value = '';
        });
        updateTaskCount();
    });

    $('#exampleBtn').addEventListener('click', () => {
        const random = templates[Math.floor(Math.random() * templates.length)];
        applyTemplate(random);
    });

    // Tabs
    $$('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            $$('.tab').forEach(t => t.classList.remove('active'));
            $$('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            $(`#tab-${target}`).classList.add('active');
        });
    });

    $('#copyBtn').addEventListener('click', () => {
        const text = $('#promptOutput').textContent;
        navigator.clipboard.writeText(text).then(() => {
            const btn = $('#copyBtn');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
            setTimeout(() => btn.innerHTML = orig, 2000);
        });
    });

    $('#optimizeBtn').addEventListener('click', optimizeCurrent);

    $('#runLiveTestBtn').addEventListener('click', runLiveTest);

    // History modal
    $('#historyBtn').addEventListener('click', () => {
        $('#historyModal').style.display = 'flex';
        loadHistoryModal();
    });
    $('#closeHistory').addEventListener('click', () => {
        $('#historyModal').style.display = 'none';
    });
    $('#historyModal').addEventListener('click', (e) => {
        if (e.target.id === 'historyModal') e.currentTarget.style.display = 'none';
    });
    $('#clearHistoryBtn').addEventListener('click', async () => {
        if (confirm('Tüm geçmiş silinsin mi?')) {
            await fetch('/api/history', { method: 'DELETE' });
            loadHistory();
            loadHistoryModal();
            loadRecent();
        }
    });
    $('#exportHistoryBtn').addEventListener('click', async () => {
        const res = await fetch('/api/history');
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prompt-history-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
    });
}

async function generate() {
    const task = $('#taskInput').value.trim();
    if (!task) {
        alert('⚠️ Lütfen en azından Görev alanını doldurun');
        $('#taskInput').focus();
        return;
    }

    const payload = {
        platform: state.platform,
        technique: state.technique,
        role: $('#roleInput').value.trim(),
        task,
        context: $('#contextInput').value.trim(),
        format: $('#formatSelect').value,
        audience: $('#audienceInput').value.trim(),
        constraints: $('#constraintsInput').value.trim(),
        examples: $('#examplesInput').value.trim(),
        tone: $('#toneSelect').value,
        language: $('#langSelect').value
    };

    const btn = $('#generateBtn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Oluşturuluyor...';
    btn.disabled = true;

    try {
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Hata');

        displayResult(data);
        loadRecent();
    } catch (err) {
        alert('Hata: ' + err.message);
    } finally {
        btn.innerHTML = orig;
        btn.disabled = false;
    }
}

function displayResult(data) {
    $('#outputPanel').style.display = 'block';
    $('#promptOutput').textContent = data.prompt;
    
    if (data.systemPrompt) {
        $('#systemPromptBox').style.display = 'block';
        $('#systemOutput').textContent = data.systemPrompt;
    } else {
        $('#systemPromptBox').style.display = 'none';
    }

    $('#outPlatform').textContent = `${platforms[state.platform]?.icon || ''} ${data.platform || state.platform}`;
    $('#outTechnique').textContent = `${techniques[state.technique]?.icon || ''} ${data.technique || state.technique}`;
    $('#outTokens').textContent = `~${data.analysis?.estimatedTokens || 0} token`;

    displayAnalysis(data.analysis);

    // Switch to prompt tab
    $$('.tab').forEach(t => t.classList.remove('active'));
    $$('.tab-content').forEach(c => c.classList.remove('active'));
    $('[data-tab="prompt"]').classList.add('active');
    $('#tab-prompt').classList.add('active');

    // Scroll to output
    $('#outputPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Reset live test
    $('#liveTestOutput').style.display = 'none';
    $('#liveTestMeta').style.display = 'none';
    $('#liveTestStatus').textContent = 'Yeni prompt için canlı test hazır. "Testi Çalıştır" butonuna basın.';
    $('#liveTestStatus').className = 'live-status';
}

function displayAnalysis(a) {
    if (!a) return;
    $('#scoreValue').textContent = a.score;
    $('#scoreBar').style.width = a.score + '%';
    $('#scoreLevel').textContent = a.level;
    
    // Color based on score
    let color = '#ef4444';
    if (a.score >= 75) color = '#10b981';
    else if (a.score >= 50) color = '#f59e0b';
    $('#scoreBar').style.background = color;
    $('#scoreLevel').style.color = color;

    $('#tokenValue').textContent = a.estimatedTokens;
    $('#tokenSub').textContent = `${a.length} karakter`;

    $('#wordValue').textContent = a.words;
    $('#wordSub').textContent = `${a.lines} satır`;

    $('#feedbackList').innerHTML = a.feedback.map(f => `<li>${f}</li>`).join('') || '<li>Analiz yok</li>';
    $('#suggestionList').innerHTML = a.suggestions.map(s => `<li>💡 ${s}</li>`).join('') || '<li>Harika! İyileştirme gerekmiyor 🎉</li>';
}

async function optimizeCurrent() {
    const prompt = $('#promptOutput').textContent;
    if (!prompt) return;

    const btn = $('#optimizeBtn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimize ediliyor...';
    btn.disabled = true;

    try {
        const res = await fetch('/api/optimize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, platform: state.platform })
        });
        const data = await res.json();
        $('#promptOutput').textContent = data.optimized;
        displayAnalysis(data.analysis);
    } catch (e) {
        alert('Optimize hatası: ' + e.message);
    } finally {
        btn.innerHTML = orig;
        btn.disabled = false;
    }
}

async function runLiveTest() {
    const prompt = $('#promptOutput').textContent;
    if (!prompt) {
        alert('Önce prompt oluşturun');
        return;
    }

    const status = $('#liveTestStatus');
    const output = $('#liveTestOutput');
    const meta = $('#liveTestMeta');

    status.textContent = '⏳ Canlı test çalışıyor... AI yanıtı bekleniyor';
    status.className = 'live-status loading';
    output.style.display = 'none';
    meta.style.display = 'none';

    const apiKeys = {
        chatgpt: $('#apiChatGPT').value.trim(),
        gemini: $('#apiGemini').value.trim(),
        qwen: $('#apiQwen').value.trim(),
        zai: $('#apiZai').value.trim()
    };

    try {
        const res = await fetch('/api/test-live', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, platform: state.platform, apiKeys })
        });
        const data = await res.json();

        output.textContent = data.response;
        output.style.display = 'block';
        meta.innerHTML = `
            <span>🤖 ${data.model}</span>
            <span>⏱️ ${data.latencyMs}ms</span>
            <span>🔢 ${data.tokensUsed} token</span>
            <span>${data.live ? '✅ Canlı' : '🧪 Simülasyon'}</span>
            <span>🕒 ${new Date(data.timestamp).toLocaleTimeString()}</span>
        `;
        meta.style.display = 'flex';
        status.textContent = data.note;
        status.className = 'live-status success';

    } catch (e) {
        status.textContent = '❌ Test hatası: ' + e.message;
        status.className = 'live-status';
    }
}

async function loadHistory() {
    try {
        const res = await fetch('/api/history');
        state.history = await res.json();
    } catch { state.history = []; }
}

async function loadRecent() {
    await loadHistory();
    const list = $('#recentList');
    if (!state.history.length) {
        list.innerHTML = '<p class="hint">Henüz prompt oluşturulmadı</p>';
        return;
    }
    list.innerHTML = state.history.slice(0, 5).map(h => `
        <div class="recent-item" data-id="${h.id}">
            <div class="r-title">${h.task.slice(0, 60)}</div>
            <div class="r-meta">
                <span>${platforms[h.platform]?.icon || ''} ${h.platform}</span>
                <span>${techniques[h.technique]?.icon || ''} ${h.technique}</span>
            </div>
        </div>
    `).join('');
    
    list.querySelectorAll('.recent-item').forEach(el => {
        el.addEventListener('click', () => {
            const item = state.history.find(x => x.id === el.dataset.id);
            if (item) {
                state.platform = item.platform;
                state.technique = item.technique;
                renderPlatforms();
                renderTechniques();
                $('#roleInput').value = item.role || '';
                $('#taskInput').value = item.task || '';
                $('#contextInput').value = item.context || '';
                $('#audienceInput').value = item.audience || '';
                $('#constraintsInput').value = item.constraints || '';
                $('#examplesInput').value = item.examples || '';
                if (item.result) displayResult({ ...item.result, analysis: item.analysis });
                updatePlatformTips();
                updateIndicators();
                updateTaskCount();
            }
        });
    });
}

async function loadHistoryModal() {
    await loadHistory();
    const list = $('#historyList');
    if (!state.history.length) {
        list.innerHTML = '<p class="hint">Geçmiş boş</p>';
        return;
    }
    list.innerHTML = state.history.map(h => `
        <div class="history-item">
            <div class="h-header">
                <div class="h-title">${h.task.slice(0, 80)}</div>
                <div class="h-time">${new Date(h.createdAt).toLocaleString('tr-TR')}</div>
            </div>
            <div class="h-preview">${(h.result?.prompt || '').slice(0, 150)}...</div>
            <div class="h-actions">
                <span class="badge">${platforms[h.platform]?.icon || ''} ${h.platform}</span>
                <span class="badge badge-tech">${techniques[h.technique]?.icon || ''} ${h.technique}</span>
                <button class="btn btn-small" onclick="navigator.clipboard.writeText(\`${(h.result?.prompt || '').replace(/`/g,'\\`').replace(/\$/g,'\\$')}\`)"><i class="fas fa-copy"></i> Kopyala</button>
            </div>
        </div>
    `).join('');
}

init();
