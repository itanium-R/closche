import React from 'react';
import Modal from './settingModal';

class ScheduleList extends React.Component {
  constructor(props) {
    super(props);

    let schedules = [
      { st: { h: 9, m: 0 }, en: { h: 10, m: 30 }, id: 1, title: "１限" },
      { st: { h: 10, m: 40 }, en: { h: 12, m: 10 }, id: 2, title: "２限" },
      { st: { h: 13, m: 0 }, en: { h: 14, m: 30 }, id: 3, title: "３限" },
      { st: { h: 14, m: 40 }, en: { h: 16, m: 10 }, id: 4, title: "４限" },
      { st: { h: 16, m: 20 }, en: { h: 17, m: 50 }, id: 5, title: "５限" },
      { st: { h: 18, m: 0 }, en: { h: 19, m: 30 }, id: 6, title: "６限" },
    ];

    let parseFlg = (str) => { return (str === "true" || str === true) ? true : false };
    this.state = {
      schedules: schedules,
      apprNum: 3,
      showsAll: parseFlg(props.showsAll),
      nextId: 7
    };
    // let startDate = props.now.getDate(); 
    this.setShowsAll = this.setShowsAll.bind(this);
    this.setApprNum = this.setApprNum.bind(this);
  }

  zeroPad(num, len) {
    let rslt = "";
    for (let i = 0; i < len; i += 1) rslt += "0";
    return (rslt + num).slice(-len);
  };

  parseTimeStr(time) {
    return this.zeroPad(time.h, 2) + ":" + this.zeroPad(time.m, 2);
  }

  parseFullTimeStr(time) {
    return this.zeroPad(time.h, 2) + ":" +
      this.zeroPad(time.m, 2) + ":" +
      this.zeroPad(time.s, 2);
  }

  calcMinDiff(t1, t2) {
    return (((t1.h - t2.h) * 60) + (t1.m - t2.m));
  }

  calcTimeDiff(t1, t2) {
    t1.s = t1.s || 0;
    t2.s = t2.s || 0;
    let remSec = (((t1.h - t2.h) * 60 * 60) +
      ((t1.m - t2.m) * 60) +
      (t1.s - t2.s));
    let h = parseInt(remSec / (60 * 60));
    let m = parseInt(remSec / (60) - h * 60);
    let s = parseInt(remSec % 60);
    return (this.zeroPad(h, 2) + ":" +
      this.zeroPad(m, 2) + ":" +
      this.zeroPad(s, 2));
  }

  setShowsAll(flg) {
    this.setState({ showsAll: flg });
  }

  setApprNum(num) {
    this.setState({ apprNum: num });
  }

  render() {
    let now = {
      h: this.props.now.getHours(),
      m: this.props.now.getMinutes(),
      s: this.props.now.getSeconds(),
    };
    let doing = [], next = [];
    let approaching = [];
    let cnt = 0;
    for (let s of this.state.schedules) {
      if (!this.state.showsAll && cnt >= this.state.apprNum) break;
      if (this.calcMinDiff(s.st, now) > 0) {
        s.isDoing = false;
        if (next.length === 0) next.push(s);
        approaching.push(s);
        cnt += 1;
      } else {
        if (this.calcMinDiff(s.en, now) > 0) {
          s.isDoing = true;
          approaching.push(s);
          doing.push(s);
          cnt += 1;
        } else if (this.state.showsAll) {
          s.isDoing = false;
          approaching.push(s);
          cnt += 1;
        }
      }
    }
    return (
      <div>
        <div className="doingAndNext">
          <ul className="nopoint">
            {doing.map(a => (
              <li key={this.parseTimeStr(a.st)}>
                <span className="sched prefix">進行中：</span>
                <span className="sched bigTitle">{a.title}</span><br />
                <span className="sched suffix">終了まであと</span>
                <span className="sched tHMS">{this.calcTimeDiff(a.en, now)}</span>
              </li>
            ))}
          </ul>
          <ul className="nopoint">
            {next.map(a => (
              <li key={a.id}>
                <span className="sched prefix">次は　：</span>
                <span className="sched bigTitle">{a.title}</span><br />
                <span className="sched suffix">開始まであと</span>
                <span className="sched tHMS">{this.calcTimeDiff(a.st, now)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="approaching">
          <ul className="nopoint">
            {approaching.map(a => (
              <li key={this.parseTimeStr(a.st)} className="scheLi">
                {a.isDoing ? <span className="sched dMark">■</span> : <span className="sched dMark">　</span>}
                <span className="sched tHM">{this.parseTimeStr(a.st)}</span>
                <span className="sched tSY">～</span>
                <span className="sched tHM">{this.parseTimeStr(a.en)}</span>
                <span className="sched title">{a.title}</span>
              </li>
            ))}
          </ul>
          {approaching.length === 0 ? <p>以後の予定はありません</p> : <span></span>}
        </div>
        <Modal schedules={this.state.schedules}
          showsAll={this.state.showsAll}
          showsAllHandler={this.setShowsAll}
          apprNum={this.state.apprNum}
          apprNumHandler={this.setApprNum} />
      </div>
    );
  }
}

export default ScheduleList;