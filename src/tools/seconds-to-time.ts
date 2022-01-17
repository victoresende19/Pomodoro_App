import { zeroLeft } from "./zero-left"

export function secondsToTime(seconds: number): string{
    const hours = zeroLeft(seconds/3600)
    const minutagem = zeroLeft((seconds / 60) % 60)
    const segundos = zeroLeft((seconds % 60) % 60)
    return `${hours}:${minutagem}:${segundos}`
}