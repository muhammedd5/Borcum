import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function KVKKScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'KVKK',
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
            <Text style={styles.title}>Kişisel Verilerin Korunması Kanunu</Text>
            <Text style={styles.subtitle}>Aydınlatma Metni</Text>
            <Text style={styles.date}>Son Güncelleme: 08 Ekim 2025</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Veri Sorumlusu</Text>
            <Text style={styles.paragraph}>
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak Borcum Teknoloji A.Ş. ("Borcum" veya "Şirket") tarafından aşağıda açıklanan kapsamda işlenebilecektir.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Kişisel Verilerin İşlenme Amacı</Text>
            <Text style={styles.paragraph}>
              Toplanan kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
            </Text>
            <Text style={styles.bulletPoint}>• Uygulama hizmetlerinin sunulması ve geliştirilmesi</Text>
            <Text style={styles.bulletPoint}>• Kullanıcı hesabınızın oluşturulması ve yönetilmesi</Text>
            <Text style={styles.bulletPoint}>• Finansal analiz ve borç takibi hizmetlerinin sağlanması</Text>
            <Text style={styles.bulletPoint}>• Güvenlik ve dolandırıcılık önleme faaliyetleri</Text>
            <Text style={styles.bulletPoint}>• Yasal yükümlülüklerin yerine getirilmesi</Text>
            <Text style={styles.bulletPoint}>• Müşteri memnuniyeti ve destek hizmetlerinin sunulması</Text>
            <Text style={styles.bulletPoint}>• İstatistiksel analiz ve raporlama</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. İşlenen Kişisel Veriler</Text>
            <Text style={styles.paragraph}>
              Uygulamamız kapsamında işlenen kişisel veriler şunlardır:
            </Text>
            <Text style={styles.bulletPoint}>• Kimlik Bilgileri: Ad, soyad, T.C. kimlik numarası</Text>
            <Text style={styles.bulletPoint}>• İletişim Bilgileri: E-posta adresi, telefon numarası</Text>
            <Text style={styles.bulletPoint}>• Finansal Bilgiler: Banka hesap bilgileri, kredi kartı bilgileri, borç ve gelir bilgileri</Text>
            <Text style={styles.bulletPoint}>• İşlem Güvenliği Bilgileri: IP adresi, çerez kayıtları, cihaz bilgileri</Text>
            <Text style={styles.bulletPoint}>• Müşteri İşlem Bilgileri: Uygulama kullanım geçmişi, işlem kayıtları</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Kişisel Verilerin Toplanma Yöntemi</Text>
            <Text style={styles.paragraph}>
              Kişisel verileriniz, mobil uygulama üzerinden elektronik ortamda, otomatik veya otomatik olmayan yöntemlerle toplanmaktadır. Veriler, hesap oluşturma, uygulama kullanımı ve müşteri destek süreçleri sırasında elde edilmektedir.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Kişisel Verilerin Aktarılması</Text>
            <Text style={styles.paragraph}>
              Toplanan kişisel verileriniz, KVKK'nın 8. ve 9. maddelerinde belirtilen şartlar çerçevesinde:
            </Text>
            <Text style={styles.bulletPoint}>• İş ortaklarımıza (ödeme hizmet sağlayıcıları, banka ve finans kuruluşları)</Text>
            <Text style={styles.bulletPoint}>• Hukuki yükümlülüklerimizi yerine getirmek için yetkili kamu kurum ve kuruluşlarına</Text>
            <Text style={styles.bulletPoint}>• Hizmet sağlayıcılarımıza (bulut hizmet sağlayıcıları, veri analiz şirketleri)</Text>
            <Text style={styles.paragraph}>
              aktarılabilecektir. Yurt dışına veri aktarımı yapılması durumunda, KVKK'nın 9. maddesi hükümleri uyarınca gerekli önlemler alınmaktadır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Kişisel Veri Sahibinin Hakları</Text>
            <Text style={styles.paragraph}>
              KVKK'nın 11. maddesi uyarınca, kişisel veri sahipleri olarak aşağıdaki haklara sahipsiniz:
            </Text>
            <Text style={styles.bulletPoint}>• Kişisel verilerinizin işlenip işlenmediğini öğrenme</Text>
            <Text style={styles.bulletPoint}>• Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</Text>
            <Text style={styles.bulletPoint}>• Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</Text>
            <Text style={styles.bulletPoint}>• Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</Text>
            <Text style={styles.bulletPoint}>• Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</Text>
            <Text style={styles.bulletPoint}>• KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme</Text>
            <Text style={styles.bulletPoint}>• Kişisel verilerin otomatik sistemler ile analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</Text>
            <Text style={styles.bulletPoint}>• Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Başvuru Yöntemi</Text>
            <Text style={styles.paragraph}>
              Yukarıda belirtilen haklarınızı kullanmak için kimliğinizi tespit edici gerekli bilgiler ile KVKK'nın 11. maddesinde belirtilen haklardan kullanmayı talep ettiğiniz hakkınıza yönelik açıklamalarınızı içeren talebinizi;
            </Text>
            <Text style={styles.bulletPoint}>• Uygulama içi destek formu üzerinden</Text>
            <Text style={styles.bulletPoint}>• destek@borcum.com.tr e-posta adresine</Text>
            <Text style={styles.bulletPoint}>• Şirket adresimize elden veya noter aracılığıyla</Text>
            <Text style={styles.paragraph}>
              iletebilirsiniz. Başvurularınız, talebin niteliğine göre en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır. Ancak, işlemin ayrıca bir maliyeti gerektirmesi hâlinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret alınabilir.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Veri Güvenliği</Text>
            <Text style={styles.paragraph}>
              Borcum Teknoloji A.Ş. olarak, kişisel verilerinizin güvenliğini sağlamak için teknik ve idari tedbirler almaktayız. Verileriniz, yetkisiz erişime, kayba veya değişikliğe karşı korunmaktadır. Güvenlik önlemlerimiz arasında şifreleme, güvenli sunucular ve erişim kontrolleri bulunmaktadır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Çerezler (Cookies)</Text>
            <Text style={styles.paragraph}>
              Uygulamamız, kullanıcı deneyimini iyileştirmek ve hizmetlerimizi geliştirmek amacıyla çerezler kullanmaktadır. Çerezler, cihazınızda saklanan küçük metin dosyalarıdır. Çerez kullanımını cihaz ayarlarınızdan yönetebilirsiniz.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Değişiklikler</Text>
            <Text style={styles.paragraph}>
              Bu aydınlatma metni, yasal düzenlemelerdeki değişiklikler veya şirket politikalarındaki güncellemeler doğrultusunda değiştirilebilir. Değişiklikler, uygulama üzerinden duyurulacak ve yürürlük tarihinden itibaren geçerli olacaktır.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. İletişim</Text>
            <Text style={styles.paragraph}>
              KVKK kapsamındaki sorularınız için bizimle iletişime geçebilirsiniz:
            </Text>
            <Text style={styles.bulletPoint}>• E-posta: destek@borcum.com.tr</Text>
            <Text style={styles.bulletPoint}>• Telefon: +90 (XXX) XXX XX XX</Text>
            <Text style={styles.bulletPoint}>• Adres: Borcum Teknoloji A.Ş.</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca hazırlanmıştır.
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
  },
  footerText: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
