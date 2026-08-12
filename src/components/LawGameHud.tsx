type LawGameHudProps = {
  literacy: number;
  reputation: number;
  location: string;
  solved: number;
  total: number;
};

export function LawGameHud({ literacy, reputation, location, solved, total }: LawGameHudProps) {
  return (
    <div className="game-hud">
      <div><span>Грамотность</span><strong>{literacy}/100</strong></div>
      <div><span>Репутация</span><strong>{reputation}/100</strong></div>
      <div><span>Локация</span><strong>{location}</strong></div>
      <div><span>Кейсы</span><strong>{solved}/{total}</strong></div>
      <p>E - взаимодействовать · ESC - пауза</p>
    </div>
  );
}
