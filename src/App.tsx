import React, { useState, useEffect, useRef } from 'react';
import { X, Pencil, Save } from 'lucide-react';
import { DEFAULT_PRODUCTS, DEFAULT_DAILY_OFFER } from './data';
import { Product, CartItem, CustomerInfo, ViewType, FormMode, DailyOffer, FooterInfo, Order } from './types';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, deleteDoc, collection, writeBatch, getDoc, addDoc, getDocs } from 'firebase/firestore';
import Header from './components/Header';
import Catalog from './components/Catalog';
import Cart from './components/Cart';
import Dashboard from './components/Dashboard';
import ProductForm from './components/ProductForm';
import AdminGate from './components/AdminGate';
import Favorites from './components/Favorites';

export default function App() {
  // 1. Core State with LocalStorage Persistence
const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [isProductsReady, setIsProductsReady] = useState(false);
  const productsLoaded = useRef(false);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('sacolao_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          return parsed.map((item: CartItem) => ({
            ...item,
            quantity: Math.round(item.quantity) || 1
          }));
        }
      } catch (e) {
        console.error('Erro ao restaurar carrinho:', e);
      }
    }
    return [];
  });

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('sacolao_favorite_ids');
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Erro ao restaurar favoritos:', e);
      }
    }
    return [];
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    const savedInfo = localStorage.getItem('sacolao_customer_info');
    if (savedInfo) {
      try {
        return JSON.parse(savedInfo);
      } catch (e) {
        console.error('Erro ao restaurar dados do cliente:', e);
      }
    }
    return { name: '', address: '', neighborhood: '', paymentMethod: 'PIX', cashChange: '' };
  });

  const [dailyOffers, setDailyOffers] = useState<DailyOffer[]>([
    {
      id: '1',
      badge: 'Oferta do Dia',
      title: 'Frescor Direto da Horta na sua Mesa',
      description: 'Aproveite até 30% OFF em itens selecionados hoje mesmo.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2TteofSMBjMB6hWFlPuT7ehrMQkljYM65cqPUJIsr91DvVPNDelcJpOpfAtQb58vsAZw2mZAvWKLGTEo_K-jTBXrY-iYJAWK6Bdfy2-V3cK6Tb7GGk66GCkqrbk60_WTM9FOxFLR3mTCYqJuYDC9iJmnBcY9xf1MO7xX9bnKtK05Cm8aevshqp7uf-3rc12cvvoO0zaDxdb0obnSB_RualhWmipmsI1GrV8JyvubQf4opYom5lsLYrjdWFs2RFWUZPV1a3gVPZko'
    },
    {
      id: '2',
      badge: 'Entrega Rápida',
      title: 'Frutas e Verduras Selecionadas',
      description: 'Qualidade garantida e entrega rápida no mesmo dia na sua casa.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR6jyxE_2OIOtdbUiqVpPX4Q2GE_gVoipZdJsoP1AOqUqHWgwTVudtbvfSvfCvF3Y4D1Thx6k7EVoM1rpTin8M3XL6dRcMdv1XuS-j0-1kVrX6yHp4etW_XgqH8ZTePRFiNh7IZSH-FyulUbpU3x7G-n9bGMXTKl9E8Z3aXqKX0OeZT226Hx1N5I3yeFS4aqdMKKFPdHPpf2FGvxtvJ-yA95cz_XLcINC3GZcibFpHcpgBf_RWzhhWbVC70yO8711XBSE-qqOw-uA'
    },
    {
      id: '3',
      badge: 'Orgânicos',
      title: 'Estilo de Vida Mais Saudável',
      description: 'Conheça nossa linha completa de produtos 100% orgânicos e certificados.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYyUpXxFCoTM1Vhoy3eDJnC9upba3Jfo0bB0E0b1YRVyVV1Vbcu2k2Nwi6W_vfAUZ3BuvZ-pmDL23jOOpcSlctIvcuRod3a7TvANYoZcjGX4Negv6T92HDtaaglzZk_uexHJEYmkY-rrUIllzHa-aTmwfLB-rW0ZXtrUoU64LUHoQWZYi24hWm443oqBDPyQEMojbEGHplKAr5pvbnY7p2gGT028_Pw1va3wDYNPacWGsYxoZZRJWNRjgcGLAY5uFrseJQuwPeXlA'
    }
  ]);
  const dailyOffersLoaded = useRef(false);
  const skipNextDailyOffersWrite = useRef(false);

  const DEFAULT_CATEGORIES = [
    { name: 'Frutas', icon: '', order: 0 },
    { name: 'Verduras', icon: '', order: 1 },
    { name: 'Legumes', icon: '', order: 2 },
    { name: 'Grãos', icon: '', order: 3 }
  ];
  const [categories, setCategories] = useState<{ name: string; icon: string; order: number }[]>(DEFAULT_CATEGORIES);
  const categoriesLoaded = useRef(false);

  // Stable, safe document id derived from the category name (lowercase, no accents/spaces)
  const categorySlug = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;

  const defaultFooterInfo: FooterInfo = {
    aboutText: 'Selecionamos hortifrúti diariamente direto com produtores rurais. Higiene estrita, frescor imbatível e compromisso com o bem-estar da sua família na mesa.',
    badgeText: 'Produção Sustentável',
    weekdayHours: '6:00 às 19:00',
    sundayHours: '7:00 às 10:00',
    holidayNote: '*Pedidos feitos em feriados estão sujeitos à alteração de fila de entrega.',
    address: 'Rua Euclides Barroso, N° 1453 - Santa Luzia, Canindé-CE',
    email: 'sacolaocaninde@gmail.com',
    cnpj: '24.318.866/0001-03',
    copyrightText: '© 2026 Sacolão Pimp. Todos os direitos reservados. Qualidade de colheita e respeito ao cliente.'
  };
  const [footerInfo, setFooterInfo] = useState<FooterInfo>(defaultFooterInfo);
  const [isEditingFooter, setIsEditingFooter] = useState(false);
  const [footerDraft, setFooterDraft] = useState<FooterInfo>(defaultFooterInfo);
  const footerLoaded = useRef(false);
  const skipNextFooterWrite = useRef(false);

  const [orders, setOrders] = useState<Order[]>([]);

  const handleAddCategory = (name: string, icon: string) => {
    const normalizedName = name.trim();
    if (!normalizedName) return;
    if (categories.some((cat) => cat.name.toLowerCase() === normalizedName.toLowerCase())) return;
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.order ?? 0), 0);
    setDoc(doc(db, 'categories', categorySlug(normalizedName)), {
      name: normalizedName,
      icon: icon.trim() || '',
      order: maxOrder + 1
    });
  };

  const handleDeleteCategory = (name: string) => {
    deleteDoc(doc(db, 'categories', categorySlug(name)));
  };

  const handleEditCategory = (oldName: string, newName: string) => {
    const trimmedNew = newName.trim();
    if (!trimmedNew || trimmedNew === oldName) return;
    if (categories.some((cat) => cat.name.toLowerCase() === trimmedNew.toLowerCase() && cat.name !== oldName)) {
      alert('Já existe uma categoria com esse nome.');
      return;
    }

    const oldCat = categories.find((cat) => cat.name === oldName);
    const batch = writeBatch(db);
    // Category doc id is based on the name, so renaming means: create the new doc, delete the old one
    batch.set(doc(db, 'categories', categorySlug(trimmedNew)), { name: trimmedNew, icon: oldCat?.icon || '', order: oldCat?.order ?? 0 });
    batch.delete(doc(db, 'categories', categorySlug(oldName)));
    batch.commit();

    // Update every product that used the old category name so nothing gets orphaned
    const affectedProducts = products.filter((p) => p.category === oldName);
    if (affectedProducts.length > 0) {
      const productBatch = writeBatch(db);
      affectedProducts.forEach((p) => {
        productBatch.update(doc(db, 'products', p.id), { category: trimmedNew });
      });
      productBatch.commit();
    }
  };

  // 2. Navigation & Interface States
  const [currentView, setCurrentView] = useState<ViewType>('catalog');
  const [activeFooterModal, setActiveFooterModal] = useState<'terms' | 'privacy' | null>(null);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('sacolao_is_admin') === 'true';
  });

  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return localStorage.getItem('sacolao_is_offline') === 'true';
  });

  const handleToggleOffline = (val: boolean) => {
    setIsOffline(val);
    localStorage.setItem('sacolao_is_offline', String(val));
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('sacolao_is_admin');
    handleNavigate('catalog');
  };
  const [selectedEditingProduct, setSelectedEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Acesso direto ao painel admin via link secreto (#admin)
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setCurrentView('dashboard');
    }
  }, []);

