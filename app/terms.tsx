import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function TermsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Kullanım Koşulları',
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.light.surface,
          },
          headerTintColor: Colors.light.text,
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Kullanım Koşulları</Text>
            <Text style={styles.subtitle}>Borcum Mobil Uygulaması</Text>
            <Text style={styles.date}>Son Güncelleme: 08 Ekim 2025</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Genel Hükümler</Text>
            <Text style={styles.paragraph}>
              İşbu Kullanım Koşulları, Borcum Teknoloji A.Ş. tarafından sunulan Borcum mobil uygulamasının kullanımına ilişkin şartları düzenlemektedir. Uygulamayı kullanarak, bu koşulları kabul etmiş sayılırsınız.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Tanımlar</Text>
            <Text style={styles.bulletPoint}>• Uygulama: Borcum mobil uygulaması ve tüm ilgili hizmetler</Text>
            <Text style={styles.bulletPoint}>• Kullanıcı: Uygulamayı kullanan gerçek veya tüzel kişiler</Text>
            <Text style={styles.bulletPoint}>• Şirket: Borcum Teknoloji A.Ş.</Text>
            <Text style={styles.bulletPoint}>• Hizmet: Uygulama üzerinden sunulan tüm finansal takip ve analiz hizmetleri</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Hizmetin Kapsamı</Text>
            <Text style={styles.paragraph}>
              Borcum uygulaması, kullanıcılarına aşağıdaki hizmetleri sunmaktadır:
            </Text>
            <Text style={styles.bulletPoint}>• Borç takibi ve yönetimi</Text>
            <Text style={styles.bulletPoint}>• Finansal analiz ve raporlama</Text>
            <Text style={styles.bulletPoint}>• Bütçe planlama ve takibi</Text>
            <Text style={styles.bulletPoint}>• Ödeme hatırlatmaları</Text>
            <Text style={styles.bulletPoint}>• Finansal fırsat önerileri</Text>
            <Text style={styles.paragraph}>
              Şirket, hizmetlerin kapsamını ve içeriğini önceden haber vermeksizin değiştirme hakkını saklı tutar.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Kullanıcı Hesabı ve Güvenlik</Text>
            <Text style={styles.paragraph}>
              Uygulamayı kullanabilmek için bir hesap oluşturmanız gerekmektedir. Kullanıcı olarak:
            </Text>
            <Text style={styles.bulletPoint}>• Hesap bilgilerinizin doğruluğundan sorumlusunuz</Text>
            <Text style={styles.bulletPoint}>• Şifrenizi gizli tutmakla yükümlüsünüz</Text>
            <Text style={styles.bulletPoint}>• Hesabınızda gerçekleşen tüm işlemlerden sorumlusunuz</Text>
            <Text style={styles.bulletPoint}>• Yetkisiz erişim durumunda derhal Şirketi bilgilendirmelisiniz</Text>
            <Text style={styles.bulletPoint}>• 18 yaşından büyük olduğunuzu beyan edersiniz</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Kullanıcı Yükümlülükleri</Text>
            <Text style={styles.paragraph}>
              Kullanıcılar, uygulamayı kullanırken:
            </Text>
            <Text style={styles.bulletPoint}>• Yürürlükteki tüm yasalara uygun hareket etmelidir</Text>
            <Text style={styles.bulletPoint}>• Doğru ve güncel bilgi sağlamalıdır</Text>
            <Text style={styles.bulletPoint}>• Uygulamayı kötüye kullanmamalıdır</Text>
            <Text style={styles.bulletPoint}>• Diğer kullanıcıların haklarına saygı göstermelidir</Text>
            <Text style={styles.bulletPoint}>• Uygulamanın güvenliğini tehlikeye atmamalıdır</Text>
            <Text style={styles.bulletPoint}>• Ticari amaçlarla izinsiz kullanım yapmamalıdır</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Fikri Mülkiyet Hakları</Text>
            <Text style={styles.paragraph}>
              Uygulama ve içeriği (tasarım, yazılım, logo, metin, grafik vb.) Şirketin veya lisans verenlerin mülkiyetindedir. Kullanıcılar:
            </Text>
            <Text style={styles.bulletPoint}>• İçeriği kopyalayamaz, çoğaltamaz veya dağıtamaz</Text>
            <Text style={styles.bulletPoint}>• Uygulamayı tersine mühendislik yapamaz</Text>
            <Text style={styles.bulletPoint}>• Ticari marka ve logoları izinsiz kullanamaz</Text>
            <Text style={styles.bulletPoint}>• Sadece kişisel kullanım için sınırlı lisansa sahiptir</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Finansal Bilgiler ve Sorumluluk</Text>
            <Text style={styles.paragraph}>
              Uygulama üzerinden sunulan finansal bilgiler, analiz ve öneriler yalnızca bilgilendirme amaçlıdır. Şirket:
            </Text>
            <Text style={styles.bulletPoint}>• Finansal danışmanlık hizmeti vermemektedir</Text>
            <Text style={styles.bulletPoint}>• Kullanıcıların finansal kararlarından sorumlu değildir</Text>
            <Text style={styles.bulletPoint}>• Bilgilerin doğruluğunu garanti etmez</Text>
            <Text style={styles.bulletPoint}>• Yatırım tavsiyesi vermemektedir</Text>
            <Text style={styles.paragraph}>
              Kullanıcılar, finansal kararlarını vermeden önce profesyonel danışmanlık almalıdır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Ücretlendirme</Text>
            <Text style={styles.paragraph}>
              Uygulama, ücretsiz ve ücretli hizmetler sunabilir. Ücretli hizmetler için:
            </Text>
            <Text style={styles.bulletPoint}>• Fiyatlar uygulama içinde belirtilir</Text>
            <Text style={styles.bulletPoint}>• Ödemeler güvenli ödeme sistemleri üzerinden yapılır</Text>
            <Text style={styles.bulletPoint}>• Abonelik iptali kullanıcı tarafından yapılabilir</Text>
            <Text style={styles.bulletPoint}>• İade politikası ilgili mağaza politikalarına tabidir</Text>
            <Text style={styles.bulletPoint}>• Fiyatlar önceden bildirilmeksizin değiştirilebilir</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Hizmetin Askıya Alınması ve Sonlandırılması</Text>
            <Text style={styles.paragraph}>
              Şirket, aşağıdaki durumlarda hizmeti askıya alabilir veya sonlandırabilir:
            </Text>
            <Text style={styles.bulletPoint}>• Kullanım koşullarının ihlali</Text>
            <Text style={styles.bulletPoint}>• Yasadışı faaliyetler</Text>
            <Text style={styles.bulletPoint}>• Teknik bakım ve güncellemeler</Text>
            <Text style={styles.bulletPoint}>• Güvenlik tehditleri</Text>
            <Text style={styles.paragraph}>
              Kullanıcılar, hesaplarını istedikleri zaman kapatabilirler.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Sorumluluk Sınırlaması</Text>
            <Text style={styles.paragraph}>
              Şirket, aşağıdaki durumlardan sorumlu tutulamaz:
            </Text>
            <Text style={styles.bulletPoint}>• Hizmet kesintileri veya hatalar</Text>
            <Text style={styles.bulletPoint}>• Veri kaybı veya güvenlik ihlalleri</Text>
            <Text style={styles.bulletPoint}>• Üçüncü taraf hizmetlerinden kaynaklanan sorunlar</Text>
            <Text style={styles.bulletPoint}>• Kullanıcıların finansal kararlarından doğan zararlar</Text>
            <Text style={styles.bulletPoint}>• Mücbir sebepler (doğal afetler, savaş, terör vb.)</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Gizlilik</Text>
            <Text style={styles.paragraph}>
              Kişisel verilerinizin işlenmesi, KVKK Aydınlatma Metni ve Gizlilik Politikamız kapsamında düzenlenmektedir. Uygulamamızı kullanarak, bu politikaları kabul etmiş sayılırsınız.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Değişiklikler</Text>
            <Text style={styles.paragraph}>
              Şirket, bu kullanım koşullarını dilediği zaman değiştirme hakkını saklı tutar. Değişiklikler, uygulama üzerinden duyurulacak ve yayınlandığı tarihten itibaren geçerli olacaktır. Değişikliklerden sonra uygulamayı kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>13. Uygulanacak Hukuk ve Uyuşmazlıklar</Text>
            <Text style={styles.paragraph}>
              Bu kullanım koşulları, Türkiye Cumhuriyeti yasalarına tabidir. Uygulamadan kaynaklanan uyuşmazlıkların çözümünde İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>14. İletişim</Text>
            <Text style={styles.paragraph}>
              Kullanım koşulları hakkında sorularınız için:
            </Text>
            <Text style={styles.bulletPoint}>• E-posta: destek@borcum.com.tr</Text>
            <Text style={styles.bulletPoint}>• Telefon: +90 (XXX) XXX XX XX</Text>
            <Text style={styles.bulletPoint}>• Adres: Borcum Teknoloji A.Ş.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>15. Çeşitli Hükümler</Text>
            <Text style={styles.bulletPoint}>• Bu koşulların herhangi bir hükmünün geçersiz sayılması, diğer hükümlerin geçerliliğini etkilemez</Text>
            <Text style={styles.bulletPoint}>• Şirketin herhangi bir hakkını kullanmaması, o haktan feragat ettiği anlamına gelmez</Text>
            <Text style={styles.bulletPoint}>• Bu koşullar, taraflar arasındaki tam anlaşmayı oluşturur</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Bu kullanım koşullarını kabul ederek, Borcum uygulamasını kullanmaya başlayabilirsiniz.
            </Text>
            <Text style={styles.footerText}>
              © 2025 Borcum Teknoloji A.Ş. Tüm hakları saklıdır.
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.light.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  date: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.light.text,
    marginBottom: 12,
    fontWeight: '400',
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.light.text,
    marginBottom: 8,
    paddingLeft: 8,
    fontWeight: '400',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.light.surfaceSecondary,
    marginTop: 20,
    gap: 12,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
