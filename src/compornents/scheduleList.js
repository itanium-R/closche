import React from 'react'; 

class ScheduleList extends React.Component {
  constructor(props) {
    super(props);
    let sl = [{text:"a",id:"11:00"}];
    this.state = {showList: sl};
  }


  render() {
    // console.log(this.props.now);
    return (
      <ul className="nopoint">
        {this.state.showList.map(item => (
          <li key={item.id}>{item.id} : {item.text}</li>
        ))}
      </ul>
    );
  }
}

export default ScheduleList;