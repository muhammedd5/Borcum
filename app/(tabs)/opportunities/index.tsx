import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, ExternalLink, Calendar, TrendingDown, Filter, Target, TrendingUp as TrendingUpIcon, Repeat, Gift, Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { MOCK_CAMPAIGNS } from '@/services/mockData';
import { getBankInfo } from '@/constants/banks';
import { Stack, router } from 'expo-router';

export default function OpportunitiesScreen() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'goals' | 'budget' | 'auto-invest'>('campaigns');
  const [filter, setFilter] = useState<'all' | 'loan' | 'credit_card' | 'zero_interest'>('all');

  const filteredCampaigns = MOCK_CAMPAIGNS.filter(campaign => {
    if (filter === 'all') return true;
    return campaign.campaignType === filter;
  });

  const getCampaignTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      loan: 'Kredi',
      credit_card: 'Kredi Kartı',
      limit_increase: 'Limit Artırımı',
      zero_interest: '0 Faiz',
    };
    return labels[type] || type;
  };

  const getDaysRemaining = (validUntil: string) => {
    const end = new Date(validUntil);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleOpenCampaign = (url: string) => {
    Linking.openURL(url).catch(err => {
      console.error('URL açılamadı:', err);
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Fırsatlar',
          headerShown: false,
        }} 
      />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'campaigns' && styles.tabActive]}
              onPress={() => setActiveTab('campaigns')}
            >
              <Sparkles size={20} color={activeTab === 'campaigns' ? Colors.light.surface : Colors.light.text} />
              <Text style={[styles.tabText, activeTab === 'campaigns' && styles.tabTextActive]}>Kampanyalar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'goals' && styles.tabActive]}
              onPress={() => setActiveTab('goals')}
            >
              <Target size={20} color={activeTab === 'goals' ? Colors.light.surface : Colors.light.text} />
              <Text style={[styles.tabText, activeTab === 'goals' && styles.tabTextActive]}>Hedefler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'budget' && styles.tabActive]}
              onPress={() => setActiveTab('budget')}
            >
              <TrendingUpIcon size={20} color={activeTab === 'budget' ? Colors.light.surface : Colors.light.text} />
              <Text style={[styles.tabText, activeTab === 'budget' && styles.tabTextActive]}>Bütçe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'auto-invest' && styles.tabActive]}
              onPress={() => setActiveTab('auto-invest')}
            >
              <Repeat size={20} color={activeTab === 'auto-invest' ? Colors.light.surface : Colors.light.text} />
              <Text style={[styles.tabText, activeTab === 'auto-invest' && styles.tabTextActive]}>Oto Yatırım</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'campaigns' && (
            <>
              <View style={styles.header}>
                <View>
                  <Text style={styles.greeting}>Merhaba,</Text>
                  <Text style={styles.userName}>Kampanyalar</Text>
                </View>
                <View style={styles.headerBadge}>
                  <Gift size={16} color={Colors.light.primary} />
                  <Text style={styles.headerBadgeText}>{filteredCampaigns.length} Fırsat</Text>
                </View>
              </View>

          <View style={styles.filterContainer}>
            <View style={styles.filterHeader}>
              <Filter size={16} color={Colors.light.textSecondary} />
              <Text style={styles.filterLabel}>Filtrele</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                onPress={() => setFilter('all')}
              >
                <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                  Tümü
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'loan' && styles.filterButtonActive]}
                onPress={() => setFilter('loan')}
              >
                <Text style={[styles.filterText, filter === 'loan' && styles.filterTextActive]}>
                  Krediler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'credit_card' && styles.filterButtonActive]}
                onPress={() => setFilter('credit_card')}
              >
                <Text style={[styles.filterText, filter === 'credit_card' && styles.filterTextActive]}>
                  Kredi Kartı
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, filter === 'zero_interest' && styles.filterButtonActive]}
                onPress={() => setFilter('zero_interest')}
              >
                <Text style={[styles.filterText, filter === 'zero_interest' && styles.filterTextActive]}>
                  0 Faiz
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.section}>
            {filteredCampaigns.map((campaign) => {
              const bankInfo = getBankInfo(campaign.bankType);
              const daysRemaining = getDaysRemaining(campaign.validUntil);
              const isExpiringSoon = daysRemaining <= 7;

              return (
                <TouchableOpacity 
                  key={campaign.id} 
                  style={styles.campaignCard}
                  onPress={() => handleOpenCampaign(campaign.sourceUrl)}
                  activeOpacity={0.7}
                >
                  <View style={styles.campaignTopSection}>
                    <View style={styles.campaignHeader}>
                      <View style={styles.bankLogoContainer}>
                        <Image 
                          source={{ uri: bankInfo.logo }} 
                          style={styles.bankLogo}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={styles.campaignHeaderInfo}>
                        <Text style={styles.bankNameText}>{campaign.bankName}</Text>
                        <View style={styles.typeBadge}>
                          <Text style={styles.typeText}>{getCampaignTypeLabel(campaign.campaignType)}</Text>
                        </View>
                      </View>
                    </View>
                    {campaign.isVerified && (
                      <View style={styles.verifiedBadge}>
                        <Zap size={12} color={Colors.light.success} fill={Colors.light.success} />
                      </View>
                    )}
                  </View>

                  <Text style={styles.campaignTitle}>{campaign.title}</Text>
                  <Text style={styles.campaignDescription} numberOfLines={2}>
                    {campaign.description}
                  </Text>

                  {campaign.interestRate && (
                    <View style={styles.interestRow}>
                      <TrendingDown size={16} color={Colors.light.success} strokeWidth={2.5} />
                      <Text style={styles.interestText}>
                        %{campaign.interestRate} faiz oranı
                      </Text>
                    </View>
                  )}

                  <View style={styles.campaignFooter}>
                    <View style={styles.dateRow}>
                      <Calendar size={14} color={isExpiringSoon ? Colors.light.error : Colors.light.textSecondary} />
                      <Text style={[
                        styles.dateText,
                        isExpiringSoon && styles.dateTextUrgent
                      ]}>
                        {daysRemaining > 0 ? `${daysRemaining} gün kaldı` : 'Bugün sona eriyor'}
                      </Text>
                    </View>
                    <View style={styles.linkButton}>
                      <Text style={styles.linkText}>İncele</Text>
                      <ExternalLink size={14} color={Colors.light.primary} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

              <View style={styles.disclaimer}>
                <Text style={styles.disclaimerTitle}>⚠️ Önemli Bilgilendirme</Text>
                <Text style={styles.disclaimerText}>
                  Kampanya bilgileri bankaların resmi kaynaklarından alınmıştır. 
                  Güncel bilgi ve başvuru için lütfen ilgili bankanın web sitesini veya mobil uygulamasını ziyaret edin.
                </Text>
              </View>
            </>
          )}

          {activeTab === 'goals' && (
            <View style={styles.featureContainer}>
              <View style={styles.featureHeader}>
                <View style={styles.featureIconContainer}>
                  <Target size={32} color={Colors.light.primary} strokeWidth={2.5} />
                </View>
                <Text style={styles.featureTitle}>Finansal Hedefler</Text>
                <Text style={styles.featureDescription}>
                  Hedeflerinizi belirleyin ve takip edin. "1M TRY biriktir" gibi hedefler oluşturun.
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.featureButton}
                onPress={() => router.push('/opportunities/goals')}
              >
                <Text style={styles.featureButtonText}>Hedef Oluştur</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'budget' && (
            <View style={styles.featureContainer}>
              <View style={styles.featureHeader}>
                <View style={styles.featureIconContainer}>
                  <TrendingUpIcon size={32} color={Colors.light.primary} strokeWidth={2.5} />
                </View>
                <Text style={styles.featureTitle}>Bütçe Takibi</Text>
                <Text style={styles.featureDescription}>
                  Aylık gelir ve giderlerinizi takip edin. Bütçenizi kontrol altında tutun.
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.featureButton}
                onPress={() => router.push('/opportunities/budget')}
              >
                <Text style={styles.featureButtonText}>Bütçe Oluştur</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'auto-invest' && (
            <View style={styles.featureContainer}>
              <View style={styles.featureHeader}>
                <View style={styles.featureIconContainer}>
                  <Repeat size={32} color={Colors.light.primary} strokeWidth={2.5} />
                </View>
                <Text style={styles.featureTitle}>Otomatik Yatırım</Text>
                <Text style={styles.featureDescription}>
                  Düzenli alım planları oluşturun. Otomatik yatırım yaparak portföyünüzü büyütün.
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.featureButton}
                onPress={() => router.push('/opportunities/auto-invest')}
              >
                <Text style={styles.featureButtonText}>Plan Oluştur</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  tabsContainer: {
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingTop: 12,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  tabActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  tabTextActive: {
    color: Colors.light.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: `${Colors.light.primary}15`,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  greeting: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  userName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  filterTextActive: {
    color: Colors.light.surface,
  },
  section: {
    paddingHorizontal: 24,
  },
  campaignCard: {
    backgroundColor: Colors.light.surface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  campaignTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  campaignHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  bankNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  bankLogoContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankLogo: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: `${Colors.light.primary}10`,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  campaignDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  interestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  interestText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.success,
  },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  dateTextUrgent: {
    color: Colors.light.error,
    fontWeight: '700',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: `${Colors.light.primary}10`,
    borderRadius: 6,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  disclaimer: {
    marginHorizontal: 24,
    marginTop: 8,
    padding: 24,
    backgroundColor: 'rgba(255, 149, 0, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.2)',
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.warning,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  featureContainer: {
    marginHorizontal: 24,
    marginTop: 8,
    padding: 40,
    backgroundColor: Colors.light.surface,
    borderRadius: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow.color,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: Colors.light.shadow.opacity,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  featureHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: `${Colors.light.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  featureButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  featureButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.surface,
  },
});
