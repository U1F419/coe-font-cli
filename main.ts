import { CoeFontClient } from "./src/CoeFontClient";
import { Scraper } from "./src/Scraper";

const main = async () => {
	const client = new CoeFontClient("mail", "pass").login();
	client.generate("Hello, world!");

	const email = process.env["COEFONT_EMAIL"] ?? "test_email";
	const password = process.env["COEFONT_PASSWORD"] ?? "test_password";

	const scraper = await Scraper.build();
	await scraper.login(email, password);
	await scraper.close();
};

main();
