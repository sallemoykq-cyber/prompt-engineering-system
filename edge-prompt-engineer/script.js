document.addEventListener('DOMContentLoaded', () => {
    let state = { platform: 'chatgpt' };

    // Platform selection
    document.querySelectorAll('.p-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.p-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.platform = card.dataset.p;
        });
    });

    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const optimizeBtn = document.getElementById('optimizeBtn');
    const outputDiv = document.getElementById('output');
    const resultArea = document.getElementById('resultArea');

    const PLATFORMS = {
        chatgpt: { name: "ChatGPT", model: "gpt-4o" },
        gemini: { name: "Gemini", model: "gemini-1.5-pro" },
        qwen: { name: "Qwen", model: "qwen2.5" },
        zai: { name: "Z.ai", model: "glm-4-plus" }
    };

    const TECHNIQUES = {
        standard: (role, task, context, format, tone) => `Sen bir ${role || 'uzman'}sın. ${toneHint(tone)}\n\n# GÖREV\n${task}\n\n# BAĞLAM\n${context || 'Genel'}\n\n# FORMAT\n${format} olarak yanıt ver.\n\n# PLATFORM: ChatGPT için optimize edildi - net ve eyleme geçirilebilir ol.`,
        cot: (role, task, context, format, tone) => `Sen deneyimli bir ${role || 'uzman'}sın. ${toneHint(tone)}\n\n# GÖREV\n${task}\n\n# CHAIN OF THOUGHT PROTOKOLÜ\n1. Problemi özetle\n2. Alt görevlere böl\n3. Her adımı mantıksal çöz\n4. Alternatifleri değerlendir\n5. Nihai cevabı sentezle\n\n# BAĞLAM\n${context || 'Genel senaryo'}\n\n# ÇIKTI\n${format} formatında, adımları göstererek.`,
        fewshot: (role, task, context, format, tone) => `Sen bir ${role || 'profesyonel'}sin. ${toneHint(tone)}\n\n# GÖREV\n${task}\n\n# ÖRNEKLER\nGirdi: "Basit örnek"\nÇıktı: "Beklenen yapı"\n\nGirdi: "Karmaşık örnek"\nÇıktı: "Detaylı cevap"\n\n# BAĞLAM\n${context || 'Yeni girdi'}\n\n# BEKLENTİ\nÖrneklerdeki kalitede, ${format} formatında üret.`,
        roleplay: (role, task, context, format, tone) => `ROLE-PLAY: Sen ${role || 'dünya çapında uzman'}sın. 20+ yıl deneyim, ödüllü.\n\nSenaryo: ${context || 'Profesyonel danışmanlık'}\nGörev: ${task}\n\nKurallar:\n- Rolden çıkma\n- Deneyimlerinden örnek ver\n- Jargonu doğru kullan\n- ${toneHint(tone)}\n\nFormat: ${format}`,
        react: (role, task, context, format) => `Sen ${role || 'uzman'}sın.\n\nGörev: ${task}\nBağlam: ${context}\n\nReAct Döngüsü:\nThought: Ne düşünüyorsun?\nAction: Hangi eylem?\nObservation: Sonuç?\n... 3-5 döngü\nFinal Answer: Nihai cevap\n\nFormat: ${format}`,
        tot: (role, task, context, format) => `Sen ${role || 'uzman'}sın.\n\nGörev: ${task}\nBağlam: ${context}\n\nTree of Thoughts:\nDal 1: Analitik yaklaşım\nDal 2: Yaratıcı yaklaşım\nDal 3: Pratik yaklaşım\n\nHer dalı değerlendir, matris oluştur, sentezle.\n\nFormat: ${format}`,
        refiner: (role, task, context, format) => `Sen eleştirel ${role || 'uzman'}sın.\n\nGörev: ${task}\nBağlam: ${context}\n\nAşama 1: İlk taslak oluştur\nAşama 2: Puanla (Doğruluk, Tamlık, Netlik, Pratiklik) /10\nAşama 3: İyileştirilmiş final versiyon\n\nFormat: ${format}`,
        meta: (role, task, context, format) => `Sen prompt mühendisisin. Görev: ${task}\nBağlam: ${context}\n\nMeta-Prompt Tasarımı:\n1. Görev analizi\n2. ${PLATFORMS[state.platform]?.name || 'AI'} için en iyi yapı\n3. Kopyala-yapıştır hazır prompt yaz\n4. 3 varyasyon (kısa, detaylı, yaratıcı)\n5. Test önerisi\n\nFormat: ${format}`
    };

    function toneHint(tone) {
        const map = {
            formal: "Resmi ve profesyonel ton kullan.",
            friendly: "Samimi ve dostane ol.",
            expert: "Uzman ve teknik dille yaz.",
            creative: "Yaratıcı ve ilham verici ol.",
            concise: "Kısa ve öz ol."
        };
        return map[tone] || "";
    }

    function analyzePrompt(prompt) {
        const len = prompt.length;
        let score = 50;
        if (len > 200) score += 20;
        if (len > 500) score += 15;
        if (prompt.includes('#')) score += 5;
        if (prompt.toLowerCase().includes('örnek')) score += 5;
        if (prompt.includes('adım')) score += 5;
        score = Math.min(100, score);
        let level = score >= 85 ? "Uzman" : score >= 70 ? "İleri" : score >= 50 ? "Orta" : "Temel";
        return { score, level, tokens: Math.ceil(len/4) };
    }

    async function generatePrompt() {
        const role = document.getElementById('role').value;
        const task = document.getElementById('task').value;
        const context = document.getElementById('context').value;
        const technique = document.getElementById('technique').value;
        const format = document.getElementById('format').value;
        const tone = document.getElementById('tone').value;
        const lang = document.getElementById('lang').value;

        if (!task) {
            outputDiv.textContent = "⚠️ Lütfen en azından Görev alanını doldurun.";
            resultArea.style.display = 'block';
            return;
        }

        // Try to use live backend if available
        try {
            const res = await fetch('http://localhost:3000/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform: state.platform,
                    technique,
                    role, task, context,
                    format,
                    tone,
                    language: lang
                })
            });
            if (res.ok) {
                const data = await res.json();
                outputDiv.textContent = data.prompt;
                document.getElementById('mScore').textContent = data.analysis.score;
                document.getElementById('mToken').textContent = data.analysis.estimatedTokens;
                document.getElementById('mLevel').textContent = data.analysis.level;
                document.getElementById('tokenInfo').textContent = `~${data.analysis.estimatedTokens} token • ${data.platform}`;
                document.getElementById('metrics').style.display = 'grid';
                resultArea.style.display = 'block';
                // Save to storage
                chrome.storage?.local?.set?.({ lastPrompt: data.prompt });
                return;
            }
        } catch (e) {
            console.log('Backend yok, local üretim kullanılıyor', e);
        }

        // Fallback local generation
        const generator = TECHNIQUES[technique] || TECHNIQUES.standard;
        const prompt = generator(role, task, context, format, tone);
        const analysis = analyzePrompt(prompt);

        outputDiv.textContent = prompt;
        document.getElementById('mScore').textContent = analysis.score;
        document.getElementById('mToken').textContent = analysis.tokens;
        document.getElementById('mLevel').textContent = analysis.level;
        document.getElementById('tokenInfo').textContent = `~${analysis.tokens} token • ${PLATFORMS[state.platform].name}`;
        document.getElementById('metrics').style.display = 'grid';
        resultArea.style.display = 'block';
    }

    generateBtn.addEventListener('click', generatePrompt);

    // Enter to generate
    document.getElementById('task').addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') generatePrompt();
    });

    copyBtn.addEventListener('click', () => {
        const text = outputDiv.textContent;
        if (!text || text.startsWith("⚠️")) return;
        navigator.clipboard.writeText(text).then(() => {
            const orig = copyBtn.textContent;
            copyBtn.textContent = "✅ Kopyalandı!";
            setTimeout(() => copyBtn.textContent = orig, 2000);
        });
    });

    optimizeBtn.addEventListener('click', async () => {
        let prompt = outputDiv.textContent;
        if (!prompt) return;
        
        // Try backend optimize
        try {
            const res = await fetch('http://localhost:3000/api/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, platform: state.platform })
            });
            if (res.ok) {
                const data = await res.json();
                outputDiv.textContent = data.optimized;
                document.getElementById('mScore').textContent = data.analysis.score;
                document.getElementById('mToken').textContent = data.analysis.estimatedTokens;
                return;
            }
        } catch {}

        // Local simple optimize
        prompt = prompt.replace(/\n{3,}/g, '\n\n').trim();
        if (!prompt.includes('# GÖREV') && prompt.length > 200) {
            prompt = "# GÖREV\n" + prompt;
        }
        outputDiv.textContent = prompt + "\n\n[Optimize edildi - daha net ve yapılandırılmış]";
    });

    document.getElementById('openWebBtn').addEventListener('click', () => {
        chrome.tabs?.create?.({ url: 'http://localhost:3000' }) || window.open('http://localhost:3000', '_blank');
    });

    document.getElementById('localLink').addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs?.create?.({ url: 'http://localhost:3000' }) || window.open('http://localhost:3000', '_blank');
    });
});
