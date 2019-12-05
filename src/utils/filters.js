import Vue from 'vue'

/**
 * @param number 被格式化数字
 * @param places 保留小数
 * @param symbol 钱符号
 * @param thousand 分隔符
 * @returns {string} 数字千分位格式化
 */
Vue.filter('formatNumber', (number, places, symbol, thousand) => {
  if (!number && number != 0) {
    return '--'
  }
  if (number === '') {
    return ''
  }
  if (String(number).substring(0, 1) == "¥") {
    return number
  }
  var j;
  number = number || 0;
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  symbol = symbol || "";
  thousand = thousand || ",";
  var negative = number < 0 ? "-" : "";
  var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "";
  j = (j = i.length) > 3 ? j % 3 : 0;
  return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? '.' + Math.abs(number - i).toFixed(places).slice(2) : "");
})
