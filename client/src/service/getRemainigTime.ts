export default function getRemainigTime(endDate: Date): string {
  const msDelta = new Date(endDate).getTime() - new Date().getTime()
  if (msDelta <= 0) return 'время вышло'

  const msInHour = 1000 * 60 * 60
  const msInDay = msInHour * 24
  const msInWeek = msInDay * 7
  const msInMonth = msInDay * 30

  if (msDelta < msInDay) {
    // Если разница меньше дня
    const hoursDiff = Math.round(msDelta / msInHour)
    return `${hoursDiff} ч.`
  }
  if (msDelta < msInWeek) {
    // Если разница меньше недели
    const daysDiff = Math.round(msDelta / msInDay)
    return `${daysDiff} дн.`
  }
  if (msDelta < msInMonth) {
    // Если разница меньше месяца
    const weeksDiff = Math.round(msDelta / msInWeek)
    return `${weeksDiff} нед.`
  }
  // Если разница больше месяца
  const monthsDiff = Math.round(msDelta / msInMonth)
  return `${monthsDiff} мес.`
}
