type LegalScoreBadgeProps = {
  score: number;
  burstKey: number;
};

export function LegalScoreBadge({ score, burstKey }: LegalScoreBadgeProps) {
  return (
    <div className="legal-score" aria-label={`Юридическая грамотность: ${score} очков`}>
      <strong>⚖️ {score} очков</strong>
      {burstKey > 0 && <span key={burstKey}>+10 ⚖️</span>}
    </div>
  );
}
