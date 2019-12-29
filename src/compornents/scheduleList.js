import React from 'react'; 

class ScheduleList extends React.Component {
  constructor(props) {
    super(props);
    let schedules = [{text:"hoge",time:{h:11,m:0}}];
    this.state = {schedules: schedules};
    // let startDate = props.now.getDate(); 
  }

  parseTimeStr(time) {
    let zeroPad = (num) => {return ("00" + num).slice(-2)};
    return zeroPad(time.h) + ":" + zeroPad(time.m);
  }

  calcMinDiff(t1,t2){
    return (((t1.h - t2.h) * 60) + (t1.m - t2.m));
  }

  render() {
    let now = {h: this.props.now.getHours(), m: this.props.now.getMinutes()};
    console.log(this.parseTimeStr(now));
    return (
      <ul className="nopoint">
        {this.state.schedules.map(item => (
          <li key={item.time}>{this.parseTimeStr(item.time)} : {item.text} : 
            あと{this.calcMinDiff(item.time,now)}分</li>
          
        ))}
      </ul>
    );
  }
}

export default ScheduleList;