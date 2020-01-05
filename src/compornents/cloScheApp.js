import React from 'react';
import ScheduleList from './scheduleList';

// cf: https://ja.reactjs.org/docs/state-and-lifecycle.html
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }
  render() {
    return (
      <div className="closche">
        <div className="clock">
          <span className="underlined">{this.state.date.toLocaleTimeString()}</span>
        </div>
        <div className="schedule">
          <ScheduleList now={this.state.date} showsAll="true" />
        </div>
      </div>
    );
  }


}

export default Clock;