// 3. Sync produtos, categorias e ofertas com o Firebase (visível para todo mundo)
  useEffect(() => {
  const unsub = onSnapshot(collection(db, 'products'), async (snap) => {
      setProducts(snap.docs.map((d) => d.data() as Product));
      productsLoaded.current = true;
      setIsProductsReady(true);

      if (snap.empty) {
        const migrationFlag = await getDoc(doc(db, 'sacolao', 'migrated'));
        if (!migrationFlag.exists()) {
          const oldDoc = await getDoc(doc(db, 'sacolao', 'products'));
          const sourceList: Product[] =
            oldDoc.exists() && Array.isArray(oldDoc.data().list)
              ? oldDoc.data().list
              : DEFAULT_PRODUCTS;
          const batch = writeBatch(db);
          sourceList.forEach((p) => {
            batch.set(doc(db, 'products', p.id), p);
          });
          batch.set(doc(db, 'sacolao', 'migrated'), { done: true });
          await batch.commit();
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), async (snap) => {
      if (snap.empty) {
        const migrationFlag = await getDoc(doc(db, 'sacolao', 'categories_migrated'));
        if (!migrationFlag.exists()) {
          const oldDoc = await getDoc(doc(db, 'sacolao', 'categories'));
          const sourceList: { name: string; icon: string }[] =
            oldDoc.exists() && Array.isArray(oldDoc.data().list)
              ? oldDoc.data().list
              : DEFAULT_CATEGORIES;
          const batch = writeBatch(db);
          sourceList.forEach((cat, index) => {
            batch.set(doc(db, 'categories', categorySlug(cat.name)), { ...cat, order: index });
          });
          batch.set(doc(db, 'sacolao', 'categories_migrated'), { done: true });
          await batch.commit();
        }
      } else {
        const fetched = snap.docs.map((d) => d.data() as { name: string; icon: string; order?: number });

        // One-time backfill: earlier migrated categories may be missing the "order" field.
        // Recover the original creation order from the old list, if it still exists.
        if (fetched.some((c) => c.order === undefined)) {
          const backfillFlag = await getDoc(doc(db, 'sacolao', 'categories_order_backfilled'));
          if (!backfillFlag.exists()) {
            const oldDoc = await getDoc(doc(db, 'sacolao', 'categories'));
            const oldOrderNames: string[] =
              oldDoc.exists() && Array.isArray(oldDoc.data().list)
                ? oldDoc.data().list.map((c: { name: string }) => c.name)
                : fetched.map((c) => c.name);
            const batch = writeBatch(db);
            fetched.forEach((cat) => {
              const idx = oldOrderNames.indexOf(cat.name);
              const resolvedOrder = idx > -1 ? idx : oldOrderNames.length + 1;
              batch.update(doc(db, 'categories', categorySlug(cat.name)), { order: resolvedOrder });
            });
            batch.set(doc(db, 'sacolao', 'categories_order_backfilled'), { done: true });
            await batch.commit();
          }
        }

        setCategories(
          fetched
            .map((c) => ({ name: c.name, icon: c.icon, order: c.order ?? 999 }))
            .sort((a, b) => a.order - b.order)
        );
      }
      categoriesLoaded.current = true;
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'sacolao', 'footer'), (snap) => {
      if (snap.exists()) {
        skipNextFooterWrite.current = true;
        setFooterInfo(snap.data() as FooterInfo);
      } else {
        setDoc(doc(db, 'sacolao', 'footer'), defaultFooterInfo);
      }
      footerLoaded.current = true;
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!footerLoaded.current) return;
    if (skipNextFooterWrite.current) {
      skipNextFooterWrite.current = false;
      return;
    }
    setDoc(doc(db, 'sacolao', 'footer'), footerInfo);
  }, [footerInfo]);

  // Orders: synced live from Firestore so every completed checkout shows up for the admin, from any device
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'orders'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
      list.sort((a, b) => a.timestamp - b.timestamp);
      setOrders(list);
    });
    return () => unsub();
  }, []);

  const handleOrderPlaced = (order: { totalValue: number; itemsCount: number; customerName: string }) => {
    addDoc(collection(db, 'orders'), {
      timestamp: Date.now(),
      totalValue: order.totalValue,
      itemsCount: order.itemsCount,
      customerName: order.customerName
    });
  };

  const handleResetOrders = async () => {
    const snap = await getDocs(collection(db, 'orders'));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'sacolao', 'dailyOffers'), (snap) => {
      if (snap.exists()) {
        skipNextDailyOffersWrite.current = true;
        setDailyOffers(snap.data().list);
      } else {
        setDoc(doc(db, 'sacolao', 'dailyOffers'), { list: dailyOffers });
      }
      dailyOffersLoaded.current = true;
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!dailyOffersLoaded.current) return;
    if (skipNextDailyOffersWrite.current) {
      skipNextDailyOffersWrite.current = false;
      return;
    }
    setDoc(doc(db, 'sacolao', 'dailyOffers'), { list: dailyOffers });
  }, [dailyOffers]);

  useEffect(() => {
    localStorage.setItem('sacolao_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sacolao_favorite_ids', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    localStorage.setItem('sacolao_customer_info', JSON.stringify(customerInfo));
  }, [customerInfo]);

  // 4. Cart Logic Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.product.saleType === product.saleType && item.product.variantLabel === product.variantLabel
      );
      const isKg = product.saleType === 'KG';
      const addedQuantity = isKg ? parseFloat(quantity.toFixed(2)) : (Math.round(quantity) || 1);
      
      if (existingIndex > -1) {
        const nextQty = prevCart[existingIndex].quantity + addedQuantity;
        const updatedQty = isKg ? parseFloat(nextQty.toFixed(2)) : Math.round(nextQty);
        return prevCart.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: updatedQty }
            : item
        );
      }
      return [...prevCart, { product, quantity: addedQuantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number, saleType?: 'UNI' | 'KG' | 'INTEIRO' | 'BANDA' | 'QUARTO', variantLabel?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === productId && (!saleType || item.product.saleType === saleType) && item.product.variantLabel === variantLabel
      );
      if (existingIndex === -1) return prevCart;

      const targetItem = prevCart[existingIndex];
      const isKg = targetItem.product.saleType === 'KG';
      const actualDelta = isKg && (delta === 1 || delta === -1) ? (delta > 0 ? 0.5 : -0.5) : delta;
      
      const nextQuantity = isKg
        ? parseFloat((targetItem.quantity + actualDelta).toFixed(2))
        : Math.round(targetItem.quantity + delta);

      if (nextQuantity <= 0) {
        const formatSaleTypeLabel = (st: string) => {
          if (st === 'UNI') return 'Unidade';
          if (st === 'KG') return 'Quilo';
          if (st === 'INTEIRO') return 'Inteiro';
          if (st === 'BANDA') return 'Banda';
          if (st === 'QUARTO') return '1/4';
          return st;
        };
        const confirmRemove = window.confirm(
          `Deseja realmente remover "${targetItem.product.name}" (${formatSaleTypeLabel(targetItem.product.saleType)}) do seu carrinho de compras?`
        );
        if (confirmRemove) {
          return prevCart.filter(
            (item) => !(item.product.id === productId && (!saleType || item.product.saleType === saleType))
          );
        }
        return prevCart;
      }

      return prevCart.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: nextQuantity }
          : item
      );
    });
  };

  const handleRemoveItem = (productId: string, saleType?: 'UNI' | 'KG' | 'INTEIRO' | 'BANDA' | 'QUARTO', variantLabel?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && (!saleType || item.product.saleType === saleType) && item.product.variantLabel === variantLabel)
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // 5. Product Catalog & Inventory Handlers
  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  // Products with the per-browser favorite state merged in, for customer-facing views
  const productsWithFavorites = products.map((p) => ({
    ...p,
    isFavorite: favoriteIds.includes(p.id)
  }));

  const handleSaveProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    if (productData.id) {
      // Edit flow
      const updatedProduct = productData as Product;
      setDoc(doc(db, 'products', updatedProduct.id), updatedProduct);
    } else {
      // Create flow - Determine next incremental ID
      const lastIdNumber = products
        .map((p) => {
          const num = parseInt(p.id.replace('HT-', ''), 10);
          return isNaN(num) ? 0 : num;
        })
        .reduce((max, num) => Math.max(max, num), 0);

      const nextId = `HT-${String(lastIdNumber + 1).padStart(3, '0')}`;
      const maxOrder = products.reduce((max, p) => Math.max(max, p.displayOrder ?? 0), 0);
      const newProduct: Product = {
        ...(productData as Product),
        id: nextId,
        displayOrder: maxOrder + 1
      };
      setDoc(doc(db, 'products', newProduct.id), newProduct);
    }

    // Reset Form contexts
    setSelectedEditingProduct(null);
  };

  const handleReorderProduct = (productId: string, direction: 'up' | 'down', orderedIds: string[]) => {
    const currentIndex = orderedIds.indexOf(productId);
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex === -1 || swapIndex < 0 || swapIndex >= orderedIds.length) return;

    // Swap positions in the list, then renumber everyone sequentially.
    // This is more robust than swapping raw displayOrder values, since older
    // products may all start with the same (or no) displayOrder.
    const newOrder = [...orderedIds];
    [newOrder[currentIndex], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[currentIndex]];

    const batch = writeBatch(db);
    newOrder.forEach((id, index) => {
      batch.update(doc(db, 'products', id), { displayOrder: index });
    });
    batch.commit();
  };

  const handleDeleteProduct = (id: string) => {
    // Delete product from inventory list
    deleteDoc(doc(db, 'products', id));
    // Also clear deleted item from current shopping bag if matches
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== id));
  };

  const handleToggleActive = (product: Product) => {
    const willBeActive = product.isActive === false; // toggling
    setDoc(doc(db, 'products', product.id), { ...product, isActive: willBeActive });
    // If deactivating (marking as out of stock), remove it from the current shopping bag too
    if (!willBeActive) {
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== product.id));
    }
  };

  const handleBulkUpdateImages = async (updates: { id: string; imageUrl: string }[]) => {
    // Firestore batches support up to 500 operations; chunk just in case the catalog grows a lot
    const chunkSize = 400;
    for (let i = 0; i < updates.length; i += chunkSize) {
      const chunk = updates.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      chunk.forEach(({ id, imageUrl }) => {
        batch.update(doc(db, 'products', id), { imageUrl });
      });
      await batch.commit();
    }
  };

  const handleAddProductTrigger = () => {
    setSelectedEditingProduct(null);
    setFormMode('create');
    setCurrentView('form');
  };

  const handleEditProductTrigger = (product: Product) => {
    setSelectedEditingProduct(product);
    setFormMode('edit');
    setCurrentView('form');
  };

  // 6. Navigation router
  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'catalog':
        return (
          <Catalog
            products={productsWithFavorites}
            searchTerm={searchTerm}
            cartItems={cart}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToCart={() => handleNavigate('cart')}
            dailyOffers={dailyOffers}
            categories={categories}
          />
        );
      case 'cart':
        return (
          <Cart
            cartItems={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveItem}
            customerInfo={customerInfo}
            onUpdateCustomerInfo={setCustomerInfo}
            onClearCart={handleClearCart}
            onNavigateToCatalog={() => handleNavigate('catalog')}
            onOrderPlaced={handleOrderPlaced}
          />
        );
      case 'dashboard':
        if (!isAdmin) {
          return (
            <AdminGate
              onSuccess={() => {
                setIsAdmin(true);
                sessionStorage.setItem('sacolao_is_admin', 'true');
              }}
              onCancel={() => handleNavigate('catalog')}
            />
          );
        }
        return (
          <Dashboard
            products={products}
            searchTerm={searchTerm}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            onAddProductTrigger={handleAddProductTrigger}
            onEditProduct={handleEditProductTrigger}
            onDeleteProduct={handleDeleteProduct}
            onToggleActive={handleToggleActive}
            onReorderProduct={handleReorderProduct}
            onBulkUpdateImages={handleBulkUpdateImages}
            onNavigateToCart={() => handleNavigate('cart')}
            dailyOffers={dailyOffers}
            onUpdateDailyOffers={setDailyOffers}
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onEditCategory={handleEditCategory}
            isOffline={isOffline}
            onToggleOffline={handleToggleOffline}
            orders={orders}
            onResetOrders={handleResetOrders}
          />
        );
      case 'form':
        if (!isAdmin) {
          return (
            <AdminGate
              onSuccess={() => {
                setIsAdmin(true);
                sessionStorage.setItem('sacolao_is_admin', 'true');
              }}
              onCancel={() => handleNavigate('catalog')}
            />
          );
        }
        return (
          <ProductForm
            mode={formMode}
            initialProduct={selectedEditingProduct}
            onSave={handleSaveProduct}
            onCancel={() => handleNavigate('dashboard')}
            categories={categories}
          />
        );
      case 'favorites':
        return (
          <Favorites
            products={productsWithFavorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onNavigateToCatalog={() => handleNavigate('catalog')}
          />
        );

      default:
        return null;
    }
  };
