import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, X, DollarSign, TrendingUpIcon, Bitcoin, Gem, PiggyBank, Wallet, Search, ChevronDown, BellOff, Settings2, Newspaper, TrendingUp, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { formatCurrency, formatPercentage } from '@/utils/decimal';
import { calculatePortfolio } from '@/services/mockData';
import { Asset, AssetType } from '@/types';
import { Stack } from 'expo-router';
import { trpc } from '@/lib/trpc';

type AssetCategory = {
  id: AssetType | 'try';
  label: string;
  icon: React.ReactNode;
  color: string;
};

export default function PortfolioScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<{ symbol: string; name: string; price?: string; logo?: string } | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [showMarketSelect, setShowMarketSelect] = useState<boolean>(false);
  const [selectedMarket, setSelectedMarket] = useState<'turkey' | 'global'>('turkey');
  const [activeTab, setActiveTab] = useState<'overview' | 'performance'>('overview');

  const stocksQuery = trpc.market.searchStocks.useQuery(
    { query: searchQuery, market: selectedMarket },
    { enabled: selectedCategory?.id === 'stock' && searchQuery.length > 0 }
  );

  const cryptoQuery = trpc.market.searchCrypto.useQuery(
    { query: searchQuery },
    { enabled: selectedCategory?.id === 'crypto' && searchQuery.length > 0 }
  );

  const forexQuery = trpc.market.getForexRates.useQuery(
    undefined,
    { enabled: selectedCategory?.id === 'forex' }
  );

  const commodityQuery = trpc.market.getCommodityPrices.useQuery(
    undefined,
    { enabled: selectedCategory?.id === 'gold' }
  );

  const pricesQuery = trpc.market.getPrices.useQuery(
    {
      symbols: assets.map(a => a.symbol),
      assetType: assets.length > 0 ? assets[0].assetType : 'stock',
      market: selectedMarket,
    },
    {
      enabled: assets.length > 0,
      refetchInterval: 30000,
    }
  );

  useEffect(() => {
    if (pricesQuery.data && assets.length > 0) {
      console.log('[Portfolio] Fiyatlar güncelleniyor:', pricesQuery.data);
      setAssets(prev => prev.map(asset => {
        const priceData = pricesQuery.data.find(p => p.symbol === asset.symbol);
        if (priceData) {
          const currentPrice = parseFloat(priceData.price);
          const avgPrice = parseFloat(asset.averagePrice);
          const qty = parseFloat(asset.quantity);
          const totalValue = currentPrice * qty;
          const profitLoss = totalValue - (avgPrice * qty);
          const profitLossPercentage = ((currentPrice - avgPrice) / avgPrice) * 100;

          return {
            ...asset,
            currentPrice: currentPrice.toFixed(2),
            totalValue: totalValue.toFixed(2),
            profitLoss: profitLoss.toFixed(2),
            profitLossPercentage: profitLossPercentage.toFixed(2),
            lastUpdated: priceData.lastUpdated,
          };
        }
        return asset;
      }));
    }
  }, [pricesQuery.data]);

  const portfolio = useMemo(() => calculatePortfolio(assets), [assets]);
  const isProfit = parseFloat(portfolio.totalProfitLoss) >= 0;

  const assetCategories: AssetCategory[] = [
    { id: 'forex', label: 'Döviz', icon: <DollarSign size={32} color={Colors.light.surface} />, color: '#34C759' },
    { id: 'stock', label: 'Hisse Senedi', icon: <TrendingUpIcon size={32} color={Colors.light.surface} />, color: '#007AFF' },
    { id: 'crypto', label: 'Kripto', icon: <Bitcoin size={32} color={Colors.light.surface} />, color: '#FF9500' },
    { id: 'gold', label: 'Emtia', icon: <Gem size={32} color={Colors.light.surface} />, color: '#FFD700' },
    { id: 'fund', label: 'Yatırım Fonu', icon: <PiggyBank size={32} color={Colors.light.surface} />, color: '#5856D6' },
    { id: 'try', label: 'Türk Lirası', icon: <Wallet size={32} color={Colors.light.surface} />, color: '#FF3B30' },
  ];



  const onSelectCategory = (category: AssetCategory) => {
    console.log('[Portfolio] Kategori seçildi:', category.label);
    setSelectedCategory(category);
    if (category.id === 'stock') {
      setShowMarketSelect(true);
    } else if (category.id === 'forex' || category.id === 'gold' || category.id === 'fund' || category.id === 'try') {
      console.log('[Portfolio] Kategori için veri yükleniyor:', category.id);
    }
  };

  const onBackToCategories = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSelectedAsset(null);
    setQuantity('');
    setShowMarketSelect(false);
  };

  const onCloseModal = () => {
    setShowAddModal(false);
    setSelectedCategory(null);
    setSearchQuery('');
    setSelectedAsset(null);
    setQuantity('');
    setShowMarketSelect(false);
  };

  const onSelectAsset = (asset: { symbol: string; name: string; price?: string; logo?: string }) => {
    console.log('[Portfolio] Varlık seçildi:', asset);
    setSelectedAsset(asset);
    setSearchQuery('');
  };

  const onAdd = () => {
    try {
      if (!selectedCategory || !selectedAsset) return;
      const qty = parseFloat(quantity);
      if (Number.isNaN(qty) || qty <= 0) {
        console.log('[Portfolio] Geçersiz miktar');
        return;
      }
      const now = new Date().toISOString();
      const assetType = selectedCategory.id === 'try' ? 'forex' : selectedCategory.id;
      const price = selectedAsset.price || '0';
      const pr = parseFloat(price);
      const asset: Asset = {
        id: `asset_${Date.now()}`,
        name: selectedAsset.name,
        symbol: selectedAsset.symbol.toUpperCase(),
        assetType: assetType as AssetType,
        quantity: qty.toString(),
        averagePrice: pr.toFixed(2),
        currentPrice: pr.toFixed(2),
        totalValue: (qty * pr).toFixed(2),
        profitLoss: '0',
        profitLossPercentage: '0',
        lastUpdated: now,
        logo: selectedAsset.logo,
      };
      setAssets(prev => [asset, ...prev]);
      console.log('[Portfolio] Varlık eklendi, fiyatlar çekilecek', asset);
      onCloseModal();
    } catch (e) {
      console.error('[Portfolio] Ekleme hatası', e);
    }
  };

  const renderSearchResults = () => {
    if (selectedCategory?.id === 'stock') {
      if (stocksQuery.isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        );
      }
      return stocksQuery.data?.map((stock) => (
        <TouchableOpacity
          key={stock.symbol}
          style={styles.searchResultItem}
          onPress={() => onSelectAsset({ symbol: stock.symbol, name: stock.name, logo: stock.logo })}
        >
          <Image source={{ uri: stock.logo }} style={styles.assetLogo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.searchResultSymbol}>{stock.symbol}</Text>
            <Text style={styles.searchResultName}>{stock.name}</Text>
            <Text style={styles.searchResultExchange}>{stock.exchange}</Text>
          </View>
        </TouchableOpacity>
      ));
    }

    if (selectedCategory?.id === 'crypto') {
      if (cryptoQuery.isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        );
      }
      return cryptoQuery.data?.map((crypto) => (
        <TouchableOpacity
          key={crypto.symbol}
          style={styles.searchResultItem}
          onPress={() => onSelectAsset({ symbol: crypto.symbol, name: crypto.name, logo: crypto.logo })}
        >
          <Image source={{ uri: crypto.logo }} style={styles.assetLogo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.searchResultSymbol}>{crypto.symbol}</Text>
            <Text style={styles.searchResultName}>{crypto.name}</Text>
            <Text style={styles.searchResultExchange}>{crypto.network}</Text>
          </View>
        </TouchableOpacity>
      ));
    }

    if (selectedCategory?.id === 'forex') {
      if (forexQuery.isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        );
      }
      return forexQuery.data?.map((forex) => (
        <TouchableOpacity
          key={forex.symbol}
          style={styles.searchResultItem}
          onPress={() => onSelectAsset({ symbol: forex.symbol, name: forex.name, price: forex.buy, logo: forex.logo })}
        >
          <Image source={{ uri: forex.logo }} style={styles.assetLogo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.searchResultSymbol}>{forex.symbol}</Text>
            <Text style={styles.searchResultName}>{forex.name}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.searchResultPrice}>Alış: {forex.buy} ₺</Text>
            <Text style={styles.searchResultPrice}>Satış: {forex.sell} ₺</Text>
          </View>
        </TouchableOpacity>
      ));
    }

    if (selectedCategory?.id === 'gold') {
      if (commodityQuery.isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        );
      }
      return commodityQuery.data?.map((commodity) => (
        <TouchableOpacity
          key={commodity.symbol}
          style={styles.searchResultItem}
          onPress={() => onSelectAsset({ symbol: commodity.symbol, name: commodity.name, price: commodity.price, logo: commodity.logo })}
        >
          <Image source={{ uri: commodity.logo }} style={styles.assetLogo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.searchResultSymbol}>{commodity.symbol}</Text>
            <Text style={styles.searchResultName}>{commodity.name}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.searchResultPrice}>{commodity.price}</Text>
            <Text style={styles.searchResultExchange}>{commodity.unit}</Text>
          </View>
        </TouchableOpacity>
      ));
    }

    if (selectedCategory?.id === 'fund') {
      return (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Yatırım Fonları</Text>
          <Text style={styles.emptyText}>Yakında eklenecek</Text>
        </View>
      );
    }

    if (selectedCategory?.id === 'try') {
      return (
        <TouchableOpacity
          style={styles.searchResultItem}
          onPress={() => onSelectAsset({ symbol: 'TRY', name: 'Türk Lirası', price: '1', logo: 'https://flagcdn.com/w320/tr.png' })}
        >
          <Image source={{ uri: 'https://flagcdn.com/w320/tr.png' }} style={styles.assetLogo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.searchResultSymbol}>TRY</Text>
            <Text style={styles.searchResultName}>Türk Lirası</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Portföy', headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.portfolioSelector}>
            <Text style={styles.portfolioTitle}>Tüm Portföyler</Text>
            <ChevronDown size={20} color={Colors.light.text} />
          </TouchableOpacity>
          <View style={styles.topBarActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Settings2 size={20} color={Colors.light.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <BellOff size={20} color={Colors.light.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setShowAddModal(true)}>
              <Plus size={20} color={Colors.light.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Settings2 size={20} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>Genel Bakış</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'performance' && styles.tabActive]}
            onPress={() => setActiveTab('performance')}
          >
            <Text style={[styles.tabText, activeTab === 'performance' && styles.tabTextActive]}>Performans</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.totalValue}>{formatCurrency(portfolio.totalValue)}</Text>
              <TouchableOpacity>
                <Text style={styles.eyeIcon}>👁</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.changeRow}>
              <Text style={[styles.changeText, { color: isProfit ? '#FF3B30' : '#34C759' }]}>
                24sa: {isProfit ? '-' : '+'}{formatCurrency(portfolio.totalProfitLoss)}
              </Text>
              <View style={[styles.changeBadge, { backgroundColor: isProfit ? 'rgba(255, 59, 48, 0.1)' : 'rgba(52, 199, 89, 0.1)' }]}>
                <Text style={[styles.changeBadgeText, { color: isProfit ? '#FF3B30' : '#34C759' }]}>
                  {isProfit ? '▼' : '▲'}{formatPercentage(portfolio.totalProfitLossPercentage)}
                </Text>
              </View>
            </View>

            <Text style={styles.profitLossLabel}>
              Toplam Kâr ve Zarar: <Text style={[styles.profitLossValue, { color: isProfit ? '#FF3B30' : '#34C759' }]}>
                {isProfit ? '-' : '+'}{formatCurrency(portfolio.totalProfitLoss)}
              </Text>
              <Text style={[styles.profitLossPercent, { color: isProfit ? '#FF3B30' : '#34C759' }]}>
                {' '}{isProfit ? '▼' : '▲'}{formatPercentage(portfolio.totalProfitLossPercentage)}
              </Text>
            </Text>
          </View>

          {activeTab === 'overview' ? (
            <>
              <View style={styles.filterBar}>
                <TouchableOpacity style={styles.filterButton}>
                  <Text style={styles.filterButtonText}>USD / BTC</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                  <Text style={styles.filterButtonText}>⚖️ Toplam Stok</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                  <Text style={styles.filterButtonText}>✨ Özelleştir</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.assetsHeader}>
                <Text style={styles.assetsHeaderText}>Varlık</Text>
                <Text style={styles.assetsHeaderText}>Fiyat</Text>
                <Text style={styles.assetsHeaderText}>Değişim</Text>
                <Text style={styles.assetsHeaderText}>Toplam</Text>
              </View>

              {assets.length === 0 && (
                <View style={styles.emptyBox} testID="portfolioEmpty">
                  <Text style={styles.emptyTitle}>Henüz varlık yok</Text>
                  <Text style={styles.emptyText}>Portföyüne varlık ekleyerek toplam değeri gör.</Text>
                </View>
              )}
              
              {assets.map((asset) => {
                const change24h = parseFloat(asset.profitLossPercentage);
                
                return (
                  <TouchableOpacity key={asset.id} style={styles.assetRow}>
                    <View style={styles.assetLeft}>
                      {asset.logo && (
                        <Image source={{ uri: asset.logo }} style={styles.assetIcon} />
                      )}
                      <View>
                        <Text style={styles.assetSymbolText}>{asset.symbol}</Text>
                        <Text style={styles.assetQuantityText}>{asset.quantity} {asset.symbol}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.assetCenter}>
                      <Text style={styles.assetPriceText}>{formatCurrency(asset.currentPrice)}</Text>
                    </View>
                    
                    <View style={styles.assetChange}>
                      <Text style={[styles.assetChangeText, { color: change24h >= 0 ? '#34C759' : '#FF3B30' }]}>
                        {change24h >= 0 ? '▲' : '▼'}{formatPercentage(asset.profitLossPercentage)}
                      </Text>
                    </View>
                    
                    <View style={styles.assetRight}>
                      <Text style={styles.assetTotalText}>{formatCurrency(asset.totalValue)}</Text>
                      <Text style={styles.assetTotalSubtext}>{asset.quantity} {asset.symbol}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.assetMenu}>
                      <Text style={styles.assetMenuDots}>⋮</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity style={styles.addCoinButton} onPress={() => setShowAddModal(true)}>
                <Plus size={20} color={Colors.light.surface} />
                <Text style={styles.addCoinButtonText}>Varlık Ekle</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.performanceContainer}>
              <View style={styles.performanceStats}>
                <View style={styles.performanceStatCard}>
                  <View style={styles.performanceStatIcon}>
                    <TrendingUp size={20} color={Colors.light.success} />
                  </View>
                  <Text style={styles.performanceStatLabel}>Günlük Değişim</Text>
                  <Text style={[styles.performanceStatValue, { color: isProfit ? '#FF3B30' : '#34C759' }]}>
                    {isProfit ? '-' : '+'}{formatPercentage(portfolio.totalProfitLossPercentage)}
                  </Text>
                </View>
                <View style={styles.performanceStatCard}>
                  <View style={styles.performanceStatIcon}>
                    <DollarSign size={20} color={Colors.light.primary} />
                  </View>
                  <Text style={styles.performanceStatLabel}>Toplam Değer</Text>
                  <Text style={styles.performanceStatValue}>{formatCurrency(portfolio.totalValue)}</Text>
                </View>
              </View>

              <View style={styles.newsSection}>
                <View style={styles.newsSectionHeader}>
                  <Newspaper size={20} color={Colors.light.text} />
                  <Text style={styles.newsSectionTitle}>Piyasa Haberleri</Text>
                </View>
                
                <View style={styles.newsCard}>
                  <View style={styles.newsImagePlaceholder}>
                    <Newspaper size={32} color={Colors.light.textSecondary} />
                  </View>
                  <View style={styles.newsContent}>
                    <Text style={styles.newsTitle}>Kripto Piyasalarında Yükseliş Devam Ediyor</Text>
                    <Text style={styles.newsDescription}>Bitcoin 50.000$ seviyesini aşarken, altcoin&apos;lerde de güçlü hareketler gözlemleniyor...</Text>
                    <View style={styles.newsFooter}>
                      <Clock size={12} color={Colors.light.textSecondary} />
                      <Text style={styles.newsTime}>2 saat önce</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.newsCard}>
                  <View style={styles.newsImagePlaceholder}>
                    <TrendingUp size={32} color={Colors.light.textSecondary} />
                  </View>
                  <View style={styles.newsContent}>
                    <Text style={styles.newsTitle}>BIST 100 Endeksi Rekor Kırdı</Text>
                    <Text style={styles.newsDescription}>Borsa İstanbul&apos;da işlem gören hisseler güçlü alımlarla yükselişini sürdürüyor...</Text>
                    <View style={styles.newsFooter}>
                      <Clock size={12} color={Colors.light.textSecondary} />
                      <Text style={styles.newsTime}>4 saat önce</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.newsCard}>
                  <View style={styles.newsImagePlaceholder}>
                    <DollarSign size={32} color={Colors.light.textSecondary} />
                  </View>
                  <View style={styles.newsContent}>
                    <Text style={styles.newsTitle}>Dolar/TL Kurunda Düşüş Yaşanıyor</Text>
                    <Text style={styles.newsDescription}>Merkez Bankası&apos;nın açıklamaları sonrası döviz kurlarında gerileme görülüyor...</Text>
                    <View style={styles.newsFooter}>
                      <Clock size={12} color={Colors.light.textSecondary} />
                      <Text style={styles.newsTime}>6 saat önce</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.loadMoreButton}>
                  <Text style={styles.loadMoreText}>Daha Fazla Haber Yükle</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </ScrollView>

        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={onCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedCategory ? selectedCategory.label : 'Varlık Türü Seçin'}
              </Text>
              <TouchableOpacity onPress={onCloseModal} style={styles.closeButton}>
                <X size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {!selectedCategory ? (
                <View style={styles.categoriesGrid}>
                  {assetCategories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryCard}
                      onPress={() => onSelectCategory(category)}
                      testID={`category_${category.id}`}
                    >
                      <LinearGradient
                        colors={[category.color, category.color]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.categoryGradient}
                      >
                        {category.icon}
                        <Text style={styles.categoryLabel}>{category.label}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : showMarketSelect ? (
                <View style={styles.addForm}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={onBackToCategories}
                  >
                    <Text style={styles.backButtonText}>← Geri</Text>
                  </TouchableOpacity>

                  <Text style={styles.formLabel}>Piyasa Seçin</Text>
                  <View style={styles.marketButtons}>
                    <TouchableOpacity
                      style={[
                        styles.marketButton,
                        selectedMarket === 'turkey' && styles.marketButtonActive,
                      ]}
                      onPress={() => {
                        setSelectedMarket('turkey');
                        setShowMarketSelect(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.marketButtonText,
                          selectedMarket === 'turkey' && styles.marketButtonTextActive,
                        ]}
                      >
                        Türkiye Borsası (BIST)
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.marketButton,
                        selectedMarket === 'global' && styles.marketButtonActive,
                      ]}
                      onPress={() => {
                        setSelectedMarket('global');
                        setShowMarketSelect(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.marketButtonText,
                          selectedMarket === 'global' && styles.marketButtonTextActive,
                        ]}
                      >
                        Global Borsalar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.addForm}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={onBackToCategories}
                  >
                    <Text style={styles.backButtonText}>← Geri</Text>
                  </TouchableOpacity>

                  {!selectedAsset ? (
                    <>
                      {(selectedCategory?.id === 'stock' || selectedCategory?.id === 'crypto') && (
                        <View style={styles.searchContainer}>
                          <Search size={20} color={Colors.light.textSecondary} style={styles.searchIcon} />
                          <TextInput
                            style={styles.searchInput}
                            placeholder="Ara..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                          />
                        </View>
                      )}

                      <ScrollView style={styles.searchResults} showsVerticalScrollIndicator={false}>
                        {renderSearchResults()}
                      </ScrollView>
                    </>
                  ) : (
                    <>
                      <View style={styles.selectedAssetCard}>
                        {selectedAsset.logo && (
                          <Image source={{ uri: selectedAsset.logo }} style={styles.selectedAssetLogo} />
                        )}
                        <Text style={styles.selectedAssetSymbol}>{selectedAsset.symbol}</Text>
                        <Text style={styles.selectedAssetName}>{selectedAsset.name}</Text>
                        {selectedAsset.price && (
                          <Text style={styles.selectedAssetPrice}>
                            Fiyat: {selectedAsset.price} ₺
                          </Text>
                        )}
                      </View>

                      <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>Miktar</Text>
                        <TextInput 
                          testID="assetQuantity" 
                          style={styles.formInput} 
                          placeholder="0.00" 
                          keyboardType="decimal-pad" 
                          value={quantity} 
                          onChangeText={setQuantity}
                          autoFocus
                        />
                      </View>

                      <TouchableOpacity 
                        testID="assetAddBtn" 
                        style={styles.submitButton} 
                        onPress={onAdd}
                      >
                        <Text style={styles.submitButtonText}>Varlık Ekle</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={styles.changeAssetButton}
                        onPress={() => setSelectedAsset(null)}
                      >
                        <Text style={styles.changeAssetButtonText}>Farklı Varlık Seç</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  portfolioSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  portfolioTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#34C759',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.text,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: Colors.light.surface,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.text,
  },
  eyeIcon: {
    fontSize: 20,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  changeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  profitLossLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  profitLossValue: {
    fontWeight: '700',
  },
  profitLossPercent: {
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
  },
  assetsHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.light.background,
  },
  assetsHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1.5,
  },
  assetIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.border,
  },
  assetSymbolText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  assetQuantityText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  assetCenter: {
    flex: 1,
    alignItems: 'center',
  },
  assetPriceText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  assetChange: {
    flex: 1,
    alignItems: 'center',
  },
  assetChangeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  assetRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  assetTotalText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  assetTotalSubtext: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  assetMenu: {
    marginLeft: 8,
    padding: 4,
  },
  assetMenuDots: {
    fontSize: 18,
    color: Colors.light.textSecondary,
  },
  addCoinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 16,
    backgroundColor: '#34C759',
    borderRadius: 12,
  },
  addCoinButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  balanceContainer: {
    marginHorizontal: 24,
    padding: 28,
    borderRadius: 28,
    marginBottom: 32,
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
  balanceLabel: {
    fontSize: 15,
    color: 'rgba(28, 28, 30, 0.7)',
    marginBottom: 8,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.light.text,
    marginBottom: 16,
    letterSpacing: -1.5,
  },
  profitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profitText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  emptyBox: {
    backgroundColor: Colors.light.surface,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  assetCard: {
    backgroundColor: Colors.light.surface,
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: Colors.light.shadow.opacity,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  assetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  assetSymbol: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  assetValues: {
    alignItems: 'flex-end',
  },
  assetValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  profitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profitBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  assetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  assetDetailItem: {
    flex: 1,
  },
  assetDetailLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  assetDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.accent,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.light.text,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  categoriesGrid: {
    padding: 20,
  },
  categoryCard: {
    width: '100%',
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  categoryGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.surface,
    textAlign: 'center',
  },
  addForm: {
    padding: 20,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  formInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.surface,
    fontSize: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  submitButton: {
    marginTop: 12,
    padding: 16,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.surface,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  searchResults: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchResultSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  searchResultName: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  searchResultExchange: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  searchResultPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  selectedAssetCard: {
    padding: 20,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 20,
    alignItems: 'center',
  },
  selectedAssetSymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  selectedAssetName: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  selectedAssetPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  changeAssetButton: {
    marginTop: 12,
    padding: 12,
    alignItems: 'center',
  },
  changeAssetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  marketButtons: {
    gap: 12,
    marginTop: 12,
  },
  marketButton: {
    padding: 16,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  marketButtonActive: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  marketButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  marketButtonTextActive: {
    color: Colors.light.primary,
  },
  assetLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.border,
  },
  assetCardLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.border,
  },
  selectedAssetLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.border,
    marginBottom: 12,
  },
  performanceContainer: {
    paddingHorizontal: 16,
  },
  performanceStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  performanceStatCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  performanceStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  performanceStatLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  performanceStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
  },
  newsSection: {
    marginBottom: 24,
  },
  newsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  newsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
  },
  newsImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  newsDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  newsTime: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  loadMoreButton: {
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
});
