"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "uz" | "ru" | "en"

interface TranslationHero {
  title: string
  subtitle: string
  description?: string
}

interface AboutStats {
  experience: string
  customers: string
  productsCount: string
  stores: string
}

interface ContactForm {
  success: string
  error: string
  sending: string
}

interface Location {
  title: string
  address: string
  directions: string
}

interface CommonTranslations {
  // Navigation
  home: string
  productsLink: string
  aboutLink: string
  aboutUs: string
  contactLink: string
  login: string
  register: string
  profile: string
  logout: string
  cart: string
  likes: string
  shopNow: string

  // Product Details
  featured: string
  freeShipping: string
  warranty: string
  returns: string
  brand: string
  category: string
  gender: string

  // Products Page
  ourProducts: string
  productsSubtitle: string
  allCategories: string
  allBrands: string
  allGenders: string
  sortBy: string
  nameAZ: string
  priceLowHigh: string
  priceHighLow: string
  featuredFirst: string
  clear: string
  search: string
  showing: string
  of: string
  products: string
  noProductsFound: string
  tryAdjusting: string
  clearAllFilters: string

  // Contact Page
  contactUs: string
  contactHeroText: string
  messageSent: string
  messageSentDesc: string
  sendMessage: string
  name: string
  monFri: string
  satSun: string
  closed: string
  address: string

  // Hero Sections
  homeHero: {
    title: string
    subtitle: string
    description: string
  }
  aboutHero: {
    title: string
    subtitle: string
    description: string
  }
  contactHero: {
    title: string
    subtitle: string
    description: string
  }
  productsHero: {
    title: string
    subtitle: string
  }

  // About Section
  aboutUsTitle: string
  aboutHeroText: string
  ourStory: string
  ourStoryDesc: string
  ourMission: string
  ourMissionDesc: string
  ourValues: string
  quality: string
  qualityDesc: string
  innovation: string
  innovationDesc: string
  customerFocus: string
  customerFocusDesc: string
  ourTeam: string
  ourTeamDesc: string
  callUs: string
  callUsDesc: string
  fullName: string
  email: string
  phone: string
  subject: string
  message: string
  send: string
  workingHours: string
  aboutStats: {
    experience: string
    customers: string
    productsCount: string
    stores: string
  }

  // Contact Section
  getInTouch: string
  contactInfo: string
  visitUs: string
  openingHours: string
  contactForm: {
    success: string
    error: string
    sending: string
  }
  location: {
    title: string
    address: string
    directions: string
  }

  // Products Section
  filterProducts: string
  sortProducts: string
  priceRange: string
  brandsFilter: string
  colors: string
  sizes: string
  materials: string
  clearFilters: string
  noProducts: string
  searchProducts: string
  featuredProductsTitle: string
  newArrivals: string
  popularBrands: string
  specialOffers: string
  trendingNow: string
  viewCollection: string
  exploreMore: string
  subscribeNewsletter: string
  subscribeDesc: string
  enterEmail: string
  subscribe: string
  premiumCollection: string

  // Footer
  newsletter: string
  aboutUsFooter: string
  productsFooter: string
  contactFooter: string
  privacyPolicy: string
  termsOfService: string

  // Common
  errorMessage: string
  orderError: string
  currency: string
  loginToAddCart: string

  // Checkout Page
  checkout: string
  orderSummary: string
  shippingInfo: string
  continueToPayment: string
  card: string
  cash: string
  cardholderName: string
  reviewOrder: string
  placingOrder: string
  placeOrder: string
  viewOrders: string
  back: string
  fillAllRequiredFields: string
  fillCardDetails: string
  cartEmpty: string
  cartEmptyDesc: string
  authRequiredMessage: string
  failedToLoadCart: string
  secureCheckout: string
  shipping: string
  tax: string
  free: string
  state: string
  zipCode: string
  saveAddress: string
  items: string
  orderConfirmed: string
  orderSuccess: string
  continueShopping: string
  paymentMethod: string

  // Additional translations
  city: string
  country: string
  cardNumber: string
  expiryDate: string
  cvv: string
  orderItems: string
  quantity: string
  subtotal: string
  total: string

  // Product Detail Page
  productNotFoundMessage: string
  outOfStockMessage: string
  productOutOfStock: string
  addedToCart: string
  addedToCartDesc: string
  failedToAddCart: string
  loginToLike: string
  failedToUpdateLike: string
  backToProductsList: string
  currencySymbol: string
  inStockStatus: string
  lowStockStatus: string
  itemsLeft: string
  quantityLabel: string
  addingStatus: string
  addToCartButton: string
  descriptionTab: string
  specificationsTab: string
  reviewsTab: string
  noReviewsYet: string
  beFirstReviewMessage: string
  availabilityLabel: string

  // About Page
  ceo: string
  designDirector: string
  marketingManager: string
  customerService: string
  foundingYear: string
  foundingDesc: string
  expansionYear: string
  expansionDesc: string
  onlineYear: string
  onlineDesc: string
  internationalYear: string
  internationalDesc: string
  storyParagraph1: string
  storyParagraph2: string
  storyParagraph3: string
  valuesSubtitle: string
  qualityValue: string
  customerValue: string
  excellenceValue: string
  excellenceDesc: string
  innovationValue: string
  teamSubtitle: string
  ourJourney: string
  journeySubtitle: string
  joinUs: string
  joinUsDesc: string

  // Contact Page Additional
  emailUs: string
  sending: string
  mapPlaceholder: string
  faq: string
  faqSubtitle: string
  faqQuestion1: string
  faqAnswer1: string
  faqQuestion2: string
  faqAnswer2: string
  faqQuestion3: string
  faqAnswer3: string
  faqQuestion4: string
  faqAnswer4: string

  // Home Page Additional
  featuredProducts: string
  featuredProductsDesc: string
  stayUpdated: string
  newsletterDesc: string
  premiumQuality: string
  premiumQualityDesc: string
  warrantyDesc: string
  freeShippingDesc: string
  support247: string
  supportDesc: string

