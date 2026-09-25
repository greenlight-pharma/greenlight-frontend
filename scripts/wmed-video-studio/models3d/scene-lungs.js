// Demonstração da cena M1: giro dos pulmões com a árvore brônquica acendendo da traqueia aos bronquíolos.
import { buildLungs, orbit } from './lungs.js';
import { seg, ease } from './stage.js';

export default async function (stage) {
  const L = await buildLungs(stage);
  const dur = 8;
  return {
    dur,
    update(t) {
      orbit(stage, (t / dur) * 0.5 - 0.02, { radius: 980, height: 60 });
    },
  };
}
