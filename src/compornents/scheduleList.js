import React from 'react'; 

class ScheduleList extends React.Component {
  constructor(props) {
    super(props);
    let schedules = [{text:"hoge",time:{h:11,m:0}},{text:"fuga",time:{h:23,m:50}}];
    this.state = {schedules: schedules, apprNum: 3};
    // let startDate = props.now.getDate(); 
  }

  zeroPad(num, len){
    let rslt = "";
    for(let i = 0; i < len; i += 1) rslt += "0";
    return (rslt + num).slice(-len);
  };

  parseTimeStr(time) {
    return this.zeroPad(time.h) + ":" + this.zeroPad(time.m);
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
    return (this.zeroPad(parseInt(remSec / (60 * 60)),2) + ":" +
            this.zeroPad(parseInt(remSec / 60),2) + ":" +
            this.zeroPad(remSec % 60,2));
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
      if(this.calcMinDiff(s.time,now) > 0){
        approaching.push(s);
        cnt += 1;
      }
      if(cnt >= this.state.apprNum) break;
    }
    return (
      <ul className="nopoint">
        {approaching.map(a => (
          <li key={this.parseTimeStr(a.time)}>{this.parseTimeStr(a.time)} : {a.text} : 
            あと{this.calcTimeDiff(a.time,now)}</li>
          
        ))}
      </ul>
    );
  }
}

export default ScheduleList;