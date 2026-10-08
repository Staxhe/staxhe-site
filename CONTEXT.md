# Staxhe Site: Proje Bağlamı

Bu dosya, sitenin şu ana kadarki durumunu özetler. Yeni bir yapay zekâ oturumuna (Claude Code vb.) ya da kendine bağlam vermek için kullan. Claude Code'un otomatik okuması için adını `CLAUDE.md` yapabilirsin.

## Ne bu?

**staxhe.com**: Staxhe'nin (bağımsız uygulama geliştiricisi) kişisel sitesi. Portfolyo, şu an üzerinde çalışılanlar ve link merkezi bir arada. Tek sayfa, İngilizce.

- **Repo:** `github.com/Staxhe/staxhe-site`, branch `main`.
- **Yayın:** Cloudflare Workers statik varlıklar. `wrangler.jsonc` dosyası `public/` klasörünü staxhe.com ve www.staxhe.com'a sunar.
- **Deploy:** Repo Cloudflare'e bağlı değil, push otomatik yayınlamaz. Elle `npx wrangler deploy` çalıştırılır.
- **Eski sürüm:** Commit `e70b17f`'te duruyor. Yeni site commit `9cb2c95` ile geldi.
- **Önceki çalışma reposu:** `Staxhe/website` (branch `claude/vigilant-sagan-os171s`). Site orada yapıldı, sonra buraya taşındı. Artık kullanılmıyor.

## Dosyalar

```
public/                    yayınlanan her şey
  index.html               iskelet + <head> meta (title, description, OG, canonical)
  content.js               TÜM içerik: window.SITE objesi (sadece bunu düzenle)
  assets/styles.css        tasarım token'ları + layout
  assets/main.js           content.js'i sayfaya basar, tema düğmesi, menü
  assets/icons.js          SVG ikonlar (Simple Icons, CC0) + çizgi ikonlar
  assets/fonts/            Instrument Sans variable woff2 (Latin subset) + OFL.txt
  assets/favicon.svg       fontun "S" harfinden üretildi
wrangler.jsonc             Cloudflare config (DOKUNMA)
package.json               npm run dev (bağımlılık yok)
scripts/dev-server.js      public/'i localhost:3000'de sunar, dosya değişince yeniler
README.md                  ayrıntılı kullanım
```

## Komutlar

```sh
npm run dev              # http://localhost:3000, otomatik yenileme
npm run dev -- --host    # telefondan açmak için (aynı Wi-Fi)
npx wrangler deploy      # staxhe.com'a yayınla
```

## Kurallar ve kararlar

- **Teknoloji:** Sade HTML, CSS ve vanilla JS. Framework, build adımı, backend, form ve analitik yok.
- **İçerik tek yerde:** Her şey `public/content.js` içinde.
  - `placeholder: true` bölüm başlığının yanında kesik çizgili "placeholder" etiketi gösterir.
  - Proje butonunda `url: ""` ise buton tıklanamaz ve "Soon" etiketi taşır.
  - Proje durumları: `concept`, `development`, `release-prep`, `beta`, `live`, `paused`.
- **SEO:** Başlık ve meta etiketleri `index.html`'de sabit, çünkü tarayıcı botları JS çalıştırmaz. İsim veya slogan değişirse elle güncellenir.
- **Dürüstlük kuralları:**
  - Uygulamaları yayında gösterme: DopaGate yayın hazırlığında, Noting App geliştirmede.
  - Sahte ekran görüntüsü, istatistik, yorum veya uydurma sosyal hesap kullanma.
  - Proje görselleri yerine nötr placeholder bloklar var.
