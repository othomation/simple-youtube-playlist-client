import "svelte";
import App from "./App.svelte";

const app = new App({
	target: document.body,
	props: {
		appName: "A youtube playlist client",
	},
});

export default app;
