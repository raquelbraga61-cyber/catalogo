import { Product, DailyOffer } from './types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'HT-001',
    name: 'Tomate Cereja Orgânico',
    category: 'Verduras',
    saleType: 'UNI',
    price: 8.90,
    description: 'Tomates cereja frescos, colhidos no mesmo dia, extremamente doces e ricos em antioxidantes naturais.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrdDkmHMTpc4opGw5CNXrjir_h4OkyumlhQImTHMPekgegBjkU7eLjlb0gQHNMR4zFIb76mJXL9hHJ-agiziKWz701UydipI90auHpZaJTgijMprP9gI6guxBiffMl1G9FcDobKMrWxDxYMaYjCdTmnI3xfYk2qJAubTEvBsGcApJFhse-YYDgBrydk-zKbPrBWJjndKvL4VTelHVO_-f7bP5z3wRA-G-UJ4PKXo7zTbnwOXA1lJUGhm4opJfKJ_PmZvK_Pfz_h_o',
    stock: 120,
    isFavorite: true
  },
  {
    id: 'HT-002',
    name: 'Alface Romana Hidropônica',
    category: 'Verduras',
    saleType: 'UNI',
    price: 4.50,
    description: 'Alface romana com folhas crocantes e textura firme. Livre de agrotóxicos, perfeita para saladas Caesar.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR6jyxE_2OIOtdbUiqVpPX4Q2GE_gVoipZdJsoP1AOqUqHWgwTVudtbvfSvfCvF3Y4D1Thx6k7EVoM1rpTin8M3XL6dRcMdv1XuS-j0-1kVrX6yHp4etW_XgqH8ZTePRFiNh7IZSH-FyulUbpU3x7G-n9bGMXTKl9E8Z3aXqKX0OeZT226Hx1N5I3yeFS4aqdMKKFPdHPpf2FGvxtvJ-yA95cz_XLcINC3GZcibFpHcpgBf_RWzhhWbVC70yO8711XBSE-qqOw-uA',
    stock: 95,
    isFavorite: false
  },
  {
    id: 'HT-003',
    name: 'Maçã Gala Premium',
    category: 'Frutas',
    saleType: 'KG',
    price: 12.90,
    description: 'Maçãs Gala super vermelhas, doces, firmes e lavadas. Ideal para lanches saudáveis.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYyUpXxFCoTM1Vhoy3eDJnC9upba3Jfo0bB0E0b1YRVyVV1Vbcu2k2Nwi6W_vfAUZ3BuvZ-pmDL23jOOpcSlctIvcuRod3a7TvANYoZcjGX4Negv6T92HDtaaglzZk_uexHJEYmkY-rrUIllzHa-aTmwfLB-rW0ZXtrUoU64LUHoQWZYi24hWm443oqBDPyQEMojbEGHplKAr5pvbnY7p2gGT028_Pw1va3wDYNPacWGsYxoZZRJWNRjgcGLAY5uFrseJQuwPeXlA',
    stock: 154,
    isFavorite: true
  },
  {
    id: 'HT-004',
    name: 'Banana Nanica Da Terra',
    category: 'Frutas',
    saleType: 'KG',
    price: 7.50,
    description: 'Bananas maduras na medida certa, ricas em potássio e perfeitas para vitaminas ou sobremesas.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJQXBuuBXaZ1XNru7IJ3AvW2Wyzr93W8Am-4SCyz4ksmah0wxz9BYeklTid-GZZ3ZoC3QQ5SxngKOOGao9iB40hxqsBi-2aM-KWUrvSIOp2BUV_cPIQl4gqVo1hr_7OtQnsjg-tf0PZ1DxQrqf5HjC0sVFWvBIgIez6nsX7-U63I5KVsbvelNAaZxI7XnzwlgfHPk9hzv0Sxfq_UnBVxOosQL8vrcynWDkDCVAGfuHoFvW4C6wAC2txn0wHySx7Ax3X8jW6JLxYW4',
    stock: 210,
    isFavorite: false
  },
  {
    id: 'HT-005',
    name: 'Couve Manteiga Orgânica',
    category: 'Verduras',
    saleType: 'UNI',
    price: 4.50,
    description: 'Folhas tenras de couve manteiga selecionadas, perfeitas para refogados saborosos ou o clássico suco verde.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFvKBzMQhvne-E0XfmvUxMikwBs3MlxV8T_ZlV4mFvgwr8pexPyoeIHNQ8K4TkbRDrssbBRnXHxk9NeQQYOo_c0qwmLAtb-yHQ6mMKXNGeU01H2bMC7Mw8ZKSiIpudF5hUbZnA39cschMEHNsnRiUw8A_8bisZZNXxbsd3Rai4kiwPwtve5QticifTY73wGhDRLu9ImqTtUoAd660z87wvVMv4Mi0u08SFWcQ-hvGOQNu6Zs9dSt_yUsVp70-i5aRMhQVa7N-5Mvw',
    stock: 45,
    isFavorite: false
  },
  {
    id: 'HT-006',
    name: 'Brócolis Ninja Fresco',
    category: 'Legumes',
    saleType: 'UNI',
    price: 6.90,
    description: 'Brócolis tipo ninja inteiro, cor verde vivo, carregado de vitaminas. Ideal cozido no vapor ou grelhado.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdEM7h21E07iaz7YPos3LZ64di_CvrwWLm1NoaOxKWsKF3RNtLu5cvrQHYGLrfy6ilajSTtmuHPQ5w-qrPOAWeXahiZEfIVKDveEDznjdMUyF8h49ciq873yxwuhKBck09myXT411eaP1c-C-j9cCa6VraKTJWwo3eYno0SpCY4PR6N-1GoKvzaywm5FXvozkQYVZwEidjqvzhuhxzVNY_gaeMitznzo6mgfKluLpcBsyXMIv4ShZ7NLQe3sDIMXKtx2kDkBrewbA',
    stock: 67,
    isFavorite: true
  },
  {
    id: 'HT-007',
    name: 'Cenoura Baby Selecionada',
    category: 'Legumes',
    saleType: 'KG',
    price: 9.20,
    description: 'Minicenovras higienizadas e super doces, ótimas para petiscos saudáveis, assar ou cozinhar para as crianças.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUpfU9GumE4mWsRFkiJMkTXEKOfwixl6hb86xZCNBSRYy5B9deZurCIi_vpW04tHA1Pqphk5P1BfDu0Abjc7wf4R-KuV25uNd5I3FvkfHQHgFXcvrNhW3CtRCmQA7pmE-YPOYJLsvrNbR-3I9QDWLzK_rnZdkP424-Zq7YtgloxV7BM9NuJ655DikMqvB72CWf5XdQa-DG5rPTKWHY-EjUEZq7tZh4pybm59gGE_Wv_i5QM3cCwKkwS6SnlX7a7AOfBHZWXjOx8-Q',
    stock: 80,
    isFavorite: true
  },
  {
    id: 'HT-008',
    name: 'Batata Asterix Rosada',
    category: 'Legumes',
    saleType: 'KG',
    price: 5.80,
    description: 'Batatas do tipo Asterix, conhecidas pela menor quantidade de água. Ideais para purês cremosos ou frituras crocantes.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn_K3ACiznastm6xyrh5ewuVLJx0lqrTdoAcxEwPbVirjqHtemUdjHBB4U0rKe7Pxop8XXOOZBaQ1q8TfGoPoCiOsgeF3esql2HGu1vYg4cEFXYK_kpcxSYN1Gf3IGLB9qZ_b_AeqOe3Ey-mVCYE395AMhc-y1hSBCfXslRxl8FnwWyIobqYHukxffkhOrX8R53mmaJGr1iqOoWEGEX6Gi9uF1ZmtYKA8N49YNGcqJEwPgieIrQM-O1x1eW9TaT13KKAPc40sDs34',
    stock: 140,
    isFavorite: false
  },
  {
    id: 'HT-009',
    name: 'Abacaxi Pérola Doce',
    category: 'Frutas',
    saleType: 'UNI',
    price: 8.90,
    description: 'Abacaxis maduros e super suculentos da variedade Pérola. Extremamente saborosos.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqS7YMZ0ctRfx__tbmQl3pPGOUlQXDsfHdryXbik2ZTSbNynG6UulSoGZNax4QcNkmyIJOzM5446_i1W6bu7nu5oXgjN-G5adHNDmGbrAaiZskJdLRTHsb3NITzQMzjzgDFgMu5IVVJkNpXS_4BsiLAn_LDmF7phfqU_CjBjqfHWu1qNeAO4SvanA4a6MaquWxVNKYX8Kvo7VCPBxIorVdT6c7jwWY96Jdu8beXNGQgXo5lYEYBR34R9uQcvGAEZUBeK1OZr8Y2OI',
    stock: 82,
    isFavorite: false
  },
  {
    id: 'HT-010',
    name: 'Tomate Italiano Grande',
    category: 'Legumes',
    saleType: 'KG',
    price: 12.90,
    description: 'Tomates tipo Italiano maduros, alongados e perfeitos para molhos encorpados ou saladas rústicas.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq01ETqpJ_SpAnt2VO31mpa0sjCgA4T3E54Y_0mnA1IyPMQGkrkVGyUKIPNi97ZRCc_yf-aII2rKFnIkiJoBWSAECNwYuEu7ijZn2p9Y01YNSgWvBdNGU9HzKZERNUywXeT-db813s4qdr8cKrrDzh8d_vFSlIHOu2GAZpsAp2C8-TxRTAUSd6IxudRm7Ibat-YisSxu0HyTQZlcSEDXlxoJkbcKU3oGhElxn08vIGZ22oV1Fv1_vwhLGu2YtGoVSrvW4BP-0-Oi0',
    stock: 120,
    isFavorite: false
  },
  {
    id: 'HT-011',
    name: 'Melancia Cabocla Doce',
    category: 'Frutas',
    saleType: 'INTEIRO',
    allowedUnits: 'FRAC',
    price: 24.00,
    description: 'Melancia fresca, super doce e sumarenta. Pode ser adquirida inteira, em banda ou 1/4.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYyUpXxFCoTM1Vhoy3eDJnC9upba3Jfo0bB0E0b1YRVyVV1Vbcu2k2Nwi6W_vfAUZ3BuvZ-pmDL23jOOpcSlctIvcuRod3a7TvANYoZcjGX4Negv6T92HDtaaglzZk_uexHJEYmkY-rrUIllzHa-aTmwfLB-rW0ZXtrUoU64LUHoQWZYi24hWm443oqBDPyQEMojbEGHplKAr5pvbnY7p2gGT028_Pw1va3wDYNPacWGsYxoZZRJWNRjgcGLAY5uFrseJQuwPeXlA',
    stock: 50,
    isFavorite: true
  }
];

export const GENERAL_STATS = {
  activeCategories: 5,
  monthlyObjective: 'As vendas de produtos orgânicos cresceram +15% este mês em relação ao período anterior!'
};

export const DEFAULT_DAILY_OFFER: DailyOffer = {
  badge: 'Oferta do Dia',
  title: 'Frescor Direto da Horta na sua Mesa',
  description: 'Aproveite até 30% OFF em itens selecionados hoje mesmo.',
  imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2TteofSMBjMB6hWFlPuT7ehrMQkljYM65cqPUJIsr91DvVPNDelcJpOpfAtQb58vsAZw2mZAvWKLGTEo_K-jTBXrY-iYJAWK6Bdfy2-V3cK6Tb7GGk66GCkqrbk60_WTM9FOxFLR3mTCYqJuYDC9iJmnBcY9xf1MO7xX9bnKtK05Cm8aevshqp7uf-3rc12cvvoO0zaDxdb0obnSB_RualhWmipmsI1GrV8JyvubQf4opYom5lsLYrjdWFs2RFWUZPV1a3gVPZko'
};

