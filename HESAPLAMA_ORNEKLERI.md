# Borç Hesaplama Örnekleri

Bu uygulama, borç hesaplamalarında matematiksel olarak doğru formüller kullanır. Aşağıda gerçek örnekler ve açıklamalar bulabilirsiniz.

## 📱 Kredi Kartı Borcu

### Örnek 1: Standart Kredi Kartı Ödemesi

**Senaryo**: 
- Borç: 10,000 TL
- Aylık Faiz: %3
- Aylık Ödeme: 500 TL

**Sonuç**:
- Ödeme Süresi: 24 ay
- Toplam Faiz: ~4,200 TL
- Toplam Ödeme: ~14,200 TL

**Nasıl Çalışır**:
1. Her ay, kalan bakiye üzerinden faiz hesaplanır
2. Ödemeniz önce faizi karşılar, kalan kısım ana paradan düşer
3. Örnek: İlk ay
   - Başlangıç bakiyesi: 10,000 TL
   - Faiz: 10,000 × 3% = 300 TL
   - Ödeme: 500 TL
   - Ana paradan düşen: 500 - 300 = 200 TL
   - Yeni bakiye: 10,000 - 200 = 9,800 TL

### Örnek 2: Minimum Ödeme Tuzağı

**Senaryo**:
- Borç: 10,000 TL
- Aylık Faiz: %3
- Ödeme: Sadece minimum (faiz + %2 anapara)

**İlk Ay Minimum Ödeme**:
- Faiz: 10,000 × 3% = 300 TL
- Anapara: 10,000 × 2% = 200 TL
- **Toplam: 500 TL**

**Sonuç**:
- Ödeme Süresi: 30+ ay
- Toplam Faiz: ~5,000+ TL
- Toplam Ödeme: ~15,000+ TL

**⚠️ Uyarı**: Minimum ödeme yapmak borcunuzu neredeyse hiç azaltmaz!

### Örnek 3: Agresif Ödeme Stratejisi

**Senaryo**:
- Borç: 10,000 TL
- Aylık Faiz: %3
- Aylık Ödeme: 1,500 TL

**Sonuç**:
- Ödeme Süresi: 7 ay
- Toplam Faiz: ~1,050 TL
- Toplam Ödeme: ~11,050 TL

**💡 Tasarruf**: 500 TL yerine 1,500 TL ödeyerek 3,150 TL faiz tasarrufu!

---

## 🏦 Sabit Taksitli Kredi (Anuitet)

### Örnek: İhtiyaç Kredisi

**Senaryo**:
- Kredi Tutarı: 100,000 TL
- Yıllık Faiz: %24 (Aylık %2)
- Vade: 12 ay

**Sonuç**:
- Aylık Taksit: 9,456 TL (her ay aynı)
- Toplam Faiz: 13,472 TL
- Toplam Ödeme: 113,472 TL

**Formül**:
```
Aylık Taksit = Ana Para × [r × (1 + r)^n] / [(1 + r)^n - 1]

Burada:
  Ana Para = 100,000 TL
  r = 0.02 (aylık faiz oranı)
  n = 12 (ay sayısı)
```

**Ödeme Planı (İlk 3 Ay)**:

| Ay | Ödeme | Faiz | Anapara | Kalan Bakiye |
|----|-------|------|---------|--------------|
| 1  | 9,456 | 2,000 | 7,456 | 92,544 |
| 2  | 9,456 | 1,851 | 7,605 | 84,939 |
| 3  | 9,456 | 1,699 | 7,757 | 77,182 |

**Not**: Her ay aynı tutarı ödersiniz, ancak faiz kısmı azalır, anapara kısmı artar.

---

## 📉 Azalan Bakiye Kredisi

### Örnek: Konut Kredisi

**Senaryo**:
- Kredi Tutarı: 100,000 TL
- Yıllık Faiz: %24 (Aylık %2)
- Vade: 12 ay

**Sonuç**:
- İlk Taksit: 10,333 TL
- Son Taksit: 8,500 TL
- Toplam Faiz: 13,000 TL
- Toplam Ödeme: 113,000 TL

**Nasıl Çalışır**:
- Sabit anapara ödemesi: 100,000 / 12 = 8,333 TL
- Faiz her ay kalan bakiye üzerinden hesaplanır
- Toplam ödeme = Anapara + Faiz

**Ödeme Planı (İlk 3 Ay)**:

| Ay | Anapara | Faiz | Toplam Ödeme | Kalan Bakiye |
|----|---------|------|--------------|--------------|
| 1  | 8,333 | 2,000 | 10,333 | 91,667 |
| 2  | 8,333 | 1,833 | 10,166 | 83,334 |
| 3  | 8,333 | 1,667 | 10,000 | 75,001 |

**Avantaj**: Toplam faiz sabit taksitli krediden daha az!

---

## 💰 Karşılaştırma: Hangi Kredi Türü Daha Avantajlı?

### Aynı Koşullar:
- Tutar: 100,000 TL
- Faiz: %24 yıllık
- Vade: 12 ay

### Sonuçlar:

