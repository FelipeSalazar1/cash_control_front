export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: Category;
}

export enum Category {
  FUN = 'FUN',
  FOOD = 'FOOD',
  MEMBERSHIP = 'MEMBERSHIP',
  CAR = 'CAR',
  GIFT = 'GIFT'
}

