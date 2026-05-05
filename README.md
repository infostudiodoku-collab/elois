# Elois Atelier

Editorial tarzda iç mimarlık / tasarım stüdyosu sitesi + içerik düzenlemek
için korunan admin paneli + iletişim formu (mesaj kaydı + opsiyonel mail).

## Mimari

- **Next.js 14** (App Router) — frontend + API
- **Supabase** — veritabanı (Postgres) ve görsel depolama (Storage)
- **Resend** (opsiyonel) — iletişim formundan gelen mesajlar için mail
- **Vercel** — production hosting (önerilen)

İçerik ve mesajlar Supabase'de saklanır. Kod değişikliği yapıp redeploy etsen
bile içeriklerin korunur.

## Özellikler

- Ana sayfa: hero, marquee, istatistikler, tanıtım, öne çıkan ürünler, süreç,
  geniş görsel, lookbook galeri, müşteri yorumları, stüdyo notları, CTA banner
- Stüdyo, Koleksiyonlar, Ticari, İletişim sayfaları
- Admin paneli (`/admin`) — sekmeli arayüzde tüm metinleri ve görselleri düzenler
- Mesajlar paneli (`/admin/messages`) — iletişim formundan gelen mesajlar
- Görsel yükleme — Supabase Storage'a kaydeder, public URL döndürür
- "Kayıt ol/Giriş yap" gibi kullanıcı butonları YOK

## Hızlı başlangıç

İlk kez kuruluyorsa **`DEPLOY.md`** dosyasına bak — Supabase + Vercel için
adım adım kılavuz var.

Yerelde çalıştırmak için:

```bash
# 1) Bağımlılıkları kur
npm install

# 2) Ortam değişkenlerini ayarla
cp .env.example .env.local        # Mac/Linux
copy .env.example .env.local      # Windows

# 3) .env.local dosyasını aç ve şunları doldur (DEPLOY.md'ye bak):
#    - ADMIN_PASSWORD
#    - ADMIN_SECRET
#    - SUPABASE_URL
#    - SUPABASE_SERVICE_ROLE_KEY

# 4) Supabase tarafında schema.sql'i çalıştır ve "uploads" bucket'ını oluştur
#    (DEPLOY.md Bölüm 1'e bak)

# 5) Geliştirme modunda çalıştır
npm run dev
```

Site: http://localhost:3000
Admin: http://localhost:3000/admin

## Klasör Yapısı

```
.
├── data/
│   └── content.json         # İlk yüklemede Supabase'e seed edilecek varsayılan içerik
├── supabase/
│   └── schema.sql           # Supabase'de bir kez çalıştırılacak SQL şeması
├── src/
│   ├── app/
│   │   ├── (site)/          # Ziyaretçilere görünen sayfalar
│   │   ├── admin/           # Admin paneli
│   │   └── api/             # API route'lar
│   ├── components/          # Header, Footer, ContactForm, MobileNav, Reveal
│   └── lib/
│       ├── auth.ts          # Cookie tabanlı admin auth
│       ├── data.ts          # Supabase'den içerik okuma/yazma
│       ├── messages.ts      # Supabase'den mesaj CRUD
│       └── supabase.ts      # Supabase istemcisi (lazy)
├── DEPLOY.md                # Adım adım deployment kılavuzu
└── .env.example             # Ortam değişkenleri şablonu
```

## Önemli güvenlik

- `.env.local` GitHub'a **asla** yüklenmez (`.gitignore`'da)
- Supabase `service_role` key gizli — kimseyle paylaşma
- `ADMIN_PASSWORD` her zaman güçlü ve özel olmalı
- `ADMIN_SECRET` uzun ve rastgele olmalı (en az 32 karakter)

## İçerik yönetimi

Tüm içerik Supabase'de `site_content` tablosunda tek bir JSON satırında
saklanır. Admin panelinden yapılan tüm değişiklikler bu satıra yazılır.

Görseller iki şekilde eklenebilir:
1. **URL** — herhangi bir görsel URL'si yapıştırın
2. **Yükleme** — "Görsel yükle" butonuyla bilgisayardan seçin (10 MB'a kadar,
   Supabase Storage'a yüklenir)

İlk yüklemede `data/content.json` Supabase'e seed olarak yazılır. Sonrasında
hep Supabase'den okunur.