if (!isProductsReady) {
    return (
      <div className="min-h-screen bg-[#f7fbf2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#176c33]/20 border-t-[#176c33] rounded-full animate-spin"></div>
          <p className="text-sm text-[#707a6e] font-semibold">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  if (isOffline && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#f7fbf2] flex flex-col justify-between font-sans select-none antialiased">
        <header className="py-6 border-b border-[#bfc9bc]/20 bg-white shadow-xs">
          <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
            <span className="font-display-lg text-2xl font-bold text-[#176c33] tracking-tight hover:opacity-90 cursor-pointer" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Sacolão Pimp
            </span>
            <button
              onClick={() => handleNavigate('dashboard')}
              className="text-xs font-bold text-[#176c33] hover:underline flex items-center gap-1 cursor-pointer"
            >
              🔐 Área do Administrador
            </button>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-5">
          <div className="bg-white p-10 rounded-2xl border border-[#bfc9bc]/30 shadow-xl max-w-lg w-full text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto border border-amber-200 shadow-xs">
              <span className="text-4xl">🛠️</span>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Estamos em Manutenção!
              </h1>
              <p className="text-sm text-[#707a6e] leading-relaxed">
                Estamos fazendo algumas melhorias e atualizando nosso catálogo com as frutas, legumes e verduras mais frescos da região para melhor lhe atender.
              </p>
              <div className="bg-[#f7fbf2] p-4 rounded-xl border border-[#bfc9bc]/20 text-xs text-[#176c33] font-bold">
                Voltamos em instantes! Agradecemos a sua compreensão. 🥬🍅
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-col items-center gap-2 text-xs text-gray-400">
              <p className="font-semibold text-gray-500">Sacolão Pimp</p>
              <p>Higiene estrita, frescor imbatível e qualidade na sua mesa.</p>
            </div>
          </div>
        </main>

        <footer className="py-6 border-t border-[#bfc9bc]/10 bg-[#181d18] text-center text-xs text-gray-500">
          <p>© 2026 Sacolão Pimp. Todos os direitos reservados.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fbf2] flex flex-col font-sans select-none antialiased">
      {/* Dynamic Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        favoritesCount={favoriteIds.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isAdmin={isAdmin}
        onLogoutAdmin={handleLogoutAdmin}
      />

      {/* Main Container viewports */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-5 py-6">
        {renderActiveView()}
      </main>

      {/* Persistent footer */}
      <footer className="bg-[#181d18] text-gray-300 border-t border-[#bfc9bc]/10 pt-16 pb-8 relative">
        {isAdmin && !isEditingFooter && (
          <button
            type="button"
            onClick={() => {
              setFooterDraft(footerInfo);
              setIsEditingFooter(true);
            }}
            className="absolute top-4 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all cursor-pointer z-10"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar Rodapé
          </button>
        )}

        {isAdmin && isEditingFooter ? (
          <div className="max-w-7xl mx-auto px-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Texto Sobre a Loja</label>
                <textarea
                  value={footerDraft.aboutText}
                  onChange={(e) => setFooterDraft({ ...footerDraft, aboutText: e.target.value })}
                  rows={4}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-[#176c33] focus:outline-none"
                />
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Selo (ex: Produção Sustentável)</label>
                <input
                  type="text"
                  value={footerDraft.badgeText}
                  onChange={(e) => setFooterDraft({ ...footerDraft, badgeText: e.target.value })}
                  className="w-full h-10 px-3 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-[#176c33] focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Horário Segunda a Sábado</label>
                <input
                  type="text"
                  value={footerDraft.weekdayHours}
                  onChange={(e) => setFooterDraft({ ...footerDraft, weekdayHours: e.target.value })}
                  className="w-full h-10 px-3 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-[#176c33] focus:outline-none"
                />
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Horário Domingo</label>
                <input
                  type="text"
                  value={footerDraft.sundayHours}
                  onChange={(e) => setFooterDraft({ ...footerDraft, sundayHours: e.target.value })}
                  className="w-full h-10 px-3 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-[#176c33] focus:outline-none"
                />
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Nota sobre feriados</label>
                <input
                  type="text"
                  value={footerDraft.holidayNote}
                  onChange={(e) => setFooterDraft({ ...footerDraft, holidayNote: e.target.value })}
                  className="w-full h-10 px-3 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-[#176c33] focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase">Endereço</label>
                <input
                  type="text"
                  value={footerDraft.address}
                  onChange={(e) => setFooterDraft({ ...footerDraft, address: e.target.value })}
                  className="w-full h-10 px-3 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-[#176c33] focus:outline-none"
                />
                <label className="block text-[10px] font-bold text-gray-400 uppercase">E-mail</label>
                <input
                  type="text"
                  value={footerDraft.email}
                  onChange={(e) => setFooterDraft({ ...footerDraft, email: e.target.value })}
                  className="w-full h-10 px-3 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-[#176c33] focus:outline-none"
                />
                <label className="block text-[10px] font-bold text-gray-400 uppercase">CNPJ</label>
                <input
                  type="text"
                  value={footerDraft.cnpj}
                  onChange={(e) => setFooterDraft({ ...footerDraft, cnpj: e.target.value })}
                  className="w-full h-10 px-3 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-[#176c33] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase">Texto de Copyright (rodapé final)</label>
              <input
                type="text"
                value={footerDraft.copyrightText}
                onChange={(e) => setFooterDraft({ ...footerDraft, copyrightText: e.target.value })}
                className="w-full h-10 px-3 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:ring-2 focus:ring-[#176c33] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFooterInfo(footerDraft);
                  setIsEditingFooter(false);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#176c33] hover:bg-[#115326] text-white text-xs font-bold cursor-pointer transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                Salvar Rodapé
              </button>
              <button
                type="button"
                onClick={() => setIsEditingFooter(false)}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Column 1: About */}
            <div className="space-y-4">
              <p className="font-black text-white text-xl tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Sacolão Pimp
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {footerInfo.aboutText}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#176c33]/30 text-emerald-400 border border-[#176c33]/50">
                  {footerInfo.badgeText}
                </span>
              </div>
            </div>

            {/* Column 2: Schedule */}
            <div className="space-y-4">
              <p className="font-extrabold text-sm text-white uppercase tracking-wider" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Horários de Atendimento
              </p>
              <div className="space-y-2.5 text-xs text-gray-400">
                <div className="flex justify-between border-b border-gray-800 pb-1.5">
                  <span>Segunda á Sábado</span>
                  <span className="text-emerald-400 font-semibold">{footerInfo.weekdayHours}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5">
                  <span>Domingo</span>
                  <span className="text-amber-400 font-semibold">{footerInfo.sundayHours}</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">
                  {footerInfo.holidayNote}
                </p>
              </div>
            </div>

            {/* Column 3: Contact & Identity */}
            <div className="space-y-4">
              <p className="font-extrabold text-sm text-white uppercase tracking-wider" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Identificação & Suporte
              </p>
              <div className="space-y-2 text-xs text-gray-400">
                <p className="flex items-start gap-2">
                  <span>{footerInfo.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <a href={`mailto:${footerInfo.email}`} className="hover:underline text-[#6dbe7b] font-medium">{footerInfo.email}</a>
                </p>
                <div className="pt-2 border-t border-gray-800 mt-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider leading-none mb-1">CNPJ do Estabelecimento</span>
                  <span className="text-xs font-mono font-bold text-gray-300">{footerInfo.cnpj}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Bottom Bar copyright lines */}
        <div className="max-w-7xl mx-auto px-5 pt-8 mt-12 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>{footerInfo.copyrightText}</p>
          <div className="flex gap-4 text-[10px]">
            <button
              onClick={() => setActiveFooterModal('terms')}
              className="hover:text-white transition-all cursor-pointer bg-transparent border-none p-0 text-gray-500 hover:underline outline-none"
              title="Clique para ler os Termos de Serviço"
            >
              Termos de Serviço
            </button>
            <button
              onClick={() => setActiveFooterModal('privacy')}
              className="hover:text-white transition-all cursor-pointer bg-transparent border-none p-0 text-gray-500 hover:underline outline-none"
              title="Clique para ler a Política de Privacidade"
            >
              Privacidade Garantida
            </button>
          </div>
        </div>
      </footer>

      {/* Footer Modals */}
      {activeFooterModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setActiveFooterModal(null)}
          ></div>
          
          {/* Modal Container */}
          <div className="bg-white rounded-3xl border border-[#bfc9bc]/30 shadow-2xl max-w-lg w-full p-6 md:p-8 relative z-10 max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveFooterModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#707a6e] hover:text-[#181d18] transition-all cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            
            {activeFooterModal === 'terms' ? (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#176c33] uppercase tracking-widest block">Sacolão Pimp</span>
                  <h3 className="text-xl font-extrabold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    Termos de Serviço
                  </h3>
                </div>
                
                <div className="text-xs text-[#40493f] leading-relaxed space-y-4 pt-2">
                  <p>
                    Bem-vindo ao <strong>Sacolão Pimp</strong>. Ao navegar em nossa plataforma e realizar pedidos, você concorda de maneira livre com as seguintes diretrizes comerciais:
                  </p>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">1. Qualidade e Frescor</p>
                    <p>
                      Todos os nossos produtos (frutas, legumes e verduras) são selecionados e higienizados rigorosamente. Comprometemo-nos com o mais alto padrão de frescor da colheita à sua mesa.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">2. Formatos de Venda e Pesagem</p>
                    <p>
                      Os preços mostrados correspondem ao formato de venda escolhido (por Quilo, Unidade, Inteiro, Banda ou Quarto). Para produtos faturados em frações ou peso dinâmico, pequenas variações naturais podem ocorrer. O valor real exato será validado e enviado no fechamento pelo WhatsApp.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">3. Entregas e Prazos</p>
                    <p>
                      As entregas acontecem no município de Canindé-CE durante os horários comerciais estabelecidos. Pedidos feitos próximos ao encerramento do expediente ou em feriados podem ser reagendados para o turno seguinte mediante aviso prévio.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">4. Cancelamento de Pedidos</p>
                    <p>
                      Você poderá alterar ou solicitar o cancelamento total do seu carrinho diretamente com o nosso time de atendimento via WhatsApp a qualquer momento antes do despacho da mercadoria pela equipe de entrega.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#bfc9bc]/20 text-[10px] text-gray-400 text-center">
                  Última atualização: Julho de 2026. CNPJ 24.318.866/0001-03
                </div>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#176c33] uppercase tracking-widest block">Sacolão Pimp</span>
                  <h3 className="text-xl font-extrabold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    Privacidade Garantida
                  </h3>
                </div>
                
                <div className="text-xs text-[#40493f] leading-relaxed space-y-4 pt-2">
                  <p>
                    A sua privacidade é nossa prioridade absoluta. O <strong>Sacolão Pimp</strong> segue políticas estritas para garantir que seus dados de navegação e compra estejam sempre seguros:
                  </p>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">1. Minimização de Coleta</p>
                    <p>
                      Solicitamos exclusivamente os dados indispensáveis para a realização das entregas do seu hortifrúti: seu Nome, Bairro, Rua/Número e a Forma de Pagamento preferida. Não coletamos dados desnecessários ou sensíveis.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">2. Armazenamento Local Seguro</p>
                    <p>
                      Para sua conveniência e agilidade no fechamento de futuros pedidos, os seus dados de entrega ficam guardados de forma segura localmente no seu próprio navegador (usando <code>localStorage</code>). Suas informações nunca são enviadas ou armazenadas em servidores externos da nossa parte.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">3. Integração com WhatsApp</p>
                    <p>
                      O processo de fechamento do carrinho redireciona as informações estruturadas do pedido diretamente para o WhatsApp oficial do Sacolão Pimp, gerando um canal direto, seguro e privado de atendimento ponto a ponto.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-bold text-[#181d18]">4. Controle Total do Usuário</p>
                    <p>
                      Você possui controle integral sobre seus dados. Caso deseje limpar suas informações do nosso banco local temporário, basta limpar os dados do site ou histórico de cache do seu navegador ou atualizar os campos do carrinho de compras.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#bfc9bc]/20 text-[10px] text-gray-400 text-center">
                  Segurança em conformidade com as melhores práticas de privacidade.
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveFooterModal(null)}
                className="px-5 py-2.5 rounded-full bg-[#176c33] hover:bg-[#115326] text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-[#176c33]/10"
              >
                Entendi, Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
