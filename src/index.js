require('dotenv/config');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const env = process.env;
const xlsx = require('node-xlsx');

class Reptile {
  constructor() {
  }
  async start() {
    // 获取html
    let result = await axios.get(env.url);
    // 解析html
    let data = this.parserHtml(result.data)
    // 生成execl文件
    this.getExecl(data);
  }
  parserHtml(html) {
    let $ = cheerio.load(html);
    let tableName = $('.table_bg001.border_box.limit_sale.scr_table');
    // 获取titles
    let tableTitle = tableName.find('tbody tr:first-child');
    let tableTitleTds = tableTitle.children();
    // 获取利润
    let ProfitTr = tableName.find('tbody tr:nth-child(12)');
    let profitTds = ProfitTr.children();
    let cloTitle = [];
    let cloProfit = [];
    for (let i = 0; i < tableTitleTds.length; i++) {
        let title = $(tableTitleTds[i]).text().trim();
        cloTitle.push(title);
        let profit = $(profitTds[i]).text().trim();
        cloProfit.push(profit);
    }
    return {
        cloTitle,
        cloProfit
    }
  }
  getExecl(dataObj) {
    const values = Object.values(dataObj);
    const buffer = xlsx.build([{ name: '茅台利润', data: values }]);
    fs.writeFile('./贵州茅台利润.xls', buffer, (err) => {
      if(err) {
        console.log('生成文件出错')
      }
    })
  }
}
let reptile = new Reptile();
reptile.start()