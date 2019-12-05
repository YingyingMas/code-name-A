export default {
  install(Vue) {
    // 1. 添加全局方法或属性
    Vue.myGlobalMethod = function () {

    }
    // 2. 添加全局资源
    Vue.directive('my-directive', {
      bind (el, binding, vnode, oldVnode) {

      }
    })

    // 3. 注入组件选项
    Vue.mixin({
      created: function () {

      }
    })

    // 4. 添加实例方法
    Vue.prototype.$dateUtil = {
      /**
       * 将日期格式化成指定格式的字符串
       * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
       * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
       * @returns 返回格式化后的日期字符串
       */
      formatDate: function (date, fmt) {
        if (!date) {
          return "";
        }
        date = date == undefined ? new Date() : date;
        date = typeof date == 'number' ? new Date(date) : date;
        fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
        var obj = {
          'y': date.getFullYear(), // 年份，注意必须用getFullYear
          'M': date.getMonth() + 1, // 月份，注意是从0-11
          'd': date.getDate(), // 日期
          'q': Math.floor((date.getMonth() + 3) / 3), // 季度
          'w': date.getDay(), // 星期，注意是0-6
          'H': date.getHours(), // 24小时制
          'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
          'm': date.getMinutes(), // 分钟
          's': date.getSeconds(), // 秒
          'S': date.getMilliseconds() // 毫秒
        };
        var week = ['天', '一', '二', '三', '四', '五', '六'];
        for (var i in obj) {
          fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
            var val = obj[i] + '';
            if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
            for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
            return m.length == 1 ? val : val.substring(val.length - m.length);
          });
        }
        return fmt;
      },
      /**
       * 将字符串解析成日期
       * @param str 输入的日期字符串，如'2014-09-13'
       * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
       * @returns 解析后的Date类型日期
       */
      parseDate: function (str, fmt) {
        fmt = fmt || 'yyyy-MM-dd';
        var obj = {
          y: 0,
          M: 1,
          d: 0,
          H: 0,
          h: 0,
          m: 0,
          s: 0,
          S: 0
        };
        fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function (m, $1, $2, $3, $4, idx, old) {
          str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function (_m, _$1) {
            obj[$3] = parseInt(_$1);
            return '';
          });
          return '';
        });
        obj.M--; // 月份是从0开始的，所以要减去1
        var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
        if (obj.S !== 0) date.setMilliseconds(obj.S); // 如果设置了毫秒
        return date;
      },
      /**
       * 将一个日期格式化成友好格式，比如，1分钟以内的返回“刚刚”，
       * 当天的返回时分，当年的返回月日，否则，返回年月日
       * @param {Object} date
       */
      formatDateToFriendly: function (date) {
        date = date || new Date();
        date = typeof date === 'number' ? new Date(date) : date;
        var now = new Date();
        if ((now.getTime() - date.getTime()) < 60 * 1000) return '刚刚'; // 1分钟以内视作“刚刚”
        var temp = this.formatDate(date, 'yyyy年M月d');
        if (temp == this.formatDate(now, 'yyyy年M月d')) return this.formatDate(date, 'HH:mm');
        if (date.getFullYear() == now.getFullYear()) return this.formatDate(date, 'M月d日');
        return temp;
      },
      /**
       * 将一段时长转换成友好格式，如：
       * 147->“2分27秒”
       * 1581->“26分21秒”
       * 15818->“4小时24分”
       * @param {Object} second
       */
      formatDurationToFriendly: function (second) {
        if (second < 60) return second + '秒';
        else if (second < 60 * 60) return (second - second % 60) / 60 + '分' + second % 60 + '秒';
        else if (second < 60 * 60 * 24) return (second - second % 3600) / 60 / 60 + '小时' + Math.round(second % 3600 / 60) + '分';
        return (second / 60 / 60 / 24).toFixed(1) + '天';
      },
      /**
       * 将时间转换成MM:SS形式
       */
      formatTimeToFriendly: function (second) {
        var m = Math.floor(second / 60);
        m = m < 10 ? ('0' + m) : m;
        var s = second % 60;
        s = s < 10 ? ('0' + s) : s;
        return m + ':' + s;
      },
      /**
       * 判断某一年是否是闰年
       * @param year 可以是一个date类型，也可以是一个int类型的年份，不传默认当前时间
       */
      isLeapYear: function (year) {
        if (year === undefined) year = new Date();
        if (year instanceof Date) year = year.getFullYear();
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
      },
      /**
       * 获取某一年某一月的总天数，没有任何参数时获取当前月份的
       * 方式一：$.getMonthDays();
       * 方式二：$.getMonthDays(new Date());
       * 方式三：$.getMonthDays(2013, 12);
       */
      getMonthDays: function (date, month) {
        var y, m;
        if (date == undefined) date = new Date();
        if (date instanceof Date) {
          y = date.getFullYear();
          m = date.getMonth();
        } else if (typeof date == 'number') {
          y = date;
          m = month - 1;
        }
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 非闰年的一年中每个月份的天数
        //如果是闰年并且是2月
        if (m == 1 && this.isLeapYear(y)) return days[m] + 1;
        return days[m];
      },
      /**
       * 计算2日期之间的天数，用的是比较毫秒数的方法
       * 传进来的日期要么是Date类型，要么是yyyy-MM-dd格式的字符串日期
       * @param date1 日期一
       * @param date2 日期二
       */
      countDays: function (date1, date2) {
        var fmt = 'yyyy-MM-dd';
        // 将日期转换成字符串，转换的目的是去除“时、分、秒”
        if (date1 instanceof Date && date2 instanceof Date) {
          date1 = this.format(fmt, date1);
          date2 = this.format(fmt, date2);
        }
        if (typeof date1 === 'string' && typeof date2 === 'string') {
          date1 = this.parse(date1, fmt);
          date2 = this.parse(date2, fmt);
          return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
        } else {
          console.error('参数格式无效！');
          return 0;
        }
      },
      /**
       * 计算n个月前的时间
       * 传进来的日期要么是Date类型，要么是yyyy-MM-dd格式的字符串日期
       * @param date
       * @param monthNum 月份跨度
       */
      getPreMonthDay: function (date, monthNum) {
        var dateArr = date.split('-');
        var year = dateArr[0]; //获取当前日期的年份
        var month = dateArr[1]; //获取当前日期的月份
        var day = dateArr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        if (monthNum > month) {
          var year2 = year - 1;
        }
        if (monthNum <= month) {
          var year2 = year
        }
        var month2 = parseInt(month) - monthNum;
        if (month2 <= 0) {
          year2 = parseInt(year2) - parseInt(month2 / 12 == 0 ? 1 : Math.abs(parseInt(month2) / 12));
          month2 = 12 - (Math.abs(month2) % 12);
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
          day2 = days2;
        }
        if (month2 < 10) {
          month2 = '0' + month2;
        }
        var t2 = year2 + '-' + month2 + '-' + day2;
        return t2;
      }
    }
  }
}
