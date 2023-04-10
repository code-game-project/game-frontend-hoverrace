# game-frontend-hoverrace

Hoverrace's frontend based on game-frontend-template-svelte.

## Developing

Once you've installed dependencies with `npm install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

After that you can start customizing the game view in [`src/routes/spectate.svelte`](./src/routes/spectate.svelte). Also don't forget to update the [`src/config.ts`](./src/config.ts) the info in [`static/security.txt`](./static/security.txt) or delete it if you don't want to use it.

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## License

Licensed under the [GNU Affero General Public License v3](./LICENSE).
