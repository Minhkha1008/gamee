# TODO - Integrate Ultimate features into simple-game

- [ ] Update `simple-game.html` to use shared UI/logic from Ultimate (`index.html`): load the same JS modules.
- [ ] Make `simple-game.html` contain all DOM elements required by Ultimate code (HUD, screens, quiz popup, achievement popup, gameover/win/pause/countdown, overlays, containers).
- [ ] Remove inline `<style>` and link `css/style.css` + `css/animation.css` to match Ultimate style.
- [ ] Set up correct menu buttons and ensure scripts attach to existing IDs.
- [ ] Verify gameplay loop starts from `game.init()` already included in `js/game.js`.
- [ ] Fix player icon: use the image like in simple, but allow Ultimate CSS.
- [ ] Smoke test: open `simple-game.html` and confirm quiz timer, power-ups indicators, achievements, high scores, settings, pause.

