# Deploy — Adım Adım Kılavuz

Bu rehber, projeyi GitHub'a yükleyip Vercel'e deploy etmek ve admin paneli +
mesaj sisteminin Supabase üzerinden çalışmasını sağlamak için ihtiyacın olan
**her şeyi** sırayla anlatır. Sırasıyla takip et — atlama.

Tahmini süre: ilk seferinde **30-45 dakika**.

---

## Önkoşullar

- GitHub hesabı (ücretsiz) — https://github.com
- Vercel hesabı (ücretsiz) — https://vercel.com (GitHub ile gir)
- Supabase hesabı (ücretsiz) — https://supabase.com
- Git kurulu olmalı — https://git-scm.com (Mac'te zaten var)

---

## Bölüm 1 — Supabase'i hazırla (10 dk)

### 1.1 — Yeni proje oluştur

1. https://supabase.com/dashboard'a gir
2. **New project** butonuna bas
3. Bir organizasyon yoksa yeni biri oluştur (sadece bir kez)
4. Proje detayları:
   - **Name:** `elois-atelier` (ne istersen)
   - **Database password:** güçlü bir şifre seç ve **bir yere not et** (sonra lazım olabilir)
   - **Region:** sana en yakın yer (`Europe (Frankfurt)` Türkiye için iyi)
5. **Create new project** — 1-2 dakika kurulum bekle

### 1.2 — Veritabanı tablolarını oluştur

Proje açıldıktan sonra:

1. Sol menüden **SQL Editor** ikonuna tıkla
2. **New query** butonuna bas
3. Bilgisayarındaki proje klasöründen `supabase/schema.sql` dosyasını aç,
   **tüm içeriğini kopyala**
4. SQL editor'a yapıştır
5. Sağ alttaki **Run** butonuna bas (veya `Ctrl/Cmd + Enter`)
6. "Success. No rows returned" yazısını gör — tamamdır

### 1.3 — Storage bucket'ı oluştur (görseller için)

