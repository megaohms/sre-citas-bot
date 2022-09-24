const puppeteer = require("puppeteer");

const delay = (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

const initPage = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
  });
  const page = await browser.newPage();
  await page.goto("https://citas.sre.gob.mx/");
  await delay(2000);
  return page;
};

const closeOfficeTypeModal = async (page, options = {}) => {
  await page.waitForSelector("button.btn.btn-primary.btn-sm", { visible: true });
  await delay(4000);
  await page.click("button.btn.btn-primary.btn-sml", options);
};

const closeTermsModal = async (page, options = {}) => {
  await page.waitForSelector("svg.bi.bi-x-circle", { visible: true });
  await delay(4000);
  await page.click("svg.bi.bi-x-circle", options);
};

const signIn = async (page) => {
  // enter page credentials
  await page.type("input[name=email]", "meganbethring@gmail.com");
  await delay(1200);
  await page.type("input[name=password]", "uxr_mdh9rnp-pcm3HAY");
  // this selecting the modal that pops up?
  await delay(1000);
  // agree to terms box
  await page.click("input[type=checkbox]");
  await closeTermsModal(page);
  await delay(1000);
  await page.click("button.btn.btn-primary.pull-right");
};

const schedule = async (p) => {
  await delay(1000);
  await p.click("a.btn.btn-primary");
};

const enterZipCode = async (p) => {
  await delay(1000);
  // 85711 === Tuscon, AZ
  // 85364 === Yuma, AZ
  // 75247 === Dallas, TX
  // 79845 == Presidio, TX
  // 78205 === San Antonio, TX
  // 78741 === Austin, TX
  // 77004 == Houston, TX
  // 94105 == SF, CA
  await p.type("[name=postalCode]", "94105");
};

const search = async (p) => {
  await delay(1200);
  await p.click("a.btn.btn-primary");
  await delay(2000);
};

const confirmOffice = async (p) => {
  await delay(3000);
  await p.click("div.form-group > ul > li > a");
};

const acknowledgeNoAppointments = async (p) => {
  await delay(1000);
  await p.click("div.modal-body > div.form-group > center > a");
};

const selectSanFranciscoOffice = async (p) => {
  await delay(2000);
  await p.click("[value=SELECT");
  await p.click("[value=Accept]");
};

const handleConfirm = async (p) => {
  await delay(2000);
  const noAppointmentsModal = await p.$("div.alert.alert-danger > span");

  if (noAppointmentsModal) {
    await p.click("div.form-group > center > a");
    return;
  }
  await selectSanFranciscoOffice(p);
  return true;
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

(async () => {
  console.log("Starting...");
  const page = await initPage();

  console.log("Page loaded");
  await delay(2000);
  await page.waitForSelector("input[name=email]");
  console.log("Page rendered.");

  await closeOfficeTypeModal(page)
  console.log("Signing in...");
  await signIn(page);
  let isAppointmentFound;

  while (!isAppointmentFound) {
    await schedule(page);
    await closeModal(page);
    await enterZipCode(page);
    await search(page);
    await confirmOffice(page);
    isAppointmentFound = await handleConfirm(page);
    const aFewSeconds = getRandomInt(1000, 30000);
    delay(aFewSeconds);
  }

  await browser.close();
})();
