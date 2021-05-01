import puppeteer from "puppeteer";
import fs from "fs";

const URL = "https://coefont.studio/" as const;

export class Scraper {
	private constructor(
		private browser: puppeteer.Browser,
		private page: puppeteer.Page,
		private cdp: puppeteer.CDPSession,
		private downloadPath: string,
	) {}

	static async build(downloadPath: string) {
		if (!fs.existsSync(downloadPath)) {
			fs.mkdirSync(downloadPath);
		}

		const browser = await puppeteer.launch({
			headless: false,
			devtools: true,
		});
		const page = await browser.newPage();
		const cdp = await page.target().createCDPSession();
		cdp.send("Page.setDownloadBehavior", {
			behavior: "allow",
			downloadPath: downloadPath,
		});
		return new Scraper(browser, page, cdp, downloadPath);
	}

	async login(mail: string, password: string) {
		await this.page.goto(URL + "login", { waitUntil: "networkidle2" });
		await this.page.type(
			"form.v-form > div:nth-child(1) > div input",
			mail,
		);
		await this.page.type(
			"form.v-form > div:nth-child(2) > div input",
			password,
		);

		await this.page.click("form.v-form > button");

		if (await this.page.$(".v-alert")) {
			throw new Error("mail or password is invalid");
		}

		await this.page.waitForNavigation({ waitUntil: "networkidle2" });
	}

	private areaCount = 1;
	async generate(content: string) {
		const selector = `.maineditor > div:nth-child(${this.areaCount})`;

		await this.page.type(`${selector} textarea`, content);

		await this.page.evaluate((s: string) => {
			const button = document.querySelectorAll(
				`${s} button`,
			)[1] as HTMLButtonElement;
			button.click();
		}, selector);

		await this.page.click("body");
		await this.page.click(`${selector} textarea`);

		await this.page.waitForSelector(
			`#yomiarea span:nth-child(${content.length})`,
		);

		await this.page.click(".elevation-1 button.download-button-size");

		await this.waitForFileDownload(content);
		this.areaCount++;
	}

	async close() {
		await this.browser.close();
	}

	private ssCount = 1;
	private async screenshot(name: string) {
		await this.page.screenshot({
			path: `./screenshot/${("000" + this.ssCount++).slice(
				-3,
			)}_${name}.png`,
		});
	}

	private async waitForFileDownload(filename: string) {
		const dlFileName = "coe-font-studio.wav";
		while (!fs.existsSync(`${this.downloadPath}/${dlFileName}`)) {
			await this.page.waitForTimeout(500);
		}

		fs.renameSync(
			`${this.downloadPath}/${dlFileName}`,
			`${this.downloadPath}/${filename}.wav`,
		);
	}
}
