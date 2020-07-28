
const rp = require('request-promise');
const cheerio = require('cheerio');

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context, callback) => {

  const url = `https://infopasar.denpasarkota.go.id/?page=209&language=id&domain=&kategori_komoditas=KK001&pasar=PSR000002`
  const options = {
    uri: url,
    transform: (body) => cheerio.load(body)
  }

  const response = await rp(options)
      .then(($) => {
        const scrapedData = [];
        let parent ='';
        $("table > tbody > tr").each((index, element) => {
          const tds = $(element).find("td");
          const nama = $(tds[0]).text();
          if(nama) parent = nama;
          let jenis = $(tds[1]).text();
          jenis = jenis.replace(/\t/g, '').replace(/\n/g, '');
          let harga = $(tds[2]).text();
          harga = harga.replace(/\t/g, '').replace(/\n/g, '');
          if (harga){
            const tableRow = { nama: parent, jenis, harga };
            scrapedData.push(tableRow);
          }
        });
        return scrapedData;

      })
      .catch((err) => console.error(error))

    callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
    });

}
