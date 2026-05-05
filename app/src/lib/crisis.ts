const patterns = [
  /想死|不想活|活不下去|自杀|结束生命|一了百了/i,
  /割腕|跳楼|上吊|服药|喝药|吞药/i,
  /伤害自己|自残|划伤|划开/i,
]

export function isCrisisText(text: string) {
  const trimmed = text.trim()
  if (!trimmed) return false
  return patterns.some((p) => p.test(trimmed))
}

