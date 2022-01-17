import { zeroLeft } from "./zero-left"

export function secondsToMinutes(seconds: number): string{
    const minutagem = zeroLeft((seconds / 60) % 60)
    const segundos = zeroLeft((seconds % 60) % 60)
    return `${minutagem}:${segundos}`
}