- **Tema:** Varsayılan koyu, açık tema düğmeyle seçilir ve `localStorage`'da (`staxhe-theme`) hatırlanır. Açık tema `:root[data-theme="light"]` altında.
- **Font:** Tek webfont Instrument Sans (wght 400–700, wdth 75–100). Logo yazısı `font-stretch: 80%`, başlıklar `88%`. Küçük etiketlerde sistemin monospace fontu kullanılıyor.
- **Vurgu rengi:** Bal sarısı. Her iki temada da sadece bu renk vurgu olarak kullanılır.
  - `--accent: #F2B544` dolgu rengi.
  - `--accent-ink`: koyuda `#F2B544`, açıkta `#8A5800`. Yazı ve ince çizgilerde kullanılır.
  - `--on-accent: #17130A`. Kontrastlar WCAG AA'yı geçiyor.
- **Hareket** (Apple tasarım prensiplerine göre):
  - Tek bir kritik sönümlü yay eğrisi var: `--spring`, CSS `linear()`.
  - Süreler: `--dur-press` 100ms, `--dur-ui` 0.44s, `--dur-enter` 0.58s.
  - Basınca küçülme: `--press` 0.97, `--press-lg` 0.985.
  - Menü bulanık ve yarı saydam. İçerik altına girince yumuşak bir kenar geçişi beliriyor.
  - Tema değişince renkler 0.3s'de geçiyor (`.theme-switching` sınıfı).
- **Erişilebilirlik:**
  - `prefers-reduced-motion`: sadece solma, küçülme yok.
  - `prefers-reduced-transparency`: düz menü.
  - `prefers-contrast: more`: düz menü, güçlü kenarlıklar.
  - Her zaman görünür odak halkası ve "Skip to content" linki var.
- **Responsive:** Mobil öncelikli. 375, 768 ve 1280 px'de test edildi, yatay kaydırma yok. 60rem üstünde başlıklar solda, içerik sağda iki kolon.

## Sayfa bölümleri

1. **Hero:** Büyük "Staxhe" yazısı, slogan, "See projects" ve "Links" butonları, altında durum satırı.
2. **About:** 3 paragraf placeholder metin.
3. **Projects:**
   - DopaGate: Android dil öğrenme uygulaması, `release-prep`. Google Play ve Learn more butonlarının linkleri boş.
   - Noting App: görevleri ve alışkanlıkları RPG ilerleme döngüsüne çeviriyor, `development`. Bu durum varsayım, doğrulanmadı.
4. **Now:** 3 placeholder madde, "Updated October 2026".
5. **Links:** YouTube, GitHub, X, Instagram ve Discord şimdilik platform ana sayfalarına giden placeholder linkler. Email gerçek: `staxhemc@gmail.com`.
6. **Footer:** © yıl Staxhe ve "Back to top".

## Açık işler

- [ ] Deploy'un canlıya çıktığını doğrula. Kullanıcı tarafında tarayıcı önbelleği eski siteyi gösteriyor olabilir: Ctrl+Shift+R veya gizli pencere dene.
- [ ] Gerçek sosyal linkleri `content.js`'e yaz, `placeholder: true` satırlarını sil. Not: GitHub profili muhtemelen `github.com/Staxhe`.
- [ ] About ve Now metinlerini gerçek içerikle değiştir, `placeholder: true`'ları kaldır.
- [ ] Noting App'in durumunu doğrula. Projelere gerçek teknoloji etiketlerini ekle (Kotlin, Flutter vb.).
- [ ] Proje görsellerini ekle: `image: "assets/img/x.webp"` ve `imageAlt`, 16:10 oran, yaklaşık 1200×750.
- [ ] DopaGate yayına çıkınca Google Play linkini ekle. Google'ın resmi "Get it on Google Play" rozetini kullanmayı düşün.
- [ ] İsteğe bağlı:
  - Eski sitede adın (Arda Açıkgöz) geçiyordu, yenisinde yok. İstersen geri eklenebilir.
  - Sosyal medya önizlemesi için bir OG görseli eklenebilir.
  - Push'ta otomatik deploy için Cloudflare Workers Builds'i repoya bağlayabilirsin.
