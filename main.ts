import { CoeFontClient } from "./src/CoeFontClient";
import readlineSync from "readline-sync";

const main = async () => {
	const cfc = await CoeFontClient.build();
	console.log("ログインします");
	const email = readlineSync.questionEMail("メールアドレス: ");
	const password = readlineSync.question("パスワード: ");
	await cfc.login(email, password);
	console.log("CoeFontにログインしました。");
	while (true) {
		const cmd = readlineSync.question("コマンド: ");
		switch (cmd) {
			case "gen":
				const context = readlineSync.question("生成したい文章: ");
				await cfc.generate(context);
				break;
			case "exit":
				await cfc.exit();
				console.log("bye");
				return 1;
			default:
				break;
		}
	}
};

main();
