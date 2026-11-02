# Plato

Juego PWA (Next.js, export estático): separa la comida saludable (izquierda) de la no saludable (derecha) antes de que se acabe el tiempo.

- **Toque/clic** en la mitad izquierda o derecha → el alimento vuela en parábola a su cesta.
- Se ven los **10 próximos alimentos** en cola, para poder ir más rápido.
- **Toca lo que lleva dentro** (gusano, pegatina, espina, hueso, tapón) antes de guardar (+25).
- **Toca la comida podrida** para tirarla (+15). Aparece a partir del alimento 15. Si estaba buena, pierdes una vida.
- Cada **10 aciertos seguidos**: confeti y +20.
- Teclado: ← / → (o A / D), Espacio = tirar, ↑ / E = quitar objeto, Enter = jugar.
- 3 vidas; el tiempo por alimento baja de 3 s a 0,65 s. Top 20 guardado en `localStorage`.

```bash
npm run dev     # desarrollo
npm test        # tests del motor (vitest)
npm run build   # genera out/ (estático, con service worker)
npx serve out   # probar la build / PWA
npm run icons   # regenerar iconos PNG desde public/icons/icon.svg
```

Lógica del juego en `lib/game/` (reducer puro), UI en `components/`.
