import React, { useState, useEffect } from 'react';
import { Camera, Save, X, Info, HelpCircle } from 'lucide-react';
import { Product, CategoryType, FormMode } from '../types';

interface ProductFormProps {
  mode: FormMode;
  initialProduct?: Product | null;
  onSave: (product: Omit<Product, 'id'> & { id?: string }) => void;
  onCancel: () => void;
  categories?: { name: string; icon: string }[];
}

export default function ProductForm({
  mode,
  initialProduct,
  onSave,
  onCancel,
  categories = []
}: ProductFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('Frutas');
  const [saleType, setSaleType] = useState<'KG' | 'UNI'>('UNI');
  const [allowedUnits, setAllowedUnits] = useState<'KG' | 'UNI' | 'BOTH'>('BOTH');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('100');

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fallback fresh-image URLs relative to category to make newly added products look amazing immediately!
  const categoryImages: Record<string, string> = {
    Frutas: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYyUpXxFCoTM1Vhoy3eDJnC9upba3Jfo0bB0E0b1YRVyVV1Vbcu2k2Nwi6W_vfAUZ3BuvZ-pmDL23jOOpcSlctIvcuRod3a7TvANYoZcjGX4Negv6T92HDtaaglzZk_uexHJEYmkY-rrUIllzHa-aTmwfLB-rW0ZXtrUoU64LUHoQWZYi24hWm443oqBDPyQEMojbEGHplKAr5pvbnY7p2gGT028_Pw1va3wDYNPacWGsYxoZZRJWNRjgcGLAY5uFrseJQuwPeXlA',
    Verduras: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR6jyxE_2OIOtdbUiqVpPX4Q2GE_gVoipZdJsoP1AOqUqHWgwTVudtbvfSvfCvF3Y4D1Thx6k7EVoM1rpTin8M3XL6dRcMdv1XuS-j0-1kVrX6yHp4etW_XgqH8ZTePRFiNh7IZSH-FyulUbpU3x7G-n9bGMXTKl9E8Z3aXqKX0OeZT226Hx1N5I3yeFS4aqdMKKFPdHPpf2FGvxtvJ-yA95cz_XLcINC3GZcibFpHcpgBf_RWzhhWbVC70yO8711XBSE-qqOw-uA',
    Legumes: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn_K3ACiznastm6xyrh5ewuVLJx0lqrTdoAcxEwPbVirjqHtemUdjHBB4U0rKe7Pxop8XXOOZBaQ1q8TfGoPoCiOsgeF3esql2HGu1vYg4cEFXYK_kpcxSYN1Gf3IGLB9qZ_b_AeqOe3Ey-mVCYE395AMhc-y1hSBCfXslRxl8FnwWyIobqYHukxffkhOrX8R53mmaJGr1iqOoWEGEX6Gi9uF1ZmtYKA8N49YNGcqJEwPgieIrQM-O1x1eW9TaT13KKAPc40sDs34',
    Grãos: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrdDkmHMTpc4opGw5CNXrjir_h4OkyumlhQImTHMPekgegBjkU7eLjlb0gQHNMR4zFIb76mJXL9hHJ-agiziKWz701UydipI90auHpZaJTgijMprP9gI6guxBiffMl1G9FcDobKMrWxDxYMaYjCdTmnI3xfYk2qJAubTEvBsGcApJFhse-YYDgBrydk-zKbPrBWJjndKvL4VTelHVO_-f7bP5z3wRA-G-UJ4PKXo7zTbnwOXA1lJUGhm4opJfKJ_PmZvK_Pfz_h_o',
    Tudo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYyUpXxFCoTM1Vhoy3eDJnC9upba3Jfo0bB0E0b1YRVyVV1Vbcu2k2Nwi6W_vfAUZ3BuvZ-pmDL23jOOpcSlctIvcuRod3a7TvANYoZcjGX4Negv6T92HDtaaglzZk_uexHJEYmkY-rrUIllzHa-aTmwfLB-rW0ZXtrUoU64LUHoQWZYi24hWm443oqBDPyQEMojbEGHplKAr5pvbnY7p2gGT028_Pw1va3wDYNPacWGsYxoZZRJWNRjgcGLAY5uFrseJQuwPeXlA',
  };

  // Populate data in case of edit mode
  useEffect(() => {
    if (mode === 'edit' && initialProduct) {
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setSaleType(initialProduct.saleType);
      setAllowedUnits(initialProduct.allowedUnits || 'BOTH');
      setPrice(initialProduct.price.toString());
      setPriceUnit(initialProduct.priceUnit ? initialProduct.priceUnit.toString() : '');
      setDescription(initialProduct.description || '');
      setImageUrl(initialProduct.imageUrl || '');
      setStock((initialProduct.stock || 100).toString());
    } else {
      // Clear for new additions
      setName('');
      setCategory('Frutas');
      setSaleType('UNI');
      setAllowedUnits('BOTH');
      setPrice('');
      setPriceUnit('');
      setDescription('');
      setImageUrl('');
      setStock('100');
    }
  }, [mode, initialProduct]);

const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setImageUrl(compressed);
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      alert('Não foi possível processar essa imagem. Tente outra foto.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Por favor, informe o nome do produto.');
      return;
    }

    let priceNum = 0;
    if (allowedUnits === 'BOTH' || allowedUnits === 'KG' || allowedUnits === 'FRAC') {
      priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        alert(allowedUnits === 'FRAC' ? 'Por favor, informe um Preço para o produto Inteiro válido e maior que R$ 0,00' : 'Por favor, informe um Preço por Quilo (KG) válido e maior que R$ 0,00');
        return;
      }
    }

    let priceUnitNum = 0;
    if (allowedUnits === 'BOTH' || allowedUnits === 'UNI') {
      priceUnitNum = parseFloat(priceUnit);
      if (isNaN(priceUnitNum) || priceUnitNum <= 0) {
        alert('Por favor, informe um Preço por Unidade (UNI) válido e maior que R$ 0,00');
        return;
      }
    }

    const finalImage = imageUrl || categoryImages[category] || categoryImages['Frutas'];

    // Build data and trigger save action
    onSave({
      id: initialProduct?.id, // kept for editing
      name: name.trim(),
      category,
      saleType: allowedUnits === 'FRAC' ? 'INTEIRO' : saleType,
      allowedUnits,
      price: allowedUnits === 'UNI' ? priceUnitNum : priceNum,
      priceUnit: (allowedUnits === 'KG' || allowedUnits === 'FRAC') ? undefined : priceUnitNum,
      description: description.trim(),
      imageUrl: finalImage,
      stock: parseInt(stock) || 120,
      isFavorite: initialProduct?.isFavorite ?? false
    });

    // Show success banner
    setShowSuccessModal(true);
  };

  const handleCancelSafetyCheck = () => {
    if (name.trim() || price) {
      const confirmLeave = window.confirm(
        'Deseja realmente cancelar? Suas alterações atuais não serão salvas no inventário.'
      );
      if (!confirmLeave) return;
    }
    onCancel();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-24">
      {/* Title block banner */}
      <div className="border-b border-[#bfc9bc]/20 pb-4">
        <h2 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          {mode === 'edit' ? 'Editar Cadastro de Produto' : 'Cadastrar Novo Produto'}
        </h2>
        <p className="text-sm text-[#707a6e]">
          {mode === 'edit' 
            ? 'Atualize as especificações, preços ou estoque do produto no catálogo.' 
            : 'Adicione novos itens ao seu catálogo de produtos frescos do sacolão.'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="productForm">
        
        {/* Left column info values (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          
          <section className="bg-white p-6 rounded-2xl border border-[#bfc9bc]/20 shadow-sm space-y-4">
            <h3 
              className="font-bold text-lg text-[#176c33] flex items-center gap-2 border-b border-[#ebefe7] pb-3"
              style={{ fontFamily: 'Plus Jakarta Sans' }}
            >
              Informações Básicas
            </h3>

            <div className="space-y-4">
              {/* Product name */}
              <div className="space-y-1.5">
                <label htmlFor="product_name" className="block text-xs font-bold text-[#40493f] px-1 uppercase">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  id="product_name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maçã Gala Premium"
                  className="w-full h-12 px-5 rounded-full bg-[#f1f5ed] border-none focus:ring-2 focus:ring-[#176c33] focus:bg-white text-sm transition-all focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category drop down */}
                <div className="space-y-1.5 md:col-span-2">
                  <label htmlFor="category" className="block text-xs font-bold text-[#40493f] px-1 uppercase">
                    Categoria
                  </label>
                  <select
                    id="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-12 px-5 rounded-full bg-[#f1f5ed] border-none focus:ring-2 focus:ring-[#176c33] focus:bg-white text-sm transition-all focus:outline-none cursor-pointer appearance-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Formatos de Venda Permitidos selector */}
                <div className="space-y-1.5 md:col-span-2">
                  <span className="block text-xs font-bold text-[#40493f] px-1 uppercase mb-1">
                    Formatos de Venda Permitidos
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setAllowedUnits('KG');
                        setSaleType('KG');
                      }}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        allowedUnits === 'KG'
                          ? 'bg-[#176c33]/10 border-[#176c33] text-[#176c33] font-bold ring-2 ring-[#176c33]/20 shadow-xs'
                          : 'bg-[#f7fbf2] border-[#bfc9bc]/30 hover:bg-[#ebefe7] text-[#40493f]'
                      }`}
                    >
                      <span className="text-xs font-bold text-gray-400 mb-1">KG</span>
                      <span className="text-xs font-bold block">Apenas por Quilo</span>
                      <span className="text-[10px] text-[#707a6e] mt-1 font-normal leading-tight">
                        O cliente só poderá comprar este produto pesando em Quilos (KG).
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAllowedUnits('UNI');
                        setSaleType('UNI');
                      }}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        allowedUnits === 'UNI'
                          ? 'bg-[#176c33]/10 border-[#176c33] text-[#176c33] font-bold ring-2 ring-[#176c33]/20 shadow-xs'
                          : 'bg-[#f7fbf2] border-[#bfc9bc]/30 hover:bg-[#ebefe7] text-[#40493f]'
                      }`}
                    >
                      <span className="text-xs font-bold text-gray-400 mb-1">UNI</span>
                      <span className="text-xs font-bold block">Apenas por Unidade</span>
                      <span className="text-[10px] text-[#707a6e] mt-1 font-normal leading-tight">
                        O cliente só poderá comprar este produto em quantidade unitária (UNI).
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAllowedUnits('BOTH');
                      }}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        allowedUnits === 'BOTH'
                          ? 'bg-[#176c33]/10 border-[#176c33] text-[#176c33] font-bold ring-2 ring-[#176c33]/20 shadow-xs'
                          : 'bg-[#f7fbf2] border-[#bfc9bc]/30 hover:bg-[#ebefe7] text-[#40493f]'
                      }`}
                    >
                      <span className="text-xs font-bold text-gray-400 mb-1">AMBOS</span>
                      <span className="text-xs font-bold block">Ambos (Quilo e Unidade)</span>
                      <span className="text-[10px] text-[#707a6e] mt-1 font-normal leading-tight">
                        O cliente escolhe livremente se quer comprar por Quilo ou por Unidades.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAllowedUnits('FRAC');
                        setSaleType('INTEIRO');
                      }}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        allowedUnits === 'FRAC'
                          ? 'bg-[#176c33]/10 border-[#176c33] text-[#176c33] font-bold ring-2 ring-[#176c33]/20 shadow-xs'
                          : 'bg-[#f7fbf2] border-[#bfc9bc]/30 hover:bg-[#ebefe7] text-[#40493f]'
                      }`}
                    >
                      <span className="text-xs font-bold text-gray-400 mb-1">FRAÇÕES</span>
                      <span className="text-xs font-bold block">Fração (Inteiro, Banda, 1/4)</span>
                      <span className="text-[10px] text-[#707a6e] mt-1 font-normal leading-tight">
                        O cliente escolhe se quer levar o produto Inteiro, Banda ou 1/4.
                      </span>
                    </button>
                  </div>
                </div>

                {/* Unidade de Precificação config */}
                <div className="space-y-1.5 md:col-span-2">
                  <span className="block text-xs font-bold text-[#40493f] px-1 uppercase">
                    Unidade de Precificação (Preço Base)
                  </span>
                  {allowedUnits !== 'BOTH' ? (
                    <div className="bg-[#f1f5ed] border border-[#bfc9bc]/15 px-4 h-12 rounded-full flex items-center justify-between text-xs text-[#40493f] font-semibold">
                      <span>Definido correspondente ao formato único selecionado</span>
                      <span className="bg-[#176c33] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        {allowedUnits === 'KG' ? 'Por Quilo (KG)' : allowedUnits === 'UNI' ? 'Por Unidade (UNI)' : 'Frações (Inteiro, Banda, 1/4)'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex bg-[#f1f5ed] p-1 rounded-full h-12 border border-[#bfc9bc]/15">
                      <button
                        type="button"
                        onClick={() => setSaleType('KG')}
                        className={`flex-1 rounded-full text-xs font-bold transition-all duration-300 ${
                          saleType === 'KG'
                            ? 'bg-[#176c33] text-white shadow-sm'
                            : 'text-[#40493f] hover:bg-[#ebefe7]'
                        }`}
                      >
                        Definir Preço Base por Quilo (KG)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSaleType('UNI')}
                        className={`flex-1 rounded-full text-xs font-bold transition-all duration-300 ${
                          saleType === 'UNI'
                            ? 'bg-[#176c33] text-white shadow-sm'
                            : 'text-[#40493f] hover:bg-[#ebefe7]'
                        }`}
                      >
                        Definir Preço Base por Unidade (UNI)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Price per KG - Show if BOTH or KG or FRAC */}
                {(allowedUnits === 'BOTH' || allowedUnits === 'KG' || allowedUnits === 'FRAC') && (
                  <div className="space-y-1.5 pb-1">
                    <label htmlFor="price" className="block text-xs font-bold text-[#40493f] px-1 uppercase">
                      {allowedUnits === 'FRAC' ? 'Preço do Produto Inteiro (R$)' : 'Preço por Quilo (R$/KG)'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#707a6e]">
                        R$
                      </span>
                      <input
                        type="number"
                        id="price"
                        required={allowedUnits === 'BOTH' || allowedUnits === 'KG' || allowedUnits === 'FRAC'}
                        step="0.01"
                        min="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0,00"
                        className="w-full h-12 pl-12 pr-5 rounded-full bg-[#f1f5ed] border-none focus:ring-2 focus:ring-[#176c33] focus:bg-white text-sm transition-all focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Price per Unit - Show if BOTH or UNI */}
                {(allowedUnits === 'BOTH' || allowedUnits === 'UNI') && (
                  <div className="space-y-1.5 pb-1">
                    <label htmlFor="priceUnit" className="block text-xs font-bold text-[#40493f] px-1 uppercase">
                      Preço por Unidade (R$/UNI)
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#707a6e]">
                        R$
                      </span>
                      <input
                        type="number"
                        id="priceUnit"
                        required={allowedUnits === 'BOTH' || allowedUnits === 'UNI'}
                        step="0.01"
                        min="0.01"
                        value={priceUnit}
                        onChange={(e) => setPriceUnit(e.target.value)}
                        placeholder="0,00"
                        className="w-full h-12 pl-12 pr-5 rounded-full bg-[#f1f5ed] border-none focus:ring-2 focus:ring-[#176c33] focus:bg-white text-sm transition-all focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Stock amount limit */}
                <div className={`space-y-1.5 pb-1 ${allowedUnits === 'BOTH' ? 'col-span-1 md:col-span-2 lg:col-span-1' : ''}`}>
                  <label htmlFor="stock" className="block text-xs font-bold text-[#40493f] px-1 uppercase">
                    Estoque Inicial Estimado
                  </label>
                  <input
                    type="number"
                    id="stock"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="120"
                    className="w-full h-12 px-5 rounded-full bg-[#f1f5ed] border-none focus:ring-2 focus:ring-[#176c33] focus:bg-white text-sm transition-all focus:outline-none animate-none"
                  />
                </div>
              </div>

              {/* Product description */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="block text-xs font-bold text-[#40493f] px-1 uppercase">
                  Descrição
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva as características do produto, dicas culinárias, origem sustentável ou benefícios nutricionais..."
                  className="w-full p-4 rounded-xl bg-[#f1f5ed] border-none focus:ring-2 focus:ring-[#176c33] focus:bg-white text-sm transition-all focus:outline-none resize-none"
                />
              </div>

            </div>
          </section>

          {/* Guidelines info warning boxes */}
          <div className="bg-[#c9ecc9]/20 border border-[#c9ecc9]/40 p-5 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-[#176c33] mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#176c33] uppercase tracking-wider">Regras de Quantidade</h4>
              <ul className="text-xs text-[#4d6c50] list-disc list-inside space-y-0.5 opacity-90">
                <li>Produtos vendidos por KG admitem somente incrementos fechados de 1 kg por vez no carrinho.</li>
                <li>Produtos vendidos por Unidade (UNI) admitem somente incrementos fechados de 1 unidade por vez.</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Right column upload image (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-[#bfc9bc]/20 shadow-sm space-y-4">
            <h3 
              className="font-bold text-lg text-[#176c33] flex items-center gap-2 border-b border-[#ebefe7] pb-3"
              style={{ fontFamily: 'Plus Jakarta Sans' }}
            >
              Foto do Produto
            </h3>

            <div 
              onClick={() => document.getElementById('imageUpload')?.click()}
              className="flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed border-[#bfc9bc] rounded-2xl bg-[#f1f5ed] hover:bg-[#ebefe7] transition-all cursor-pointer relative overflow-hidden group select-none"
            >
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              {imageUrl ? (
                <>
                  <img
                    alt="Previsão da Imagem"
                    src={imageUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-2.5 text-center text-white text-xs font-bold backdrop-blur-xs">
                    Clique para substituir imagem
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl('');
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#ba1a1a] hover:bg-red-800 text-white flex items-center justify-center shadow-lg hover:scale-110 z-20 transition-all cursor-pointer border border-[#ffdad6]/20"
                    title="Remover Imagem"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-center px-4 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#176c33]/10 flex items-center justify-center text-[#176c33] group-hover:scale-110 transition-transform duration-300">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-bold text-[#181d18] text-sm leading-tight">Escolha uma foto do produto</p>
                    <p className="text-xs text-[#707a6e] mt-1">Carregue arquivos PNG ou JPG até 5MB</p>
                  </div>
                </div>
              )}
            </div>

            {imageUrl && (
              <p className="text-[11px] text-center text-[#707a6e] italic leading-tight">
                Imagem carregada localmente para preview no catálogo.
              </p>
            )}
          </section>

          {/* Form page desktop save actions footer embedded */}
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full h-14 bg-[#176c33] hover:bg-[#115326] active:scale-[0.98] transition-all rounded-full text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 select-none cursor-pointer"
            >
              <Save className="w-5 h-5" />
              <span>Salvar Produto</span>
            </button>

            <button
              type="button"
              onClick={handleCancelSafetyCheck}
              className="w-full h-12 border border-[#bfc9bc] rounded-full text-[#40493f] font-bold text-xs hover:bg-[#ebefe7] transition-colors select-none cursor-pointer"
            >
              Cancelar Cadastro
            </button>
          </div>

        </div>

      </form>

      {/* Product Submission Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#181d18]/45 backdrop-blur-sm" />
          <div className="relative bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#176c33]/15 rounded-full flex items-center justify-center text-[#176c33] mx-auto shadow-lg shadow-[#176c33]/10 font-bold">
              ✓
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Sucesso!
              </h3>
              <p className="text-sm text-[#707a6e]">
                O produto foi {mode === 'edit' ? 'atualizado com sucesso' : 'cadastrado com sucesso'} e já está disponível para visualização e compra no catálogo do Sacolão.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onCancel(); // Goes back to management list directly
                }}
                className="w-full bg-[#176c33] text-white font-bold text-sm py-3.5 rounded-full hover:bg-[#115326] transition-colors"
              >
                Continuar para o Inventário
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
