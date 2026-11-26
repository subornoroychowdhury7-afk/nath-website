export const SHOP_INFO = {
  name: 'NATH CAFE ZONE',
  tagline: 'Cyber Cafe • Printing • Customization',
  address: {
    line1: 'NATH CAFE ZONE',
    line2: 'Subhas More, Kanchrapara',
    line3: 'North 24 Parganas, West Bengal',
    pin: '743145',
  },
  phoneDisplay: '+91 62901 34684',
  whatsappNumber: '916290134684',
  hours: {
    days: 'Monday – Sunday',
    openHour: 10,
    closeHour: 21,
    display: '10:00 AM – 9:00 PM',
  },
};

export const SERVICES = [
  {
    id: 'printing',
    category: 'Printing',
    title: 'All Types of Printing',
    shortDesc:
      'High-speed B&W and colour laser printing, photocopy, scanning, lamination, and spiral binding.',
    turnaround: '10 – 30 mins',
    startingPrice: 'From ₹2 / page',
    image:
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80',
    specs: [
      'A4, A3, Legal & Bond Paper (75–300 GSM)',
      'Borderless Photo & Glossy Prints',
      'High-DPI Scanning & PDF Formatting',
      'Spiral Binding & Thermal Lamination',
    ],
  },
  {
    id: 'trophy-medal',
    category: 'Awards & Badges',
    title: 'Trophy & Medal Studio',
    shortDesc:
      'Custom engraved trophies, metal medals, and mementos for schools, sports clubs, and corporate events.',
    turnaround: '24 – 48 hrs',
    startingPrice: 'From ₹45 / unit',
    image:
      'https://images.unsplash.com/photo-1614036634955-ae5e90f9b9eb?auto=format&fit=crop&w=900&q=80',
    specs: [
      'Gold, Silver & Bronze Custom Medals',
      'Laser-Engraved Metal & Acrylic Plates',
      'Bulk School & Tournament Packages',
      'Custom Ribbon Colours & Logo Crest',
    ],
  },
  {
    id: 'flex-printing',
    category: 'Signage & Flex',
    title: 'Flex Banner Printing',
    shortDesc:
      'Weatherproof normal flex, black media flex, and frontlit banners for shops, Durga Puja pandals, events, and promotions.',
    turnaround: 'Same Day',
    startingPrice: 'From ₹12 / sq.ft',
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80',
    specs: [
      'Normal Flex & Black Media Flex',
      '1440 DPI Eco-Solvent Vivid Output',
      'Reinforced Metal Eyelets (Grommets)',
      'Custom Layout & Graphic Support',
    ],
  },
  {
    id: 'vinyl-printing',
    category: 'Signage & Flex',
    title: 'Vinyl & Sticker Printing',
    shortDesc:
      'Precision die-cut vinyl decals, glass branding, sunboard mounting, and waterproof product labels.',
    turnaround: 'Same Day – 24 hrs',
    startingPrice: 'From ₹25 / sq.ft',
    image:
      'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&w=900&q=80',
    specs: [
      'Matte & Gloss Laminated Vinyl',
      '3mm / 5mm Sunboard Mounting',
      'One-Way Vision Glass Film',
      'Waterproof Custom Product Stickers',
    ],
  },
  {
    id: 'button-badges',
    category: 'Awards & Badges',
    title: 'Custom Button Badges',
    shortDesc:
      'Crisp, scratch-resistant pin-back and magnetic button badges for events, campaigns, and schools.',
    turnaround: '2 – 6 hrs',
    startingPrice: 'From ₹18 / badge',
    image:
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=900&q=80',
    specs: [
      '44mm & 58mm Standard Rounds',
      'Glossy Mylar Protective Coat',
      'Safety Pin or Fridge Magnet Backing',
      'Volume Discounts for 50+ Pieces',
    ],
  },
  {
    id: 'mobile-digital',
    category: 'Digital & Recharge',
    title: 'Cyber Cafe & Mobile Recharge',
    shortDesc:
      'High-speed browsing, online form fill-up, ticket booking, PAN/utility services, and instant mobile recharge.',
    turnaround: 'Instant',
    startingPrice: 'Zero Extra Hassle',
    image:
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=900&q=80',
    specs: [
      'All Prepaid & DTH Instant Recharges',
      'Exam, Scholarship & Govt Form Fill-Up',
      'Resume Design, Typing & Document Edits',
      'Bill Payments & Fast Internet Access',
    ],
  },
];

export const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    title: 'High-Speed Colour & Document Print',
    category: 'Printing',
    image:
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'gal-2',
    title: 'Custom Engraved Trophies & Medals',
    category: 'Awards & Badges',
    image:
      'https://images.unsplash.com/photo-1614036634955-ae5e90f9b9eb?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'gal-3',
    title: 'Large-Format Flex & Storefront Signage',
    category: 'Signage & Flex',
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'gal-4',
    title: 'Vinyl Branding & Custom Stickers',
    category: 'Signage & Flex',
    image:
      'https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&w=900&q=80',
  },
];