1. Sol menüden **Storage** ikonuna tıkla
2. **New bucket** butonuna bas
3. Ayarlar:
   - **Name:** `uploads` (tam olarak böyle, küçük harflerle)
   - **Public bucket:** **AÇIK** (toggle'ı aç — bu şart, yoksa görseller görünmez)
4. **Create bucket** butonuna bas

### 1.4 — API anahtarlarını al

1. Sol menüden **Project Settings** (dişli ikon)
2. Alt menüden **API**
3. Sayfada şu üç değeri göreceksin — bir yerde tut, hemen lazım olacak:
   - **Project URL** (`https://xxxxxxxx.supabase.co` şeklinde)
   - **service_role** key (⚠️ "anon" değil, **service_role**, gizli, uzun bir string)

> **service_role key gizli!** Asla GitHub'a yükleme, kimseyle paylaşma. Bu key
> ile veritabanına tam erişim sağlanır.

---

## Bölüm 2 — Yerelde test et (5 dk)

Vercel'e atmadan önce yerelde Supabase ile çalıştığını doğrulayalım.

### 2.1 — `.env.local` dosyasını oluştur

Proje klasöründe terminal aç:

```bash
cp .env.example .env.local        # Mac/Linux
copy .env.example .env.local      # Windows
```

`.env.local` dosyasını Notepad/VSCode ile aç ve şu satırları doldur:

```
ADMIN_PASSWORD=güçlü-bir-şifre-yaz-buraya
ADMIN_SECRET=uzun-rastgele-bir-string-yaz-en-az-32-karakter
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...buraya-yapıştır
```

`RESEND_API_KEY` ve mail değişkenlerini şimdilik boş bırakabilirsin.

### 2.2 — Çalıştır

```bash
npm install
npm run dev
```

Tarayıcıda http://localhost:3000 — site açılmalı (içerik ilk açılışta otomatik
olarak Supabase'e seed edilir).

http://localhost:3000/admin — şifrenle giriş yap, bir metni değiştir, **Kaydet**
bas. Supabase Dashboard → Table Editor → `site_content` tablosunda değişikliği
görmelisin. Tamamdır, yerelde çalışıyor.

---

## Bölüm 3 — GitHub'a yükle (5 dk)

### 3.1 — Yeni repo oluştur

1. https://github.com/new
2. **Repository name:** `elois-atelier` (ne istersen)
3. **Public** ya da **Private** — fark etmez (Private daha güvenli)
4. **Add README, .gitignore, license** kutularını **seçme** — boş repo lazım
5. **Create repository**

### 3.2 — Kodu pushla

Proje klasöründe terminal aç:

```bash
git init
git add .
git status
```

`git status` çıktısında **`.env.local` dosyası gözükmemeli**. Gözüküyorsa dur,
`.gitignore` dosyasını kontrol et. Gözükmüyorsa devam:

```bash
git commit -m "İlk yükleme"
git branch -M main
git remote add origin https://github.com/KULLANICI-ADIN/REPO-ADIN.git
git push -u origin main
```

GitHub kullanıcı adı + token isteyebilir (parola değil — token). Token için:
GitHub → Settings → Developer settings → Personal access tokens → Generate.

GitHub repo sayfanı yenile — dosyalar geldi mi kontrol et. `.env.local`
**olmamalı** repo'da.

---

## Bölüm 4 — Vercel'e deploy (5 dk)

### 4.1 — Projeyi Vercel'e import et

1. https://vercel.com/dashboard
2. **Add New** → **Project**
3. GitHub repo'larını listede gör → projeyi seç → **Import**
4. **Configure Project** ekranında çoğu şey otomatik:
   - Framework Preset: **Next.js** (otomatik algılar)
   - Root Directory: `./`
   - Build Command: `npm run build` (otomatik)

### 4.2 — Environment Variables'ı gir

**Deploy butonuna basmadan önce** Environment Variables sekmesini aç ve `.env.local`'deki
**tüm satırları teker teker ekle**:

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | senin şifren |
| `ADMIN_SECRET` | rastgele uzun string |
| `SUPABASE_URL` | https://xxx.supabase.co |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJhbGc... |
| `SUPABASE_UPLOADS_BUCKET` | `uploads` |

(Mail kullanacaksan ayrıca `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` da)

### 4.3 — Deploy

**Deploy** butonuna bas. 1-2 dakika bekle. Yeşil "Congratulations" görünce
hazırsın. Vercel sana `https://elois-atelier-xxx.vercel.app` gibi bir URL verir.

---

## Bölüm 5 — Doğrulama

Vercel'in verdiği URL'yi aç ve test et:

- [ ] Ana sayfa açılıyor mu, görseller geliyor mu?
- [ ] `/admin` sayfasında şifrenle giriş yapabiliyor musun?
- [ ] Admin panelinde bir metni değiştirip **Kaydet** dediğinde değişiyor mu?
- [ ] Admin panelinden yeni bir görsel yükleyebiliyor musun?
- [ ] `/contact` sayfasındaki formu kendine bir test mesajı gönder, sonra
      `/admin/messages`'da görüyor musun?
- [ ] (Resend ayarladıysan) E-posta hesabına mesaj geldi mi?

Hepsi tamamsa bitti, site canlı.

---

## Bölüm 6 — Domain bağlama (opsiyonel)

Kendi domain'in varsa:

1. Vercel projende **Settings → Domains**
2. Domain adını gir
3. Vercel sana DNS kayıtları gösterir (CNAME / A record)
4. Domain sağlayıcında (GoDaddy, Namecheap, isimtescil vb.) DNS ayarlarına gir
5. Vercel'in verdiği kayıtları ekle
6. 5 dakika - 24 saat içinde aktif olur

---

## Sorun giderme

**"Supabase ayarlanmamış" hatası alıyorum**
→ Vercel Environment Variables'da `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY`
girdin mi kontrol et. Girip değiştirdiysen Vercel projende **Deployments** →
en üstteki deployment → **Redeploy** ile tekrar yayınla.

**Görsel yüklediğimde "Bucket not found" hatası**
→ Supabase'de `uploads` bucket'ını oluşturdun mu? **Public** olarak işaretlemeyi
unuttuysan toggle'ı aç.

**Form gönderdim ama mesaj gelmedi**
→ Önce admin panelindeki "Mesajlar" sekmesini kontrol et — orada görünüyorsa
form çalışıyor demektir, sadece mail gitmemiştir. Mail için Resend API key
eklenmiş ve `CONTACT_TO_EMAIL` doğru girilmiş mi kontrol et.

**Admin'de "Kaydet" basıyorum ama değişiklik kalıcı olmuyor**
→ Service role key'i mi kullanıyorsun, yoksa yanlışlıkla anon key'i mi? Service
role değilse RLS yüzünden yazma engellenir. `.env.local`'i ve Vercel env'leri
tekrar kontrol et.

**`.env.local`'i yanlışlıkla GitHub'a yükledim, ne yapmalıyım**
→ HEMEN: 1) Supabase service_role key'i Project Settings → API → Reset.
2) `ADMIN_PASSWORD` ve `ADMIN_SECRET` değiştir. 3) Repo'yu git history dahil
temizle (BFG Repo-Cleaner aracı). Acil bir konu.

---

## İçeriği güncellemek

Site canlı olduktan sonra:

- **İçerik/görsel/metin değiştirmek** için → `https://senin-domain/admin`
- **Mesajları görmek** için → `https://senin-domain/admin/messages`
- **Kod değişikliği yapmak** için → yerelde değiştir → `git push` → Vercel
  otomatik yeniden deploy eder

İçerik değişiklikleri Supabase'de saklandığı için, kodu redeploy etsen bile
**içeriklerin korunur**. Sadece kod değişir, içerik aynı kalır.
