import { clsx, ClassValue } from 'clsx'
import ShortUniqueId from 'short-unique-id'
import { twMerge } from 'tailwind-merge'

export default function cn(...classNames: ClassValue[]): string {
  return twMerge(clsx(classNames))
}

export function generateUUID(length = 8): string {
  const generator = new ShortUniqueId()
  return generator(length)
}
