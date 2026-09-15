export type DrinkType = 'Espresso' | 'Cappuccino' | 'Latte' | 'Mocha' | 'Cold Brew' | 'Cà phê sữa' | 'Cà phê đá'
export type DifficultyLevel = 'Dễ' | 'Trung bình' | 'Khó'

export interface Ingredient {
  name: string
  amount: string
}

export interface Tool {
  name: string
  description: string
}

export interface Step {
  number: number
  title: string
  description: string
  image?: string
  tips?: string[]
}

export interface BrewingGuide {
  id: string
  title: string
  description: string
  image: string
  brewTime: string
  difficulty: DifficultyLevel
  drinkType: DrinkType
  postedDate: string
  ingredients: Ingredient[]
  tools: Tool[]
  steps: Step[]
  videoUrl: string
  tips: string[]
  relatedGuides: string[]
}

export interface BrewingGuideCard {
  id: string
  title: string
  description: string
  image: string
  brewTime: string
  difficulty: DifficultyLevel
  drinkType: DrinkType
  postedDate: string
}
