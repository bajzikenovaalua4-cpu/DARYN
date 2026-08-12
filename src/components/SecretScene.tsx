type SecretSceneProps = {
  legalLiteracy: number;
  onBack: () => void;
};

export function SecretScene({ legalLiteracy, onBack }: SecretSceneProps) {
  return (
    <section className="vn-secret-scene">
      <div className="vn-panel">
        <span className="vn-kicker">Секретная сцена</span>
        <h1>Ты прошёл все основные дела</h1>
        <p>Но, кажется, осталось ещё кое-что. Итоговая юридическая грамотность: {legalLiteracy}.</p>
        <button className="vn-primary" onClick={onBack}>Вернуться к локациям</button>
      </div>
    </section>
  );
}