export function calculateEstimateLocal(payload = {}) {
  const { type = 'printing' } = payload;

  if (type === 'printing') {
    const pages = Math.max(1, Math.min(10000, Number(payload.pages) || 10));
    const colorMode = payload.colorMode === 'color' ? 'color' : 'bw';
    const paperSize = payload.paperSize === 'A3' ? 'A3' : 'A4';
    const binding = Boolean(payload.binding);
    const lamination = Boolean(payload.lamination);

    let perPage = colorMode === 'color' ? 10 : 2;
    if (paperSize === 'A3') perPage *= 2;
    if (pages >= 100) perPage *= 0.85;
    else if (pages >= 50) perPage *= 0.92;

    const printSubtotal = Math.round(pages * perPage);
    const bindingFee = binding ? 35 : 0;
    const laminationFee = lamination ? pages * 15 : 0;
    const total = printSubtotal + bindingFee + laminationFee;

    return {
      type,
      currency: 'INR',
      unitRate: Number(perPage.toFixed(2)),
      subtotal: printSubtotal,
      addons: bindingFee + laminationFee,
      discountApplied:
        pages >= 100 ? '15% Bulk Print Discount' : pages >= 50 ? '8% Bulk Print Discount' : null,
      total,
      turnaround: pages > 200 ? '1 – 2 Hours' : '15 – 30 Minutes',
      summary: `${pages} ${paperSize} ${colorMode === 'color' ? 'Colour' : 'B&W'} pages${binding ? ' + Spiral Binding' : ''}${lamination ? ' + Lamination' : ''}`,
    };
  }

  if (type === 'flex-vinyl') {
    const widthFt = Math.max(1, Math.min(100, Number(payload.widthFt) || 6));
    const heightFt = Math.max(1, Math.min(100, Number(payload.heightFt) || 3));
    const normalizedMedia =
      payload.media === 'star-flex' ? 'black-media-flex' : payload.media;
    const media = ['normal-flex', 'black-media-flex', 'vinyl', 'vinyl-sunboard'].includes(
      normalizedMedia
    )
      ? normalizedMedia
      : 'black-media-flex';
    const quantity = Math.max(1, Math.min(100, Number(payload.quantity) || 1));
    const grommets = payload.grommets !== false;

    const rates = {
      'normal-flex': 12,
      'black-media-flex': 15,
      vinyl: 25,
      'vinyl-sunboard': 95,
    };

    const labels = {
      'normal-flex': 'normal flex',
      'black-media-flex': 'black media flex',
      vinyl: 'adhesive vinyl',
      'vinyl-sunboard': 'vinyl + sunboard mount',
    };

    const sqFt = widthFt * heightFt;
    const baseUnit = sqFt * rates[media];
    const finishingFee = grommets && media.includes('flex') ? 25 : 0;
    const subtotal = Math.round((baseUnit + finishingFee) * quantity);
    const discountRate = quantity >= 5 ? 0.1 : 0;
    const total = Math.round(subtotal * (1 - discountRate));

    return {
      type,
      currency: 'INR',
      sqFt,
      unitRate: rates[media],
      subtotal,
      addons: finishingFee * quantity,
      discountApplied: discountRate > 0 ? '10% Multi-Banner Discount' : null,
      total,
      turnaround: media === 'vinyl-sunboard' ? '24 Hours' : 'Same Day',
      summary: `${quantity}x ${widthFt}×${heightFt} ft (${sqFt} sq.ft) ${labels[media]}`,
    };
  }

  if (type === 'trophy-medal') {
    const itemKind = payload.itemKind === 'medal' ? 'medal' : 'trophy';
    const tier = ['standard', 'premium', 'custom-acrylic'].includes(payload.tier)
      ? payload.tier
      : 'standard';
    const quantity = Math.max(1, Math.min(1000, Number(payload.quantity) || 10));
    const engraving = payload.engraving !== false;

    const basePrices = {
      medal: { standard: 55, premium: 95, 'custom-acrylic': 130 },
      trophy: { standard: 220, premium: 450, 'custom-acrylic': 650 },
    };

    const unitBase = basePrices[itemKind][tier];
    const engravingFee = engraving ? (itemKind === 'medal' ? 15 : 35) : 0;
    let unitTotal = unitBase + engravingFee;
    let discountLabel = null;

    if (quantity >= 50) {
      unitTotal *= 0.85;
      discountLabel = '15% Event Bulk Discount';
    } else if (quantity >= 20) {
      unitTotal *= 0.9;
      discountLabel = '10% Team Bulk Discount';
    }

    const total = Math.round(unitTotal * quantity);

    return {
      type,
      currency: 'INR',
      unitRate: Math.round(unitTotal),
      subtotal: total,
      addons: engraving ? engravingFee * quantity : 0,
      discountApplied: discountLabel,
      total,
      turnaround: quantity >= 30 ? '2 – 3 Days' : '24 – 48 Hours',
      summary: `${quantity}x ${tier.replace('-', ' ')} ${itemKind}${engraving ? ' with custom engraving' : ''}`,
    };
  }

  if (type === 'button-badges') {
    const quantity = Math.max(10, Math.min(5000, Number(payload.quantity) || 25));
    const size = payload.size === '44mm' ? '44mm' : '58mm';
    const backing = payload.backing === 'magnet' ? 'magnet' : 'pin';

    let rate = size === '58mm' ? 22 : 18;
    if (backing === 'magnet') rate += 12;

    let discountLabel = null;
    if (quantity >= 200) {
      rate *= 0.72;
      discountLabel = '28% Mega Event Discount';
    } else if (quantity >= 50) {
      rate *= 0.85;
      discountLabel = '15% Bulk Badge Discount';
    }

    const total = Math.round(rate * quantity);

    return {
      type,
      currency: 'INR',
      unitRate: Number(rate.toFixed(1)),
      subtotal: total,
      addons: 0,
      discountApplied: discountLabel,
      total,
      turnaround: quantity >= 100 ? 'Same Day / 24 hrs' : '2 – 4 Hours',
      summary: `${quantity}x ${size} ${backing === 'magnet' ? 'Magnetic' : 'Pin-Back'} Button Badges`,
    };
  }

  return {
    type,
    currency: 'INR',
    total: 0,
    turnaround: 'Instant',
    summary: 'Custom enquiry',
  };
}
