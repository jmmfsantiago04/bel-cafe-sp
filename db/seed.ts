import { config } from "dotenv"
import { resolve } from "path"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

config({ path: resolve(process.cwd(), ".env.local") })
config()

const url = process.env.DATABASE_URL
if (!url) {
  throw new Error("DATABASE_URL is not set")
}

const sql = neon(url)
const db = drizzle(sql, { schema })

async function seed() {
  console.log("Seeding É de Chão…")

  // Categories (sidebar)
  const categories = [
    { name: "Café da Manhã", slug: "cafe-manha", type: "menu", flag: "isCafeDaManha", displayOrder: 1 },
    { name: "Almoço", slug: "almoco", type: "menu", flag: "isAlmoco", displayOrder: 2 },
    { name: "Jantar", slug: "jantar", type: "menu", flag: "isJantar", displayOrder: 3 },
    { name: "Salgados", slug: "salgados", type: "menu", flag: "isSalgado", displayOrder: 4 },
    { name: "Doces", slug: "doces", type: "menu", flag: "isDoce", displayOrder: 5 },
    { name: "Sobremesas", slug: "sobremesas", type: "menu", flag: "isSobremesa", displayOrder: 6 },
    { name: "Bebidas Quentes", slug: "bebidas-quentes", type: "drink", flag: "isBebidasQuentes", displayOrder: 7 },
    { name: "Bebidas Frias", slug: "bebidas-frias", type: "drink", flag: "isBebidasFrias", displayOrder: 8 },
  ]

  // Clear existing demo data carefully: only wipe menu-related seed tables
  await db.delete(schema.menuItems)
  await db.delete(schema.drinks)
  await db.delete(schema.menuCategories)

  for (const cat of categories) {
    await db.insert(schema.menuCategories).values({
      ...cat,
      isActive: true,
    })
  }
  await db.insert(schema.menuItems).values([
    {
      name: "Cuscuz Nordestino",
      description: "Cuscuz com manteiga de garrafa, queijo coalho e ovo",
      price: "28.90",
      isCafeDaManha: true,
      isAvailable: true,
      isPopular: true,
      isVegetarian: true,
    },
    {
      name: "Tapioca de Carne de Sol",
      description: "Tapioca recheada com carne de sol e queijo",
      price: "24.90",
      isCafeDaManha: true,
      isAvailable: true,
      isPopular: true,
    },
    {
      name: "Pão de Queijo da Casa",
      description: "Porção com 6 unidades, quentinhos do forno",
      price: "18.90",
      isCafeDaManha: true,
      isSalgado: true,
      isAvailable: true,
      isVegetarian: true,
      isGlutenFree: true,
    },
    {
      name: "Baião de Dois",
      description: "Arroz, feijão-de-corda, queijo coalho e carne seca",
      price: "42.90",
      isAlmoco: true,
      isJantar: true,
      isAvailable: true,
      isPopular: true,
    },
    {
      name: "Moqueca de Peixe",
      description: "Peixe fresco no leite de coco com dendê e pirão",
      price: "58.90",
      isAlmoco: true,
      isJantar: true,
      isAvailable: true,
      isPopular: true,
    },
    {
      name: "Escondidinho de Carne Seca",
      description: "Purê de mandioca gratinado com carne seca",
      price: "46.90",
      isAlmoco: true,
      isJantar: true,
      isAvailable: true,
    },
    {
      name: "Coxinha de Frango",
      description: "Coxinha crocante com recheio cremoso",
      price: "12.90",
      isSalgado: true,
      isAvailable: true,
      isPopular: true,
    },
    {
      name: "Pastel de Queijo",
      description: "Pastel frito na hora com queijo derretido",
      price: "14.90",
      isSalgado: true,
      isAvailable: true,
      isVegetarian: true,
    },
    {
      name: "Brigadeiro de Colher",
      description: "Brigadeiro cremoso com granulado belga",
      price: "16.90",
      isDoce: true,
      isSobremesa: true,
      isAvailable: true,
      isVegetarian: true,
    },
    {
      name: "Cartola",
      description: "Banana frita com queijo coalho e canela",
      price: "22.90",
      isDoce: true,
      isSobremesa: true,
      isAvailable: true,
      isPopular: true,
      isVegetarian: true,
    },
    {
      name: "Pudim de Leite",
      description: "Pudim clássico com calda de caramelo",
      price: "18.90",
      isSobremesa: true,
      isAvailable: true,
      isVegetarian: true,
    },
    {
      name: "Bolo de Rolo",
      description: "Fatia de bolo de rolo pernambucano com goiabada",
      price: "15.90",
      isDoce: true,
      isAvailable: true,
      isVegetarian: true,
    },
  ])

  await db.insert(schema.drinks).values([
    {
      name: "Café Espresso",
      description: "Shot intenso de café especial",
      price: "8.90",
      isHotDrink: true,
      isAvailable: true,
      isPopular: true,
      isVegan: true,
      hasSize: true,
      mediumSizePrice: "10.90",
      largeSizePrice: "12.90",
    },
    {
      name: "Cappuccino",
      description: "Espresso com leite vaporizado e espuma",
      price: "14.90",
      isHotDrink: true,
      isAvailable: true,
      isPopular: true,
      isVegetarian: true,
      hasSize: true,
      mediumSizePrice: "16.90",
      largeSizePrice: "18.90",
    },
    {
      name: "Chocolate Quente",
      description: "Chocolate belga cremoso",
      price: "16.90",
      isHotDrink: true,
      isAvailable: true,
      isVegetarian: true,
      hasSize: true,
      mediumSizePrice: "18.90",
      largeSizePrice: "20.90",
    },
    {
      name: "Suco de Maracujá",
      description: "Natural, feito na hora",
      price: "14.90",
      isHotDrink: false,
      isAvailable: true,
      isPopular: true,
      isVegan: true,
      hasSize: true,
      mediumSizePrice: "16.90",
      largeSizePrice: "18.90",
    },
    {
      name: "Água de Coco",
      description: "Gelada e natural",
      price: "12.90",
      isHotDrink: false,
      isAvailable: true,
      isVegan: true,
      hasSize: false,
    },
    {
      name: "Limonada Suíça",
      description: "Limão, leite condensado e gelo",
      price: "15.90",
      isHotDrink: false,
      isAvailable: true,
      isVegetarian: true,
      hasSize: true,
      mediumSizePrice: "17.90",
      largeSizePrice: "19.90",
    },
  ])

  // General business hours for home ContactSection / StoreStatus
  await db.delete(schema.businessHours)
  await db.insert(schema.businessHours).values({
    period: "geral",
    weekdays: "Terça a Domingo",
    openTime: "07:00",
    closeTime: "22:00",
    isActive: true,
    isGeneralHours: true,
  })

  await db.delete(schema.storeStatus)
  await db.insert(schema.storeStatus).values({
    isOpen: true,
    reason: null,
    reopenDate: null,
  })

  console.log("Seed complete: menu items, drinks, categories, hours.")
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