| Kredi Türü | İlk Taksit | Son Taksit | Toplam Faiz | Toplam Ödeme |
|------------|------------|------------|-------------|--------------|
| Sabit Taksit | 9,456 TL | 9,456 TL | 13,472 TL | 113,472 TL |
| Azalan Bakiye | 10,333 TL | 8,500 TL | 13,000 TL | 113,000 TL |

**Sonuç**: Azalan bakiye 472 TL daha az faiz!

**Ancak**:
- Sabit taksit: Bütçe planlaması kolay (her ay aynı)
- Azalan bakiye: İlk aylarda daha yüksek ödeme gerekir

---

## 🎯 Erken Ödeme Tasarrufu

### Örnek: Kredi Kartı Erken Ödemesi

**Başlangıç**:
- Borç: 10,000 TL
- Faiz: %3 aylık
- Normal ödeme: 500 TL/ay
- Süre: 24 ay
- Toplam faiz: 4,200 TL

**Senaryo**: 5,000 TL erken ödeme yapıyorsunuz

**Yeni Durum**:
- Kalan borç: 5,000 TL
- Ödeme: 500 TL/ay
- Yeni süre: 11 ay
- Yeni toplam faiz: 825 TL

**💰 Tasarruf**: 
- Faiz tasarrufu: 3,375 TL
- Zaman tasarrufu: 13 ay

---

## 📊 Gerçek Hayat Senaryoları

### Senaryo 1: Genç Profesyonel

**Durum**:
- Kredi kartı borcu: 15,000 TL (%3.5 aylık faiz)
- Aylık gelir: 20,000 TL
- Aylık gider: 12,000 TL
- Kalan: 8,000 TL

**Strateji 1 - Minimum Ödeme (625 TL)**:
- Süre: 35+ ay
- Toplam faiz: ~7,000 TL

**Strateji 2 - Agresif (5,000 TL)**:
- Süre: 3 ay
- Toplam faiz: ~800 TL
- **Tasarruf: 6,200 TL!**

### Senaryo 2: Aile

**Durum**:
- Konut kredisi: 500,000 TL (%1.5 aylık faiz)
- Vade: 120 ay (10 yıl)
- Taksit: ~7,200 TL

**Erken Ödeme Fırsatı**:
- 50,000 TL prim aldınız
- Seçenek 1: Yatırım (yıllık %15 getiri)
- Seçenek 2: Kredi erken ödemesi

**Analiz**:
- Kredi faizi: %1.5 aylık = %18 yıllık
- Yatırım getirisi: %15 yıllık
- **Karar**: Krediyi ödemek daha mantıklı! (%18 > %15)

---

## 🔍 Hesaplama Doğruluğu

### Neden Bu Hesaplamalar Önemli?

1. **Şeffaflık**: Tam olarak ne kadar faiz ödeyeceğinizi görürsünüz
2. **Planlama**: Farklı ödeme stratejilerini karşılaştırabilirsiniz
3. **Motivasyon**: Toplam faizi görmek daha hızlı ödemeye teşvik eder
4. **Doğruluk**: Hesaplamalar banka ekstrelerinizle eşleşir

### Matematiksel Doğruluk

Uygulama, floating-point hataları yapmamak için özel Decimal sınıfı kullanır:

```typescript
// ❌ Yanlış: JavaScript'in normal sayıları
0.1 + 0.2 = 0.30000000000000004

// ✅ Doğru: Decimal sınıfı
Decimal.fromString('0.1').add(Decimal.fromString('0.2'))
// Sonuç: "0.30"
```

### Test Edilmiş

Tüm hesaplamalar kapsamlı testlerle doğrulanmıştır:

```bash
bun test utils/__tests__/calculations.test.ts
```

Testler şunları kontrol eder:
- Matematiksel doğruluk
- Uç durumlar (sıfır faiz, tam ödeme, vb.)
- Amortisman tabloları
- Ondalık hassasiyet

---

## 💡 İpuçları

### 1. Kredi Kartı Borcu İçin
- ✅ Mümkün olduğunca fazla ödeyin
- ✅ Minimum ödemeden kaçının
- ✅ Yüksek faizli kartları önce kapatın
- ❌ Sadece minimum ödeme yapmayın

### 2. Kredi İçin
- ✅ Azalan bakiye genellikle daha avantajlı
- ✅ Erken ödeme fırsatlarını değerlendirin
- ✅ Faiz oranlarını karşılaştırın
- ❌ Gereksiz kredi çekmeyin

### 3. Genel
- ✅ Bütçe yapın ve takip edin
- ✅ Acil durum fonu oluşturun
- ✅ Yüksek faizli borçları önceliklendirin
- ❌ Yeni borç alarak eski borcu kapatmayın

---

## 📞 Destek

Hesaplamalarla ilgili sorularınız için:
- Uygulamadaki "Yardım" bölümünü ziyaret edin
- Banka müşteri hizmetlerinizle iletişime geçin
- Finansal danışman desteği alın

**Not**: Bu hesaplamalar bilgilendirme amaçlıdır. Gerçek ödeme tutarları bankanıza göre değişebilir.