  // Orders Page
  myOrders: string
  orders: string
  noOrders: string
  noOrdersDesc: string
  startShopping: string
  orderStatusCompleted: string
  orderStatusProcessing: string
  orderStatusShipping: string
  orderStatusPending: string
  failedToLoadOrders: string

  // Profile Page
  recentLikes: string
  likedProducts: string
  noLikedProducts: string
  exploreProducts: string

  // Cart and Orders
  cartSummary: string
  cartItems: string
  user: string
  buyurtma: string
  ordersDesc: string
  viewAllOrders: string
  accountSettings: string
  updateProfile: string
  emailCannotChange: string
}

const translations: Record<Language, CommonTranslations> = {
  uz: {
    // Navigation
    home: "Bosh sahifa",
    productsLink: "Mahsulotlar",
    aboutLink: "Biz haqimizda",
    aboutUs: "Biz haqimizda",
    contactLink: "Aloqa",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
    profile: "Profil",
    logout: "Chiqish",
    cart: "Savatcha",
    likes: "Yoqtirilganlar",
    shopNow: "Xarid qilishni boshlash",

    // Product Details
    featured: "Tavsiya etilgan",
    freeShipping: "Bepul yetkazib berish",
    warranty: "Kafolat",
    returns: "Qaytarish imkoniyatini",
    brand: "Brend",
    category: "Kategoriya",
    gender: "Jins",

    // Products Page
    ourProducts: "Bizning mahsulotlar",
    productsSubtitle: "Premium ko'zoynak va linzalar kolleksiyasi",
    allCategories: "Barcha kategoriyalar",
    allBrands: "Barcha brendlar",
    allGenders: "Barcha jinslar",
    sortBy: "Saralash",
    nameAZ: "Nom (A-Z)",
    priceLowHigh: "Narx (pastdan yuqoriga)",
    priceHighLow: "Narx (yuqoridan pastga)",
    featuredFirst: "Tavsiya etilganlar",
    clear: "Tozalash",
    search: "Qidirish",
    showing: "Ko'rsatilmoqda",
    of: "dan",
    products: "mahsulotlar",
    noProductsFound: "Mahsulotlar topilmadi",
    tryAdjusting: "Filtrlash parametrlarini o'zgartiring",
    clearAllFilters: "Barcha filtrlarni tozalash",

    // Contact Page
    contactUs: "Biz bilan bog'laning",
    contactHeroText: "Savollaringiz bormi? Biz yordam berishga tayyormiz",
    messageSent: "Xabar yuborildi",
    messageSentDesc: "Sizning xabaringiz muvaffaqiyatli yuborildi",
    sendMessage: "Xabar yuborish",
    name: "Ismingiz",
    monFri: "9:00 - 18:00",
    satSun: "10:00 - 16:00",
    closed: "Yakshanba: Yopiq",
    address: "Manzil",

    // Hero Sections
    homeHero: {
      title: "VisionVogue",
      subtitle: "Koleksiya modern ochqlar",
      description: "Premium ochqlar eng yaxshi brendlardan. Sizning ko'zlaringiz - bizning asosiy maqsadimiz."
    },
    aboutHero: {
      title: "Biz haqimizda",
      subtitle: "Ko'rish dunyosida sizning ishonchli hamkoringiz",
      description: "2020-yildan beri mijozlarimizga eng yaxshi ko'rish imkoniyatlarini taqdim etib kelmoqdamiz"
    },
    contactHero: {
      title: "Biz bilan bog'laning",
      subtitle: "Savollaringiz bormi? Biz yordam berishdan xursandmiz",
      description: "24/7 mijozlar xizmati va professional maslahatchilarimiz sizga yordam berishga tayyor"
    },
    productsHero: {
      title: "Mahsulotlar",
      subtitle: "Premium ko'zoynak va linzalar kolleksiyasi"
    },

    // About Section
    aboutUsTitle: "Bizning tarix",
    aboutHeroText: "VisionVogue 2020-yilda tashkil topgan bo'lib, zamonaviy ko'zoynak va linzalar sohasida yetakchi kompaniyaga aylandi. Biz mijozlarimizga eng yuqori sifatli mahsulotlarni taqdim etishga intilamiz.",
    ourStory: "Bizning tarix",
    ourStoryDesc: "VisionVogue 2020-yilda tashkil topgan bo'lib, zamonaviy ko'zoynak va linzalar sohasida yetakchi kompaniyaga aylandi. Biz mijozlarimizga eng yuqori sifatli mahsulotlarni taqdim etishga intilamiz.",
    ourMission: "Bizning vazifamiz",
    ourMissionDesc: "Har bir mijozga mukammal ko'rish va uslubni taqdim etish orqali hayot sifatini yaxshilash.",
    ourValues: "Bizning qadriyatlarimiz",
    quality: "Sifat",
    qualityDesc: "Faqat eng yaxshi brendlar va materiallardan foydalanamiz",
    innovation: "Innovatsiya",
    innovationDesc: "Eng so'nggi texnologiyalar va trendlarni kuzatib boramiz",
    customerFocus: "Mijozlarga e'tibor",
    customerFocusDesc: "Har bir mijozga individual yondashuv",
    ourTeam: "Bizning jamoa",
    ourTeamDesc: "Professional va tajribali mutaxassislar",
    callUs: "Bizga bog'laning",
    callUsDesc: "Biz bilan bog'laning va sizning savolingizga javob oling",
    fullName: "Ismingiz",
    email: "Email",
    phone: "Telefon raqam",
    subject: "Mavzu",
    message: "Xabar",
    send: "Yuborish",
    workingHours: "Dushanba - Shanba: 09:00 - 18:00",
    aboutStats: {
      experience: "Yillik tajriba",
      customers: "Mamnun mijozlar",
      productsCount: "Premium mahsulotlar",
      stores: "Filiallar"
    },

    // Contact Section
    getInTouch: "Bog'lanish",
    contactInfo: "Bog'lanish ma'lumotlari",
    visitUs: "Bizni tashrif buyuring",
    openingHours: "Ish vaqti",
    contactForm: {
      success: "Xabaringiz yuborildi!",
      error: "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
      sending: "Yuborilmoqda..."
    },
    location: {
      title: "Bizning manzil",
      address: "Toshkent shahri, Chilonzor tumani, 19-mavze",
      directions: "Yo'nalish olish"
    },

    // Products Section
    filterProducts: "Mahsulotlarni filtrlash",
    sortProducts: "Saralash",
    priceRange: "Narx oralig'i",
    brandsFilter: "Brendlar",
    colors: "Ranglar",
    sizes: "O'lchamlar",
    materials: "Materiallar",
    clearFilters: "Filtrlarni tozalash",
    noProducts: "Mahsulotlar topilmadi",
    searchProducts: "Mahsulotlarni qidirish",
    featuredProductsTitle: "Tavsiya etilgan mahsulotlar",
    newArrivals: "Yangi kelganlar",
    popularBrands: "Mashhur brendlar",
    specialOffers: "Maxsus takliflar",
    trendingNow: "Trend mahsulotlar",
    viewCollection: "Kolleksiyani ko'rish",
    exploreMore: "Ko'proq ko'rish",
    subscribeNewsletter: "Yangiliklardan xabardor bo'ling",
    subscribeDesc: "Eng so'nggi yangiliklar va maxsus takliflarni qabul qiling",
    enterEmail: "Emailingizni kiriting",
    subscribe: "Obuna bo'lish",
    premiumCollection: "Premium ko'zoynaklar kolleksiyasi",

    // Footer
    newsletter: "Yangiliklardan xabardor bo'ling",
    aboutUsFooter: "Biz haqimizda",
    productsFooter: "Mahsulotlar",
    contactFooter: "Bog'lanish",
    privacyPolicy: "Maxfiylik siyosati",
    termsOfService: "Shartlar va shartlar",

    // Common
    errorMessage: "Xatolik",
    orderError: "Buyurtmani amalga oshirishda xatolik yuz berdi",
    currency: "so'm",
    loginToAddCart: "Buyurtma berish uchun tizimga kiring",

    // Checkout Page
    checkout: "Buyurtma berish",
    orderSummary: "Buyurtma tafsilotlari",
    shippingInfo: "Yetkazib berish ma'lumotlari",
    continueToPayment: "To'lovga o'tish",
    card: "Bank kartasi",
    cash: "Naqd pul",
    cardholderName: "Karta egasining ismi",
    reviewOrder: "Buyurtmani ko'rib chiqish",
    placingOrder: "Buyurtma joylashtirilmoqda...",
    placeOrder: "Buyurtma berish",
    viewOrders: "Buyurtmalarni ko'rish",
    back: "Orqaga",
    fillAllRequiredFields: "Barcha majburiy maydonlarni to'ldiring",
    fillCardDetails: "Karta ma'lumotlarini to'ldiring",
    cartEmpty: "Savatcha bo'sh",
    cartEmptyDesc: "Savatchada mahsulotlar yo'q",
    authRequiredMessage: "Avtorizatsiya talab qilinadi",
    failedToLoadCart: "Savatcha ma'lumotlarini yuklashda xatolik",
    secureCheckout: "Xavfsiz to'lov",
    shipping: "Yetkazib berish",
    tax: "Soliq",
    free: "Bepul",
    state: "Viloyat",
    zipCode: "Pochta indeksi",
    saveAddress: "Bu manzilni keyingi safar uchun saqlash",
    items: "mahsulot",
    orderConfirmed: "Buyurtma tasdiqlandi",
    orderSuccess: "Buyurtmangiz muvaffaqiyatli amalga oshirildi",
    continueShopping: "Xarid qilishni davom ettirish",
    paymentMethod: "To'lov usuli",

    // Additional translations
    city: "Shahar",
    country: "Mamlakat",
    cardNumber: "Karta raqami",
    expiryDate: "Amal qilish muddati",
    cvv: "CVV",
    orderItems: "Buyurtma mahsulotlari",
    quantity: "Soni",
    subtotal: "Oraliq summa",
    total: "Jami",

    // Product Detail Page
    productNotFoundMessage: "Mahsulot topilmadi", 
    outOfStockMessage: "Omborda yo'q",
    productOutOfStock: "Kechirasiz, bu mahsulot hozirda mavjud emas",
    addedToCart: "Savatga qo'shildi",
    addedToCartDesc: "savatga muvaffaqiyatli qo'shildi",
    failedToAddCart: "Savatga qo'shib bo'lmadi",
    loginToLike: "Yoqtirish uchun tizimga kiring",
    failedToUpdateLike: "Yoqtirishni yangilab bo'lmadi",
    backToProductsList: "Mahsulotlarga qaytish",
    currencySymbol: "so'm",
    inStockStatus: "Mavjud",
    lowStockStatus: "Kam qoldi",
    itemsLeft: "dona qoldi",
    quantityLabel: "Soni",
    addingStatus: "Qo'shilmoqda...",
    addToCartButton: "Savatga qo'shish",
    descriptionTab: "Tavsif",
    specificationsTab: "Xususiyatlar",
    reviewsTab: "Sharhlar",
    noReviewsYet: "Hali sharhlar yo'q",
    beFirstReviewMessage: "Birinchi bo'lib sharh qoldiring",
    availabilityLabel: "Mavjudligi",

    // About Page
    ceo: "Bosh direktor",
    designDirector: "Dizayn direktori",
    marketingManager: "Marketing menejeri",
    customerService: "Mijozlar xizmati",
    foundingYear: "Tashkil topgan yil",
    foundingDesc: "VisionVogue tashkil topdi va o'z faoliyatini boshladi",
    expansionYear: "Kengayish yili",
    expansionDesc: "Yangi filiallar ochildi va mahsulotlar assortimenti kengaytirildi",
    onlineYear: "Onlayn savdo",
    onlineDesc: "Onlayn do'kon ishga tushirildi va yetkazib berish xizmati yo'lga qo'yildi",
    internationalYear: "Xalqaro hamkorlik",
    internationalDesc: "Xalqaro brendlar bilan hamkorlik o'rnatildi",
    storyParagraph1: "VisionVogue 2020-yilda tashkil topgan bo'lib, zamonaviy ko'zoynak va linzalar sohasida yetakchi kompaniyaga aylandi.",
    storyParagraph2: "Biz mijozlarimizga eng yuqori sifatli mahsulotlarni taqdim etishga intilamiz va har bir mijozga individual yondashamiz.",
    storyParagraph3: "Bizning maqsadimiz - har bir mijozga mukammal ko'rish va uslubni taqdim etish orqali hayot sifatini yaxshilash.",
    valuesSubtitle: "Bizning qadriyatlarimiz bizning faoliyatimizning asosini tashkil etadi",
    qualityValue: "Sifat",
    customerValue: "Mijozlarga e'tibor",
    excellenceValue: "Mukammallik",
    innovationValue: "Innovatsiya",
    teamSubtitle: "Professional va tajribali mutaxassislardan iborat jamoa",
    ourJourney: "Bizning yo'limiz",
    journeySubtitle: "VisionVogue tarixi",
    joinUs: "Bizga qo'shiling",
    joinUsDesc: "Premium ko'zoynak va linzalar dunyosini kashf eting",
    excellenceDesc: "Har bir mahsulot va xizmatda mukammallikka intilamiz",

    // Contact Page Additional
    emailUs: "Bizga yozing",
    sending: "Yuborilmoqda...",
    mapPlaceholder: "Xarita yuklanmoqda...",
    faq: "Ko'p so'raladigan savollar",
    faqSubtitle: "Sizda savol bormi? Javoblarni bu yerdan topishingiz mumkin",
    faqQuestion1: "Mahsulotlarni qaytarish mumkinmi?",
    faqAnswer1: "Ha, barcha mahsulotlarni 14 kun ichida qaytarishingiz mumkin",
    faqQuestion2: "Yetkazib berish qancha vaqt oladi?",
    faqAnswer2: "Toshkent bo'ylab 1-2 kun, viloyatlarga 2-5 kun",
    faqQuestion3: "To'lov usullari qanday?",
    faqAnswer3: "Naqd pul, bank kartasi va onlayn to'lov tizimlari orqali",
    faqQuestion4: "Kafolat mavjudmi?",
    faqAnswer4: "Barcha mahsulotlarga 1 yillik kafolat beriladi",

    // Home Page Additional
    featuredProducts: "Tanlangan mahsulotlar",
    featuredProductsDesc: "Eng mashhur va sifatli ko'zoynaklarimiz bilan tanishing",
    stayUpdated: "Yangiliklardan xabardor bo'ling",
    newsletterDesc: "Maxsus takliflar va yangi kolleksiyalar haqida birinchilardan bo'lib biling",
    premiumQuality: "Premium sifat",
    premiumQualityDesc: "Eng yaxshi brendlardan sifatli ko'zoynaklar",
    warrantyDesc: "Barcha mahsulotlarga 1 yillik kafolat",
    freeShippingDesc: "Toshkent bo'ylab bepul yetkazib berish",
    support247: "24/7 Qo'llab-quvvatlash",
    supportDesc: "Professional maslahatchilarimiz doimo yordam berishga tayyor",

    // Orders Page
    myOrders: "Mening buyurtmalarim",
    orders: "buyurtma",
    noOrders: "Buyurtmalar yo'q",
    noOrdersDesc: "Siz hali hech narsa buyurtma qilmagansiz",
    startShopping: "Xarid qilishni boshlash",
    orderStatusCompleted: "Bajarildi",
    orderStatusProcessing: "Qayta ishlanmoqda",
    orderStatusShipping: "Yetkazib berilmoqda",
    orderStatusPending: "Kutilmoqda",
    failedToLoadOrders: "Buyurtmalarni yuklashda xatolik yuz berdi",

    //profile
    recentLikes: "So'ngi yoqtirilganlar",
    likedProducts: "Yoqtirilgan mahsulotlar",
    noLikedProducts: "Yoqtirilgan mahsulotlar yo'q",
    exploreProducts: "Ko'prok ko'rish",

    // Cart and Orders
    cartSummary: "Savat ma'lumotlari",
    cartItems: "Savat mahsulotlari",
    user: "Foydalanuvchi",
    buyurtma: "Buyurtma",
    ordersDesc: "Sizning barcha buyurtmalaringiz",
    viewAllOrders: "Barcha buyurtmalarni ko'rish",
    accountSettings: "Profil sozlamalari",
    updateProfile: "Profilni yangilash",
    emailCannotChange: "Email manzilni o'zgartirib bo'lmaydi",
  },
  ru: {
    // Navigation
    home: "Главная",
    productsLink: "Товары",
    aboutLink: "О нас",
    aboutUs: "О нас",
    contactLink: "Контакты",
    login: "Войти",
    register: "Регистрация",
    profile: "Профиль",
    logout: "Выйти",
    cart: "Корзина",
    likes: "Избранное",
    shopNow: "Купить сейчас",

    // Product Details
    featured: "Рекомендуемые",
    freeShipping: "Бесплатная доставка",
    warranty: "Гарантия",
    returns: "Возврат",
    brand: "Бренд",
    category: "Категория",
    gender: "Пол",

    // Products Page
    ourProducts: "Наши товары",
    productsSubtitle: "Коллекция премиальных очков и линз",
    allCategories: "Все категории",
    allBrands: "Все бренды",
    allGenders: "Все пол",
    sortBy: "Сортировать",
    nameAZ: "Имя (А-Я)",
    priceLowHigh: "Цена (по возрастанию)",
    priceHighLow: "Цена (по убыванию)",
    featuredFirst: "Рекомендуемые",
    clear: "Очистить",
    search: "Поиск",
    showing: "Показано",
    of: "из",
    products: "товаров",
    noProductsFound: "Товары не найдены",
    tryAdjusting: "Попробуйте изменить параметры фильтрации",
    clearAllFilters: "Очистить все фильтры",

    // Contact Page
    contactUs: "Свяжитесь с нами",
    contactHeroText: "Есть вопросы? Мы готовы помочь",
    messageSent: "Сообщение отправлено",
    messageSentDesc: "Ваше сообщение успешно отправлено",
    sendMessage: "Отправить сообщение",
    name: "Ваше имя",
    monFri: "9:00 - 18:00",
    satSun: "10:00 - 16:00",
    closed: "Воскресенье: Закрыто",
    address: "Адрес",

    // Hero Sections
    homeHero: {
      title: "VisionVogue",
      subtitle: "Коллекция современных очков",
      description: "Премиальные очки от лучших брендов. Ваши глаза - наш главный приоритет."
    },
    aboutHero: {
      title: "О нас",
      subtitle: "Ваш надежный партнер в мире зрения",
      description: "С 2020 года мы предоставляем нашим клиентам лучшие возможности для зрения"
    },
    contactHero: {
      title: "Свяжитесь с нами",
      subtitle: "Есть вопросы? Мы рады помочь",
      description: "Служба поддержки клиентов 24/7 и наши профессиональные консультанты готовы помочь вам"
    },
    productsHero: {
      title: "Товары",
      subtitle: "Коллекция премиальных очков и линз"
    },

    // About Section
    aboutUsTitle: "Наша история",
    aboutHeroText: "VisionVogue, основанная в 2020 году, стала ведущей компанией в области современных очков и линз. Мы стремимся предоставлять нашим клиентам продукцию высочайшего качества.",
    ourStory: "Наша история",
    ourStoryDesc: "VisionVogue, основанная в 2020 году, стала ведущей компанией в области современных очков и линз. Мы стремимся предоставлять нашим клиентам продукцию высочайшего качества.",
    ourMission: "Наша миссия",
    ourMissionDesc: "Улучшать качество жизни, предоставляя идеальное зрение и стиль каждому клиенту.",
    ourValues: "Наши ценности",
    quality: "Качество",
    qualityDesc: "Мы используем только лучшие бренды и материалы",
    innovation: "Инновации",
    innovationDesc: "Мы следим за последними технологиями и трендами",
    customerFocus: "Фокус на клиента",
    customerFocusDesc: "Индивидуальный подход к каждому клиенту",
    ourTeam: "Наша команда",
    ourTeamDesc: "Профессиональные и опытные специалисты",
    callUs: "Свяжитесь с нами",
    callUsDesc: "Свяжитесь с нами и получите ответ на ваш вопрос",
    fullName: "Ваше имя",
    email: "Электронная почта",
    phone: "Телефон",
    subject: "Тема",
    message: "Сообщение",
    send: "Отправить",
    workingHours: "Понедельник - Суббота: 09:00 - 18:00",
    aboutStats: {
      experience: "Лет опыта",
      customers: "Довольных клиентов",
      productsCount: "Премиум товаров",
      stores: "Филиалов"
    },

    // Contact Section
    getInTouch: "Связаться",
    contactInfo: "Контактная информация",
    visitUs: "Посетите нас",
    openingHours: "Часы работы",
    contactForm: {
      success: "Ваше сообщение отправлено!",
      error: "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
      sending: "Отправка..."
    },
    location: {
      title: "Наш адрес",
      address: "г. Ташкент, Чиланзарский район, 19-квартал",
      directions: "Построить маршрут"
    },

    // Products Section
    filterProducts: "Фильтровать товары",
    sortProducts: "Сортировать",
    priceRange: "Ценовой диапазон",
    brandsFilter: "Бренды",
    colors: "Цвета",
    sizes: "Размеры",
    materials: "Материалы",
    clearFilters: "Очистить фильтры",
    noProducts: "Товары не найдены",
    searchProducts: "Поиск товаров",
    featuredProductsTitle: "Рекомендуемые товары",
    newArrivals: "Новые поступления",
    popularBrands: "Популярные бренды",
    specialOffers: "Специальные предложения",
    trendingNow: "В тренде",
    viewCollection: "Смотреть коллекцию",
    exploreMore: "Узнать больше",
    subscribeNewsletter: "Подпишитесь на новости",
    subscribeDesc: "Получайте последние новости и специальные предложения",
    enterEmail: "Введите ваш email",
    subscribe: "Подписаться",
    premiumCollection: "Коллекция премиальных очков",

    // Footer
    newsletter: "Подпишитесь на новости",
    aboutUsFooter: "О нас",
    productsFooter: "Товары",
    contactFooter: "Контакты",
    privacyPolicy: "Политика конфиденциальности",
    termsOfService: "Условия использования",

    // Common
    errorMessage: "Ошибка",
    orderError: "Произошла ошибка при оформлении заказа",
    currency: "сум",
    loginToAddCart: "Войдите для оформления заказа",

    // Checkout Page
    checkout: "Оформление заказа",
    orderSummary: "Детали заказа",
    shippingInfo: "Информация о доставке",
    continueToPayment: "Перейти к оплате",
    card: "Банковская карта",
    cash: "Наличные",
    cardholderName: "Имя владельца карты",
    reviewOrder: "Просмотр заказа",
    placingOrder: "Размещение заказа...",
    placeOrder: "Разместить заказ",
    viewOrders: "Посмотреть заказы",
    back: "Назад",
    fillAllRequiredFields: "Заполните все обязательные поля",
    fillCardDetails: "Заполните данные карты",
    cartEmpty: "Корзина пуста",
    cartEmptyDesc: "В корзине нет товаров",
    authRequiredMessage: "Требуется авторизация",
    failedToLoadCart: "Ошибка загрузки корзины",
    secureCheckout: "Безопасная оплата",
    shipping: "Доставка",
    tax: "Налог",
    free: "Бесплатно",
    state: "Область",
    zipCode: "Почтовый индекс",
    saveAddress: "Сохранить этот адрес для следующего раза",
    items: "товар(ов)",
    orderConfirmed: "Заказ подтвержден",
    orderSuccess: "Заказ успешно размещен",
    continueShopping: "Продолжить покупки",
    paymentMethod: "Способ оплаты",

    // Additional translations
    city: "Город",
    country: "Страна",
    cardNumber: "Номер карты",
    expiryDate: "Срок действия",
    cvv: "CVV",
    orderItems: "Товары в заказе",
    quantity: "Количество",
    subtotal: "Подытог",
    total: "Итого",

    // Product Detail Page
    productNotFoundMessage: "Товар не найден",
    outOfStockMessage: "Нет в наличии",
    productOutOfStock: "Извините, этот товар сейчас недоступен",
    addedToCart: "Добавлено в корзину",
    addedToCartDesc: "успешно добавлен в корзину",
    failedToAddCart: "Не удалось добавить в корзину",
    loginToLike: "Войдите, чтобы добавить в избранное",
    failedToUpdateLike: "Не удалось обновить избранное",
    backToProductsList: "Вернуться к товарам",
    currencySymbol: "сум",
    inStockStatus: "В наличии",
    lowStockStatus: "Заканчивается",
    itemsLeft: "осталось",
    quantityLabel: "Количество",
    addingStatus: "Добавление...",
    addToCartButton: "Добавить в корзину",
    descriptionTab: "Описание",
    specificationsTab: "Характеристики",
    reviewsTab: "Отзывы",
    noReviewsYet: "Пока нет отзывов",
    beFirstReviewMessage: "Будьте первым, кто оставит отзыв",
    availabilityLabel: "Наличие",

    // About Page
    ceo: "Генеральный директор",
    designDirector: "Директор по дизайну",
    marketingManager: "Менеджер по маркетингу",
    customerService: "Служба поддержки",
    foundingYear: "Год основания",
    foundingDesc: "VisionVogue был основан и начал свою деятельность",
    expansionYear: "Год расширения",
    expansionDesc: "Открыты новые филиалы и расширен ассортимент продукции",
    onlineYear: "Онлайн торговля",
    onlineDesc: "Запущен онлайн магазин и служба доставки",
    internationalYear: "Международное сотрудничество",
    internationalDesc: "Установлено сотрудничество с международными брендами",
    storyParagraph1: "VisionVogue, основанная в 2020 году, стала ведущей компанией в области современных очков и линз.",
    storyParagraph2: "Мы стремимся предоставлять нашим клиентам продукцию высочайшего качества и индивидуальный подход к каждому клиенту.",
    storyParagraph3: "Наша цель - улучшать качество жизни, предоставляя идеальное зрение и стиль каждому клиенту.",
    valuesSubtitle: "Наши ценности составляют основу нашей деятельности",
    qualityValue: "Качество",
    customerValue: "Фокус на клиента",
    excellenceValue: "Совершенство",
    innovationValue: "Инновации",
    teamSubtitle: "Команда профессиональных и опытных специалистов",
    ourJourney: "Наш путь",
    journeySubtitle: "История VisionVogue",
    joinUs: "Присоединяйтесь к нам",
    joinUsDesc: "Откройте для себя мир премиальных очков и линз",
    excellenceDesc: "Стремимся к совершенству в каждом продукте и услуге",

    // Contact Page Additional
    emailUs: "Напишите нам",
    sending: "Отправка...",
    mapPlaceholder: "Загрузка карты...",
    faq: "Часто задаваемые вопросы",
    faqSubtitle: "У вас есть вопросы? Найдите ответы здесь",
    faqQuestion1: "Возможен ли возврат товара?",
    faqAnswer1: "Да, вы можете вернуть товар в течение 14 дней",
    faqQuestion2: "Сколько времени занимает доставка?",
    faqAnswer2: "По Ташкенту 1-2 дня, по регионам 2-5 дней",
    faqQuestion3: "Какие способы оплаты?",
    faqAnswer3: "Наличные, банковская карта и онлайн платежные системы",
    faqQuestion4: "Есть ли гарантия?",
    faqAnswer4: "На все товары предоставляется гарантия 1 год",

    // Home Page Additional
    featuredProducts: "Рекомендуемые товары",
    featuredProductsDesc: "Познакомьтесь с нашими самыми популярными и качественными очками",
    stayUpdated: "Будьте в курсе",
    newsletterDesc: "Узнавайте первыми о специальных предложениях и новых коллекциях",
    premiumQuality: "Премиум качество",
    premiumQualityDesc: "Качественные очки от лучших брендов",
    warrantyDesc: "Гарантия 1 год на все товары",
    freeShippingDesc: "Бесплатная доставка по Ташкенту",
    support247: "Поддержка 24/7",
    supportDesc: "Наши профессиональные консультанты всегда готовы помочь",

    // Orders Page
    myOrders: "Мои заказы",
    orders: "заказ(ов)",
    noOrders: "Нет заказов",
    noOrdersDesc: "Вы еще ничего не заказали",
    startShopping: "Начать покупки",
    orderStatusCompleted: "Выполнен",
    orderStatusProcessing: "Обрабатывается",
    orderStatusShipping: "Доставляется",
    orderStatusPending: "Ожидает",
    failedToLoadOrders: "Не удалось загрузить заказы",
    recentLikes: "Недавно понравившиеся",
    likedProducts: "Понравившиеся товары",
    noLikedProducts: "Нет понравившихся товаров",
    exploreProducts: "Посмотреть больше",

    // Cart and Orders
    cartSummary: "Информация о корзине",
    cartItems: "Товары в корзине",
    user: "Пользователь",
    buyurtma: "Заказ",
    ordersDesc: "Все ваши заказы",
    viewAllOrders: "Посмотреть все заказы",
    accountSettings: "Настройки профиля",
    updateProfile: "Обновить профиль",
    emailCannotChange: "Email нельзя изменить",
  },
  en: {
    // Navigation
    home: "Home",
    productsLink: "Products",
    aboutLink: "About",
    aboutUs: "About Us",
    contactLink: "Contact",
    login: "Login",
    register: "Register",
    profile: "Profile",
    logout: "Logout",
    cart: "Cart",
    likes: "Favorites",
    shopNow: "Shop Now",

    // Product Details
    featured: "Featured",
    freeShipping: "Free Shipping",
    warranty: "Warranty",
    returns: "Returns",
    brand: "Brand",
    category: "Category",
    gender: "Gender",

    // Products Page
    ourProducts: "Our Products",
    productsSubtitle: "Premium Eyewear and Lens Collection",
    allCategories: "All Categories",
    allBrands: "All Brands",
    allGenders: "All Genders",
    sortBy: "Sort By",
    nameAZ: "Name (A-Z)",
    priceLowHigh: "Price (Low to High)",
    priceHighLow: "Price (High to Low)",
    featuredFirst: "Featured First",
    clear: "Clear",
    search: "Search",
    showing: "Showing",
    of: "of",
    products: "products",
    noProductsFound: "No Products Found",
    tryAdjusting: "Try adjusting your filters",
    clearAllFilters: "Clear All Filters",

    // Contact Page
    contactUs: "Contact Us",
    contactHeroText: "Have questions? We're here to help",
    messageSent: "Message Sent",
    messageSentDesc: "Your message has been sent successfully",
    sendMessage: "Send Message",
    name: "Your Name",
    monFri: "9:00 - 18:00",
    satSun: "10:00 - 16:00",
    closed: "Sunday: Closed",
    address: "Address",

    // Hero Sections
    homeHero: {
      title: "VisionVogue",
      subtitle: "Modern Eyewear Collection",
      description: "Premium eyewear from the best brands. Your eyes are our top priority."
    },
    aboutHero: {
      title: "About Us",
      subtitle: "Your Trusted Partner in Vision",
      description: "Since 2020, we've been providing our customers with the best vision solutions"
    },
    contactHero: {
      title: "Contact Us",
      subtitle: "Have questions? We're happy to help",
      description: "24/7 customer service and our professional consultants are ready to help you"
    },
    productsHero: {
      title: "Products",
      subtitle: "Premium Eyewear and Lens Collection"
    },

    // About Section
    aboutUsTitle: "Our Story",
    aboutHeroText: "VisionVogue, founded in 2020, has become a leading company in modern eyewear and lenses. We strive to provide our customers with the highest quality products.",
    ourStory: "Our Story",
    ourStoryDesc: "VisionVogue, founded in 2020, has become a leading company in modern eyewear and lenses. We strive to provide our customers with the highest quality products.",
    ourMission: "Our Mission",
    ourMissionDesc: "To improve quality of life by providing perfect vision and style to every customer.",
    ourValues: "Our Values",
    quality: "Quality",
    qualityDesc: "We use only the best brands and materials",
    innovation: "Innovation",
    innovationDesc: "We keep up with the latest technologies and trends",
    customerFocus: "Customer Focus",
    customerFocusDesc: "Individual approach to each customer",
    ourTeam: "Our Team",
    ourTeamDesc: "Professional and experienced specialists",
    callUs: "Call Us",
    callUsDesc: "Contact us and get an answer to your question",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    subject: "Subject",
    message: "Message",
    send: "Send",
    workingHours: "Monday - Saturday: 09:00 - 18:00",
    aboutStats: {
      experience: "Years of Experience",
      customers: "Happy Customers",
      productsCount: "Premium Products",
      stores: "Stores"
    },

    // Contact Section
    getInTouch: "Get in Touch",
    contactInfo: "Contact Information",
    visitUs: "Visit Us",
    openingHours: "Opening Hours",
    contactForm: {
      success: "Your message has been sent!",
      error: "An error occurred. Please try again.",
      sending: "Sending..."
    },
    location: {
      title: "Our Location",
      address: "Tashkent city, Chilanzar district, Block 19",
      directions: "Get Directions"
    },

    // Products Section
    filterProducts: "Filter Products",
    sortProducts: "Sort",
    priceRange: "Price Range",
    brandsFilter: "Brands",
    colors: "Colors",
    sizes: "Sizes",
    materials: "Materials",
    clearFilters: "Clear Filters",
    noProducts: "No Products Found",
    searchProducts: "Search Products",
    featuredProductsTitle: "Featured Products",
    newArrivals: "New Arrivals",
    popularBrands: "Popular Brands",
    specialOffers: "Special Offers",
    trendingNow: "Trending Now",
    viewCollection: "View Collection",
    exploreMore: "Explore More",
    subscribeNewsletter: "Subscribe to Newsletter",
    subscribeDesc: "Get the latest news and special offers",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",
    premiumCollection: "Premium Eyewear Collection",

    // Footer
    newsletter: "Newsletter",
    aboutUsFooter: "About Us",
    productsFooter: "Products",
    contactFooter: "Contact",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",

    // Common
    errorMessage: "Error",
    orderError: "An error occurred while placing your order",
    currency: "sum",
    loginToAddCart: "Login to place order",

    // Checkout Page
    checkout: "Checkout",
    orderSummary: "Order Summary",
    shippingInfo: "Shipping Information",
    continueToPayment: "Continue to Payment",
    card: "Credit Card",
    cash: "Cash",
    cardholderName: "Cardholder Name",
    reviewOrder: "Review Order",
    placingOrder: "Placing Order...",
    placeOrder: "Place Order",
    viewOrders: "View Orders",
    back: "Back",
    fillAllRequiredFields: "Please fill all required fields",
    fillCardDetails: "Please fill card details",
    cartEmpty: "Cart is Empty",
    cartEmptyDesc: "Your cart is empty",
    authRequiredMessage: "Authentication Required",
    failedToLoadCart: "Failed to load cart",
    secureCheckout: "Secure Checkout",
    shipping: "Shipping",
    tax: "Tax",
    free: "Free",
    state: "State",
    zipCode: "ZIP Code",
    saveAddress: "Save this address for next time",
    items: "items",
    orderConfirmed: "Order Confirmed",
    orderSuccess: "Your order has been placed successfully",
    continueShopping: "Continue Shopping",
    paymentMethod: "Payment Method",

    // Additional translations
    city: "City",
    country: "Country",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    cvv: "CVV",
    orderItems: "Order Items",
    quantity: "Quantity",
    subtotal: "Subtotal",
    total: "Total",

    // Product Detail Page
    productNotFoundMessage: "Product Not Found",
    outOfStockMessage: "Out of Stock",
    productOutOfStock: "Sorry, this product is currently unavailable",
    addedToCart: "Added to Cart",
    addedToCartDesc: "successfully added to cart",
    failedToAddCart: "Failed to add to cart",
    loginToLike: "Login to like",
    failedToUpdateLike: "Failed to update like",
    backToProductsList: "Back to Products",
    currencySymbol: "sum",
    inStockStatus: "In Stock",
    lowStockStatus: "Low Stock",
    itemsLeft: "items left",
    quantityLabel: "Quantity",
    addingStatus: "Adding...",
    addToCartButton: "Add to Cart",
    descriptionTab: "Description",
    specificationsTab: "Specifications",
    reviewsTab: "Reviews",
    noReviewsYet: "No Reviews Yet",
    beFirstReviewMessage: "Be the first to review",
    availabilityLabel: "Availability",

    // About Page
    ceo: "CEO",
    designDirector: "Design Director",
    marketingManager: "Marketing Manager",
    customerService: "Customer Service",
    foundingYear: "Founding Year",
    foundingDesc: "VisionVogue was founded and started operations",
    expansionYear: "Expansion Year",
    expansionDesc: "New stores opened and product range expanded",
    onlineYear: "Online Store",
    onlineDesc: "Online store launched and delivery service established",
    internationalYear: "International Partnership",
    internationalDesc: "Partnerships established with international brands",
    storyParagraph1: "VisionVogue, founded in 2020, has become a leading company in modern eyewear and lenses.",
    storyParagraph2: "We strive to provide our customers with the highest quality products and individual approach to each customer.",
    storyParagraph3: "Our goal is to improve quality of life by providing perfect vision and style to every customer.",
    valuesSubtitle: "Our values form the foundation of our operations",
    qualityValue: "Quality",
    customerValue: "Customer Focus",
    excellenceValue: "Excellence",
    innovationValue: "Innovation",
    teamSubtitle: "Team of professional and experienced specialists",
    ourJourney: "Our Journey",
    journeySubtitle: "VisionVogue History",
    joinUs: "Join Us",
    joinUsDesc: "Discover the world of premium eyewear and lenses",
    excellenceDesc: "Striving for excellence in every product and service",

    // Contact Page Additional
    emailUs: "Email Us",
    sending: "Sending...",
    mapPlaceholder: "Loading map...",
    faq: "Frequently Asked Questions",
    faqSubtitle: "Have questions? Find answers here",
    faqQuestion1: "Can I return products?",
    faqAnswer1: "Yes, you can return products within 14 days",
    faqQuestion2: "How long does delivery take?",
    faqAnswer2: "1-2 days in Tashkent, 2-5 days for regions",
    faqQuestion3: "What are the payment methods?",
    faqAnswer3: "Cash, bank card, and online payment systems",
    faqQuestion4: "Is there a warranty?",
    faqAnswer4: "All products come with a 1-year warranty",

    // Home Page Additional
    featuredProducts: "Featured Products",
    featuredProductsDesc: "Discover our most popular and quality eyewear",
    stayUpdated: "Stay Updated",
    newsletterDesc: "Be the first to know about special offers and new collections",
    premiumQuality: "Premium Quality",
    premiumQualityDesc: "Quality eyewear from the best brands",
    warrantyDesc: "1-year warranty on all products",
    freeShippingDesc: "Free shipping in Tashkent",
    support247: "24/7 Support",
    supportDesc: "Our professional consultants are always ready to help",

    // Orders Page
    myOrders: "My Orders",
    orders: "orders",
    noOrders: "No Orders",
    noOrdersDesc: "You haven't placed any orders yet",
    startShopping: "Start Shopping",
    orderStatusCompleted: "Completed",
    orderStatusProcessing: "Processing",
    orderStatusShipping: "Shipping",
    orderStatusPending: "Pending",
    failedToLoadOrders: "Failed to load orders",
    recentLikes: "Recent Likes",
    likedProducts: "Liked Products",
    noLikedProducts: "No Liked Products",
    exploreProducts: "Explore More",

    // Cart and Orders
    cartSummary: "Cart Summary",
    cartItems: "Cart Items",
    user: "User",
    buyurtma: "Order",
    ordersDesc: "All your orders",
    viewAllOrders: "View All Orders",
    accountSettings: "Account Settings",
    updateProfile: "Update Profile",
    emailCannotChange: "Email cannot be changed",
  }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof CommonTranslations) => string | TranslationHero | AboutStats | ContactForm | Location
  tString: (key: keyof CommonTranslations) => string
  isTranslationHero: (value: any) => value is TranslationHero
  isAboutStats: (value: any) => value is AboutStats
  isContactForm: (value: any) => value is ContactForm
  isLocation: (value: any) => value is Location
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("uz")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["uz", "ru", "en"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const isTranslationHero = (value: any): value is TranslationHero => {
    return value && typeof value === "object" && "title" in value && "subtitle" in value
  }

  const isAboutStats = (value: any): value is AboutStats => {
  return (
      value &&
      typeof value === "object" &&
      "experience" in value &&
      "customers" in value &&
      "productsCount" in value &&
      "stores" in value
    )
  }

  const isContactForm = (value: any): value is ContactForm => {
    return value && typeof value === "object" && "success" in value && "error" in value && "sending" in value
  }

  const isLocation = (value: any): value is Location => {
    return value && typeof value === "object" && "title" in value && "address" in value && "directions" in value
  }

  const t = (key: keyof CommonTranslations) => {
    return translations[language][key]
  }

  const tString = (key: keyof CommonTranslations): string => {
    const value = t(key)
    if (typeof value === "string") return value
    if (isTranslationHero(value)) return value.title
    if (isAboutStats(value)) return value.experience
    if (isContactForm(value)) return value.success
    if (isLocation(value)) return value.title
    return key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        tString,
        isTranslationHero,
        isAboutStats,
        isContactForm,
        isLocation,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
