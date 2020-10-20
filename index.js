const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

const searchVal = "https://www.amazon.ca/Bang-Olufsen-Beoplay-H9-3rd/dp/B086NG9YN2/";
const wantedPrice = 600;
const scraperEmail = "something@gmail.com"; //account your nodemailer will use to send email
const scraperPassword = "somepassword"; //password for your nodmailer email account
const yourEmail = "youremail@gmail.com"; //your email receiving the email from nodemailer

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(searchVal);

  const result = await page.evaluate(()=> {
      const price = document.querySelector("#price_inside_buybox").innerText;
      const formatted = Number(price.slice(4));
      return formatted;
  });
  if(result < wantedPrice){
    console.log(`the price is below ${wantedPrice}`);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: scraperEmail,
            pass: scraperPassword
        }
    });
    const html = `<a href=\"${searchVal}\">Link</a>`;
    await transporter.sendMail({
        from: `"Amazon Scraper" <${scraperEmail}>`,
        to: yourEmail,
        subject: `Price of item is ${result}`,
        text: `Price of item is ${result}`,
        html: html
    }); 
    console.log(`email sent to ${yourEmail}`);
  }else{
      console.log('Price is too high...');
  }
  await browser.close();
})();