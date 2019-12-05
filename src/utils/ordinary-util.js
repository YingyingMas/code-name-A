export default {
  install(Vue) {
    Vue.prototype.$mountUtil = {
      /**
       *
       * @param number 被格式化数字
       * @param places 保留小数
       * @param symbol 钱符号
       * @param thousand 分隔符
       * @param decimal
       * @returns {string}
       */
      formatMount(number, places, symbol, thousand, decimal) {
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
        symbol = symbol !== undefined ? symbol : "￥";
        thousand = thousand || ",";
        decimal = decimal || ".";
        var negative = number < 0 ? "-" : "";
        var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "";
        j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
      },
      /*错误警告*/
      messageWaring(msg) {
        Vue.prototype.$message({
          message: msg,
          type: 'warning',
          duration: '3000'
        });
        return
      },
      /*成功警告*/
      messageSuccess(msg) {
        Vue.prototype.$message({
          message: msg,
          type: 'success',
          duration: '3000'
        });
        return
      },
      /*添加滚动条*/
      addScroll(ele, axis, preventDefault) {
        ele.mCustomScrollbar({
          theme: "minimal-dark",
          axis: axis || "yx",
          scrollButtons: {
            enable: true,
          },
          mouseWheel: {
            preventDefault: !preventDefault
          },
          alwaysTriggerOffsets: false
        });
      },
      addTitle(ele) {
        ele.each(function (index, ele) {
          var tdText = $(ele).html();
          if (ele.scrollWidth - ele.offsetWidth > 0) {
            $(ele).attr("title", tdText);
          }
          ;
        });
      },
      pushState() {
        history.pushState(null, null, document.URL);
      },
      /**
       *表格导出接口全路径拼接
       * @param url 导出接口路径
       * @param params {object} 请求入参对象
       * @returns   返回 : 全路径
       */
      tableExportUrlJoin(url, params) {
        let result = '';
        for (var name in params) {
          result += (name + '=' + params[name] + '&')
        }
        result = result.slice(0, -1)
        return BASE_URL + url + '?' + result;
      },
      /**
       *重置Echart图表
       * @param chart = echarts.init(dom)
       * @returns
       */
      resizeChart(chart) {
        $(window).on('resize', () => {
          chart.resize();
        })
      },
      /**
       * 使用表单导出文件
       * @param params {object} 请求参数
       * @param url {string} 导出接口
       * @param appendTo {string} 创建form的追加位置
       * @returns
       */
      formExportFile(params = {}, url = '', appendTo = 'body') {
        if (!url) return;
        var form = document.createElement("form");
        form.style.display = 'none';
        form.action = BASE_URL + url;
        form.method = "post";
        form.acceptCharset = "UTF-8";
        form.enctype = "multipart/form-data";
        form.target = "_blank";
        $(appendTo)[0].appendChild(form);

        for (var key in params) {
          var input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = params[key];
          form.appendChild(input);
        }
        form.submit();
        form.remove();
      },
      /**
       * 表头单元格tips渲染方法
       * @param data {array} tips数据
       * @param createElement {function}
       * @param column {object}
       * @returns 单元格elements
       */
      tableTips(data, createElement, column) {
        let innerStr = '';
        let currentTip = data.find(item => column.property === item.strMeasureCode);
        if (!currentTip) return column.label;
        if (currentTip.strMeasureId) {
          innerStr += `<span class="column-tip-title"><i style="opacity:0;">空</i>指标ID：</span>${currentTip.strMeasureId}`;
        }
        if (currentTip.strMeasureName) {
          innerStr += `<br><span class="column-tip-title">指标库中指标名称：</span>${currentTip.strMeasureName}`;
        }
        if (currentTip.strBusinessCaliberDesc) {
          innerStr += `<br><span class="column-tip-title">业务口径：</span>${currentTip.strBusinessCaliberDesc}`;
        }
        if (!innerStr) return column.label;
        return createElement("span", [
          column.label,
          createElement(
            "el-tooltip",
            {
              class: "cell-s-tip tableColumnsDoubt",
              props: {
                effect: "dark",
                placement: "bottom",
                popperClass: "tableColumnsTip"
              }
            },
            [
              createElement("i", {
                class: "fa fa-question-circle"
              }),
              createElement(
                'div',
                {
                  slot: 'content',
                  domProps: {
                    innerHTML: innerStr
                  }
                }
              )
            ]
          )
        ]);
      }
    }
  }
}
