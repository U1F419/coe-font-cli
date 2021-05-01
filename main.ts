import { CoeFontClient } from "./src/Client";

const main = () => {
	const client = new CoeFontClient("mail", "pass").login();
	client.generate("Hello, world!");
};

main();
