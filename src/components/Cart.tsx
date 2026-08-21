import React, { useState } from 'react';
import { Minus, Plus, Trash2, Send, ShoppingBag } from 'lucide-react';
import { CartItem, CustomerInfo } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number, saleType?: 'UNI' | 'KG' | 'INTEIRO' | 'BANDA' | 'QUARTO', variantLabel?: string) => void;
  onRemoveItem: (productId: string, saleType?: 'UNI' | 'KG' | 'INTEIRO' | 'BANDA' | 'QUARTO', variantLabel?: string) => void;
  customerInfo: CustomerInfo;
  onUpdateCustomerInfo: (info: CustomerInfo) => void;
  onClearCart: () => void;
  onNavigateToCatalog: () => void;
}

export default function Cart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  customerInfo,
  onUpdateCustomerInfo,
  onClearCart,
  onNavigateToCatalog
}: CartProps) {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  // Delivery hours: 07:00-12:30 and 15:00-16:40, paused 12:30-15:00, closed after 16:40
  const checkDeliveryHours = (): { withinHours: boolean; nextSlotText: string } => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const OPEN_MORNING = 7 * 60; // 07:00
    const PAUSE_START = 12 * 60 + 30; // 12:30
    const PAUSE_END = 15 * 60; // 15:00
    const CLOSE = 16 * 60 + 40; // 16:40

    if (minutes < OPEN_MORNING) {
      return { withinHours: false, nextSlotText: 'a partir das 7:00 de hoje' };
    }
    if (minutes >= PAUSE_START && minutes < PAUSE_END) {
      return { withinHours: false, nextSlotText: 'a partir das 15:00 de hoje' };
    }
    if (minutes >= CLOSE) {
      return { withinHours: false, nextSlotText: 'a partir das 7:00 de amanhã' };
    }
    return { withinHours: true, nextSlotText: '' };
  };

  // Totals
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = cartItems.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);
  const hasNegotiableItems = false;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (id === 'customer-name') {
      onUpdateCustomerInfo({ ...customerInfo, name: value });
    } else if (id === 'customer-neighborhood') {
      onUpdateCustomerInfo({ ...customerInfo, neighborhood: value });
    } else if (id === 'customer-address') {
      onUpdateCustomerInfo({ ...customerInfo, address: value });
    } else if (id === 'customer-notes') {
      onUpdateCustomerInfo({ ...customerInfo, notes: value });
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name.trim() || !customerInfo.address.trim() || !customerInfo.neighborhood?.trim()) {
      alert('Por favor, preencha seu nome, bairro e rua/número de entrega completos.');
      return;
    }

    if (totalValue < 15) {
      alert('O valor mínimo para finalização do pedido é R$ 15,00.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    // Check delivery hours (07:00-12:30 and 15:00-16:40)
    const { withinHours, nextSlotText } = checkDeliveryHours();
    let outsideHoursNote = '';
    if (!withinHours) {
      const confirmNextSlot = window.confirm(
        `No momento estamos fora do horário de entrega (entregamos das 7:00 às 12:30 e das 15:00 às 16:40).\n\nDeseja que seu pedido seja entregue no próximo horário disponível (${nextSlotText})?`
      );
      if (!confirmNextSlot) {
        return;
      }
      outsideHoursNote = `\n\n⚠️ *Pedido fora do horário de entrega.* Cliente concorda em receber ${nextSlotText}.`;
    }

    // Build WhatsApp Message
    const itemsText = cartItems.map((item) => {
      const unitLabel = 
        item.product.saleType === 'KG' ? 'kg' : 
        item.product.saleType === 'UNI' ? 'un' : 
        item.product.saleType === 'INTEIRO' ? 'inteiro' : 
        item.product.saleType === 'BANDA' ? 'banda' : 
        item.product.saleType === 'QUARTO' ? '1/4' : 'un';
      const formattedQty = item.product.saleType === 'KG' ? item.quantity.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) : Math.round(item.quantity);
      return `- ${item.product.name}: ${formattedQty} ${unitLabel}`;
    }).join('\n');

    let paymentText = '';
    if (customerInfo.paymentMethod === 'PIX') {
      paymentText = 'PIX';
    } else if (customerInfo.paymentMethod === 'CARTAO') {
      paymentText = `Cartão (${customerInfo.cashChange === 'Credito' ? 'Crédito' : 'Débito'})`;
    } else if (customerInfo.paymentMethod === 'DINHEIRO') {
      const troco = customerInfo.cashChange?.trim();
      paymentText = `Dinheiro${troco ? ` (Troco para ${troco})` : ''}`;
    } else {
      paymentText = 'PIX'; // Fallback / Default
    }

    const message = `Olá! Gostaria de finalizar meu pedido no Sacolão:\n\n*Cliente:* ${customerInfo.name.trim()}\n*Bairro:* ${customerInfo.neighborhood.trim()}\n*Rua e Número:* ${customerInfo.address.trim()}\n*Forma de Pagamento:* ${paymentText}${customerInfo.notes?.trim() ? `\n*Observação:* ${customerInfo.notes.trim()}` : ''}\n\n*Pedido:*\n${itemsText}\n\n*Subtotal aproximado:* R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${hasNegotiableItems ? ' + itens a negociar' : ''}\n\nAguardo a confirmação do valor total e taxa de entrega.${outsideHoursNote}`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '5585996450084'; // corrected WhatsApp phone number

    // Open WhatsApp URL
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    // Save order details to localStorage for growth metrics
    try {
      const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      const newOrder = {
        timestamp: Date.now(),
        totalValue: totalValue,
        itemsCount: itemsCount
      };
      const existingOrdersStr = localStorage.getItem('sacolao_orders');
      let orders = [];
      if (existingOrdersStr) {
        try {
          orders = JSON.parse(existingOrdersStr);
          if (!Array.isArray(orders)) {
            orders = [];
          }
        } catch (err) {
          orders = [];
        }
      }
      orders.push(newOrder);
      localStorage.setItem('sacolao_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Erro ao salvar registro de venda:', e);
    }

    // Show beautiful local success indicator
    setIsSubmitSuccessful(true);
  };

  const handleCompleteOrderFinish = () => {
    setIsSubmitSuccessful(false);
    onClearCart();
    onNavigateToCatalog();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-24">
      {/* Header title */}
      <div className="flex justify-between items-end mb-4 border-b border-[#bfc9bc]/20 pb-4">
        <div>
          <h2 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Seu Carrinho
          </h2>
          <p className="text-sm text-[#707a6e]">Confirme seus produtos frescos e informe a entrega.</p>
        </div>
        <span className="font-bold text-[#176c33] bg-[#c9ecc9]/40 text-xs px-3 py-1 rounded-full">
          {totalItems} {totalItems === 1 ? 'item' : 'itens'}
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white p-8 rounded-2xl border border-[#bfc9bc]/10 shadow-sm">
          <ShoppingBag className="w-16 h-16 text-[#176c33] mx-auto" />
          <p className="text-lg font-bold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>Seu carrinho está vazio!</p>
          <p className="text-[#707a6e] text-sm max-w-xs mx-auto">Nenhum item adicionado ainda. Volte ao nosso catálogo de produtos frescos para escolher.</p>
          <button
            onClick={onNavigateToCatalog}
            className="px-6 py-3 bg-[#176c33] text-white font-bold text-sm rounded-full hover:bg-[#115326] transition-colors shadow-sm"
          >
            Voltar às Compras
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Card Items List Column (7/12) */}
          <div className="lg:col-span-7 space-y-4">
            {cartItems.map((item) => {
              const itemTotal = item.product.price * item.quantity;
              return (
                <div
                  key={item.product.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-[#bfc9bc]/15 flex flex-col gap-3 transition-transform active:scale-[0.99]"
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#f1f5ed] flex-shrink-0 border border-gray-100">
                      <img
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        src={item.product.imageUrl}
                      />
                    </div>

                    {/* Title info */}
                    <div className="flex-1 min-w-0">
                      <span className="block text-[9px] font-bold tracking-wider uppercase text-[#707a6e] truncate">
                        {item.product.category}
                      </span>
                      <h3 className="font-bold text-[#181d18] text-sm leading-snug line-clamp-2">
                        {item.product.name}
                      </h3>
                      {item.product.variantLabel && (
                        <span className="inline-block text-[10px] font-bold text-[#176c33] bg-[#176c33]/10 rounded-full px-2 py-0.5 mt-1">
                          {item.product.variantLabel}
                        </span>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveItem(item.product.id, item.product.saleType, item.product.variantLabel)}
                      className="text-[#99405c] hover:bg-red-50 p-1.5 rounded-full transition-colors shrink-0"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Price and quantity controller */}
                  <div className="flex items-center justify-between gap-2 pl-1">
                    <p className="text-sm text-[#176c33] font-bold whitespace-nowrap">
                      R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-[10px] font-normal text-[#707a6e] ml-0.5">
                        /{item.product.saleType === 'QUARTO' ? '1/4' : item.product.saleType.toLowerCase()}
                      </span>
                    </p>

                    <div className="flex items-center bg-[#f1f5ed] rounded-full p-1 border border-[#bfc9bc]/20 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1, item.product.saleType, item.product.variantLabel)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-[#ebefe7] text-[#176c33] transition-colors border border-[#bfc9bc]/15 shadow-sm"
                        title="Diminuir"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-[#181d18]">
                        {item.product.saleType === 'KG' ? item.quantity : Math.round(item.quantity)}
                      </span>
                      <span className="text-[10px] text-[#707a6e] font-semibold uppercase pr-1">
                        {item.product.saleType === 'KG' ? 'kg' : 
                         item.product.saleType === 'UNI' ? 'un' : 
                         item.product.saleType === 'INTEIRO' ? 'inteiro' : 
                         item.product.saleType === 'BANDA' ? 'banda' : 
                         item.product.saleType === 'QUARTO' ? '1/4' : 'un'}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1, item.product.saleType, item.product.variantLabel)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-[#ebefe7] text-[#176c33] transition-colors border border-[#bfc9bc]/15 shadow-sm"
                        title="Aumentar"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Back to Catalog button */}
            <div className="pt-2">
              <button
                onClick={onNavigateToCatalog}
                className="text-sm font-bold text-[#176c33] hover:underline flex items-center gap-1"
              >
                ← Adicionar mais itens ao carrinho
              </button>
            </div>
          </div>

          {/* Form & Billing Info Column (5/12) */}
          <div className="lg:col-span-5 space-y-6">
            {!checkDeliveryHours().withinHours && (
              <div className="bg-[#fff6e8] border border-[#f0c987] text-[#7a4413] text-xs font-semibold rounded-xl p-4">
                No momento estamos fora do horário de entrega (entregamos das 7:00 às 12:30 e das 15:00 às 16:40). Você ainda pode finalizar o pedido, e ele será entregue {checkDeliveryHours().nextSlotText}.
              </div>
            )}
            <form onSubmit={handleCheckout} className="bg-white p-6 rounded-2xl shadow-sm border border-[#bfc9bc]/15 space-y-4">
              <h3 
                className="font-bold text-lg text-[#181d18]"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                Informações de Entrega
              </h3>

              <div className="space-y-4">
                {/* Customer name */}
                <div className="space-y-1.5">
                  <label htmlFor="customer-name" className="block text-xs font-bold text-[#40493f] px-1 uppercase">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    id="customer-name"
                    required
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    placeholder="Como devemos te chamar?"
                    className="w-full h-12 px-5 rounded-full bg-[#f1f5ed] border-none focus:ring-2 focus:ring-[#176c33] focus:bg-white text-sm transition-all focus:outline-none"
                  />
                </div>

                {/* Bairro / Neighborhood */}
                <div className="space-y-1.5">
                  <label htmlFor="customer-neighborhood" className="block text-xs font-bold text-[#40493f] px-1 uppercase">
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="customer-neighborhood"
                    required
                    value={customerInfo.neighborhood || ''}
                    onChange={handleInputChange}
                    placeholder="Ex: Centro, Santa Luzia, etc."
                    className="w-full h-12 px-5 rounded-full bg-[#f1f5ed] border-none focus:ring-2 focus:ring-[#176c33] focus:bg-white text-sm transition-all focus:outline-none"
                  />
                </div>

                {/* Customer Address */}
                <div className="space-y-1.5">
                  <label htmlFor="customer-address" className="block text-xs font-bold text-[#40493f] px-1 uppercase">
                    Rua e Número
                  </label>
                  <textarea
                    id="customer-address"
                    required
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Rua, número, complemento e pontos de referência"
                    className="w-full p-4 rounded-xl bg-[#f1f5ed] border-none focus:ring-2 focus:ring-[#176c33] focus:bg-white text-sm transition-all focus:outline-none resize-none"
                  />
                </div>

                {/* Order Observation */}
                <div className="space-y-1.5">
                  <label htmlFor="customer-notes" className="block text-xs font-bold text-[#40493f] px-1 uppercase">
                    Observação (opcional)
                  </label>
                  <textarea
                    id="customer-notes"
                    value={customerInfo.notes || ''}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Ex: trocar item se estiver em falta, tocar a campainha, etc."
                    className="w-full p-4 rounded-xl bg-[#f1f5ed] border-none focus:ring-2 focus:ring-[#176c33] focus:bg-white text-sm transition-all focus:outline-none resize-none"
                  />
                </div>

                {/* Payment Method Option */}
                <div className="space-y-2 pt-2 border-t border-[#bfc9bc]/15">
                  <label className="block text-xs font-bold text-[#40493f] px-1 uppercase mb-1">
                    Forma de Pagamento
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Pix Option */}
                    <button
                      type="button"
                      id="payment-method-pix"
                      onClick={() => onUpdateCustomerInfo({ ...customerInfo, paymentMethod: 'PIX' })}
                      className={`h-11 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold border transition-all cursor-pointer ${
                        (customerInfo.paymentMethod === 'PIX' || !customerInfo.paymentMethod)
                          ? 'bg-[#176c33] border-[#176c33] text-white shadow-md shadow-[#176c33]/15'
                          : 'bg-[#f1f5ed] border-transparent text-[#40493f] hover:bg-[#ebefe7]'
                      }`}
                    >
                      <span>PIX</span>
                    </button>

                    {/* Card Option */}
                    <button
                      type="button"
                      id="payment-method-card"
                      onClick={() => onUpdateCustomerInfo({ ...customerInfo, paymentMethod: 'CARTAO', cashChange: 'Debito' })}
                      className={`h-11 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold border transition-all cursor-pointer ${
                        customerInfo.paymentMethod === 'CARTAO'
                          ? 'bg-[#176c33] border-[#176c33] text-white shadow-md shadow-[#176c33]/15'
                          : 'bg-[#f1f5ed] border-transparent text-[#40493f] hover:bg-[#ebefe7]'
                      }`}
                    >
                      <span>Cartão</span>
                    </button>

                    {/* Cash Option */}
                    <button
                      type="button"
                      id="payment-method-cash"
                      onClick={() => onUpdateCustomerInfo({ ...customerInfo, paymentMethod: 'DINHEIRO', cashChange: 'Não preciso' })}
                      className={`h-11 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold border transition-all cursor-pointer ${
                        customerInfo.paymentMethod === 'DINHEIRO'
                          ? 'bg-[#176c33] border-[#176c33] text-white shadow-md shadow-[#176c33]/15'
                          : 'bg-[#f1f5ed] border-transparent text-[#40493f] hover:bg-[#ebefe7]'
                      }`}
                    >
                      <span>Dinheiro</span>
                    </button>
                  </div>
                </div>

                {/* Sub-selectors depending on the chosen Payment Method */}
                {customerInfo.paymentMethod === 'CARTAO' && (
                  <div className="space-y-1.5 p-3 rounded-2xl bg-[#f1f5ed] border border-[#bfc9bc]/15 animate-in slide-in-from-top-1 duration-200">
                    <label className="block text-[10px] font-extrabold text-[#40493f] uppercase mb-1">
                      Opção da Maquininha
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        id="card-debit"
                        onClick={() => onUpdateCustomerInfo({ ...customerInfo, cashChange: 'Debito' })}
                        className={`flex-1 h-9 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          customerInfo.cashChange !== 'Credito'
                            ? 'bg-[#176c33] text-white'
                            : 'bg-white text-[#40493f] border border-[#bfc9bc]/30 hover:bg-gray-50'
                        }`}
                      >
                        Débito
                      </button>
                      <button
                        type="button"
                        id="card-credit"
                        onClick={() => onUpdateCustomerInfo({ ...customerInfo, cashChange: 'Credito' })}
                        className={`flex-1 h-9 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          customerInfo.cashChange === 'Credito'
                            ? 'bg-[#176c33] text-white'
                            : 'bg-white text-[#40493f] border border-[#bfc9bc]/30 hover:bg-gray-50'
                        }`}
                      >
                        Crédito
                      </button>
                    </div>
                  </div>
                )}

                {customerInfo.paymentMethod === 'DINHEIRO' && (
                  <div className="space-y-1.5 p-3 rounded-2xl bg-[#f1f5ed] border border-[#bfc9bc]/15 animate-in slide-in-from-top-1 duration-200">
                    <label htmlFor="cash-change" className="block text-[10px] font-extrabold text-[#40493f] uppercase">
                      Precisa de troco para R$?
                    </label>
                    <input
                      type="text"
                      id="cash-change"
                      value={customerInfo.cashChange || ''}
                      onChange={(e) => onUpdateCustomerInfo({ ...customerInfo, cashChange: e.target.value })}
                      placeholder="Ex: 50,00 ou escreva 'Não preciso'"
                      className="w-full h-9 px-4 rounded-full bg-white border border-[#bfc9bc]/30 focus:ring-1 focus:ring-[#176c33] text-xs font-semibold focus:outline-none placeholder:text-gray-400"
                    />
                  </div>
                )}
              </div>

              {/* Summary values information */}
              <div className="pt-4 border-t border-[#bfc9bc]/20 space-y-2">
                <div className="flex justify-between items-center text-xs text-[#707a6e]">
                  <span>Subtotal aproximado</span>
                  <span>
                    R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    {hasNegotiableItems && ' + valor a negociar'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-base font-extrabold text-[#181d18] pt-2 border-t border-dashed border-[#bfc9bc]/20">
                  <span>Total estimado</span>
                  <span className="text-xl text-[#176c33] flex flex-col items-end">
                    <span>
                      R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {hasNegotiableItems && (
                      <span className="text-xs font-bold text-[#a5521b] mt-0.5 animate-pulse">
                        + itens a negociar
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Checkout actions */}
              <div className="pt-4 space-y-3">
                {totalValue < 15 && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-2xl p-4 flex flex-col gap-1 items-center text-center animate-in slide-in-from-top-1 duration-200">
                    <span className="flex items-center gap-1.5 text-amber-700">Valor mínimo do pedido: R$ 15,00</span>
                    <span className="font-normal text-amber-600">Falta apenas R$ {(15 - totalValue).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} em produtos no seu carrinho para finalizar.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={totalValue < 15}
                  className={`w-full h-14 rounded-full flex items-center justify-center gap-3 shadow-lg text-white font-bold text-sm select-none cursor-pointer transition-all active:scale-[0.98] ${
                    totalValue < 15
                      ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-[#25D366] hover:brightness-[1.04] shadow-[#25D366]/20'
                  }`}
                >
                  <Send className={`w-5 h-5 ${totalValue < 15 ? 'text-gray-400' : 'fill-white'}`} />
                  <span>Finalizar e Enviar no WhatsApp</span>
                </button>

                <p className="text-[11px] text-center text-[#ff1100] bg-[#ffffff] border-[#ffffff] border rounded-lg leading-normal px-2 py-1">
                  O valor final da sua compra será confirmado via WhatsApp após o envio, podendo variar conforme o peso real dos produtos frescos pesados no momento do envio.
                </p>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* Success Modal */}
      {isSubmitSuccessful && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#181d18]/45 backdrop-blur-sm" />
          <div className="relative bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#176c33] rounded-full flex items-center justify-center text-white mx-auto shadow-md">
              <Send className="w-8 h-8 fill-white" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#181d18]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Pedido de Compra Iniciado!
              </h3>
              <p className="text-sm text-[#707a6e]">
                Iniciamos a conversa via WhatsApp do Sacolão para confirmar o seu pedido de compra. Aguarde nosso retorno na tela!
              </p>
            </div>

            <div>
              <button
                onClick={handleCompleteOrderFinish}
                className="w-full bg-[#176c33] text-white font-bold text-sm py-3.5 rounded-full hover:bg-[#115326] transition-colors"
              >
                Concluir Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
