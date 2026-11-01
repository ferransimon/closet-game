# Armario

Juego PWA (Next.js, export estático): ordena la ropa en el armario de hombre (izquierda) o de mujer (derecha) antes de que se acabe el tiempo.

- **Toque/clic** en la mitad izquierda o derecha → armario.
- **Toca la prenda** si está sucia para tirarla (+15). Si estaba limpia, pierdes una vida.
- **Toca el objeto escondido** (móvil, cartera…) antes de guardar (+25).
- Teclado: ← / → (o A / D), Espacio = tirar, ↑ / E = sacar objeto, Enter = jugar.
- 3 vidas; el tiempo por prenda baja de 3 s a 0,65 s. Top 20 guardado en `localStorage`.

```bash
npm run dev     # desarrollo
npm test        # tests del motor (vitest)
npm run build   # genera out/ (estático, con service worker)
npx serve out   # probar la build / PWA
npm run icons   # regenerar iconos PNG desde public/icons/icon.svg
```

Lógica del juego en `lib/game/` (reducer puro), UI en `components/`.
