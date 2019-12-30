import React from 'react'; 

class ScheduleList extends React.Component {
  constructor(props) {
    super(props);
    let schedules = [{text:"hoge",st:{h:11,m:0},en:{h:12,m:0}},{text:"fuga",st:{h:23,m:0},en:{h:23,m:50}}];
    this.state = {schedules: schedules, apprNum: 3};
    // let startDate = props.now.getDate(); 
  }

  zeroPad(num, len){
    let rslt = "";
    for(let i = 0; i < len; i += 1) rslt += "0";
    return (rslt + num).slice(-len);
  };

  parseTimeStr(time) {
    return this.zeroPad(time.h, 2) + ":" + this.zeroPad(time.m, 2);
  }

  calcMinDiff(t1,t2){
    return (((t1.h - t2.h) * 60) + (t1.m - t2.m));
  }

  calcTimeDiff(t1,t2){
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

  render() {
    let now = {
      h: this.props.now.getHours(),
      m: this.props.now.getMinutes(),
      s: this.props.now.getSeconds(),
    };
    let approaching = [];
    let cnt = 0;
    for(let s of this.state.schedules){
      if(this.calcMinDiff(s.st,now) > 0){
        approaching.push(s);
        cnt += 1;
      }
      if(cnt >= this.state.apprNum) break;
    }
    return (
      <ul className="nopoint">
        {approaching.map(a => (
          <li key={this.parseTimeStr(a.st)}>
            <span className="sched tHM">{this.parseTimeStr(a.st)}</span>
            <span className="sched">～</span>
            <span className="sched tHM">{this.parseTimeStr(a.en)}</span>
            <span className="sched title">{a.text}</span>
            <span className="sched tHMS">{this.calcTimeDiff(a.st,now)}</span>
          </li>
          
        ))}
      </ul>
    );
  }
}

export default ScheduleList;