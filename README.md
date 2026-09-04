# PromptForge - Multi-AI Prompt Engineering System 🚀

**Canlı Çalışan Sistem** | Gemini, ChatGPT, Qwen, Z.ai için profesyonel prompt mühendisliği platformu

![Live](https://img.shields.io/badge/Status-LIVE-brightgreen)
![Platforms](https://img.shields.io/badge/Platforms-4-blue)
![Techniques](https://img.shields.io/badge/Techniques-8-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Özellikler

### Canlı Sistem (Simülasyon Değil!)
- **Gerçek Express.js Backend** - `server.js` ile canlı API
- **Gerçek Zamanlı Prompt Üretimi** - Anlık analiz ve optimizasyon
- **Canlı AI Testi** - API anahtarı ile gerçek model testi, yoksa akıllı simülasyon
- **Kalıcı Geçmiş** - Dosya tabanlı history, export/import
- **Edge Eklentisi** - Tarayıcıda anında prompt üretimi, backend ile entegre

### 4 AI Platformu için Optimize
| Platform | Model | Güçlü Yönler | Özel Format |
|----------|-------|--------------|-------------|
| 🤖 **ChatGPT** | gpt-4o | Genel, Kodlama, Yaratıcı | System/User ayrımı, Temperature |
| ✨ **Gemini** | gemini-1.5-pro | Çok modlu, 1M token, Google | System Instruction, Safety |
| 🌙 **Qwen** | qwen2.5-72b | Çok dilli, Matematik, Kod | Bilingual, LaTeX, Uzun bağlam |
| ⚡ **Z.ai GLM** | glm-4-plus | Çince, Mantık, Bilgi | Adım adım çıkarım, Tools |

### 8 Prompt Tekniği
1. **📝 Standart** - Net, doğrudan talimat
2. **🧠 Chain of Thought** - Adım adım düşünme
3. **📚 Few-Shot** - Örneklerle öğrenme
4. **🎭 Role-Playing** - Uzman rolü atama
5. **🔄 ReAct** - Düşün + Eylem + Gözlem döngüsü
6. **🌳 Tree of Thoughts** - Çoklu düşünce dalları, değerlendirme matrisi
7. **🔍 Refiner** - Öz-eleştiri ve iyileştirme (puanlama)
8. **♻️ Meta-Prompting** - Prompt hakkında prompt tasarlar

### Gelişmiş Analiz
- **Kalite Skoru** (0-100) + Seviye (Başlangıç → Uzman)
- **Token Tahmini** (karakter/4)
- **Yapı Analizi** - Başlık, örnek, format kontrolü
- **Geri Bildirim** + İyileştirme önerileri
- **Platform Uyumluluk** kontrolü

## 🚀 Hızlı Başlangıç - Canlı Sistemi Çalıştır

```bash
# Bağımlılıkları yükle
npm install

# Canlı sistemi başlat (0.0.0.0:3000)
npm start

# veya geliştirme modu (auto-reload)
npm run dev
```

Tarayıcıda aç: **http://localhost:3000**

> Sistem canlıdır - simülasyon değil! Backend Express, frontend vanilla JS, file-based persistence.

### Edge Eklentisi
1. `edge://extensions` → Geliştirici modu aç
2. "Paketlenmemiş öğe yükle" → `edge-prompt-engineer` klasörünü seç
3. Yan panelde PromptForge'u kullan
4. Web uygulaması çalışıyorsa (localhost:3000) otomatik backend'e bağlanır

## 🎯 Kullanım

### Web Uygulaması
1. **Platform seç** (ChatGPT/Gemini/Qwen/Z.ai)
2. **Teknik seç** (CoT, Few-Shot, vb.)
3. **Formu doldur**:
   - Rol / Persona (örn: Kıdemli E-Ticaret Stratejisti)
   - Görev (zorunlu)
   - Bağlam, Hedef Kitle, Kısıtlar, Örnekler
   - Ton, Dil, Format
4. **"Prompt Oluştur (Canlı)"** → Anlık backend üretimi
5. **Analiz** sekmesinde skoru gör
6. **Canlı Test** sekmesinde AI yanıtını simüle et / gerçek API ile test et
7. **Kopyala** ve doğrudan AI'da kullan

### Canlı API Testi (Opsiyonel)
Ayarlar → API anahtarlarını gir:
- OpenAI: `sk-...`
- Gemini: `AIza...`
- Qwen/DashScope: `sk-...`
- Zhipu: `...`

Anahtar varsa gerçek API çağrısı yapılır, yoksa akıllı simülasyon.

## 📁 Proje Yapısı

```
prompt-engineering-system/
├── server.js              # Canlı Express backend - ana sistem
├── package.json
├── data/
│   └── history.json       # Kalıcı geçmiş
├── public/
│   ├── index.html         # Modern UI (Inter + JetBrains Mono)
│   ├── style.css          # Dark theme, responsive
│   └── app.js             # Frontend logic, canlı API entegrasyonu
└── edge-prompt-engineer/
    ├── manifest.json      # v2.0 - MV3, storage + host permissions
    ├── index.html         # Edge side panel UI
    ├── script.js          # Backend entegrasyonlu (localhost:3000 fallback)
    └── icons/
```

## 🔌 API Endpoints (Canlı)

- `GET /api/platforms` - Platform listesi
- `GET /api/techniques` - Teknik listesi
- `POST /api/generate` - Prompt oluştur (ana endpoint)
- `POST /api/analyze` - Prompt analiz et
- `POST /api/optimize` - Prompt optimize et (platforma göre)
- `GET /api/history` - Geçmişi getir
- `DELETE /api/history` - Geçmişi sil
- `POST /api/test-live` - Canlı AI testi (simülasyon veya gerçek)

### Örnek İstek
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "chatgpt",
    "technique": "cot",
    "role": "Kıdemli Yazılım Mühendisi",
    "task": "FastAPI ile rate limiting implement et",
    "context": "E-ticaret API, Redis var",
    "format": "Kod + açıklama",
    "tone": "expert",
    "language": "tr"
  }'
```

## 🎨 Hazır Şablonlar
- 🛒 E-Ticaret Ürün Açıklaması
- 💻 Kod Review ve Refactor
- 📊 Pazar Araştırması (ReAct)
- ✨ Yaratıcı Hikaye (Tree of Thoughts)
- 📝 SEO Blog Yazısı (Few-Shot)
- 🚀 İş Planı Oluşturucu (Meta)
- 🤖 Müşteri Destek Botu (Refiner)

## 🛠️ Teknoloji

- **Backend**: Node.js + Express 4, ES Modules, File-based storage
- **Frontend**: Vanilla JS (module), modern CSS, Inter + JetBrains Mono, FontAwesome
- **Edge**: Manifest V3, Side Panel API, Storage API, localhost entegrasyonu
- **Canlı**: 0.0.0.0 binding, CORS, preview uyumlu

## 📝 Lisans
MIT

## 🤝 Katkı
PR'lar açık! Yeni platform/teknik eklemek için `server.js` → `PLATFORMS` / `TECHNIQUES` objelerini genişletin.

---
**Canlı Sistem** - `npm start` ile hemen çalışır, simülasyon değil!
