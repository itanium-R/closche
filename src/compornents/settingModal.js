// cf) https://qiita.com/keyyang0723/items/08c96a5cbc02ef741796

import React from 'react';
import Modal from 'react-modal';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root');
class SettingModal extends React.Component {
  constructor(props) {
    super(props);
    let parseFlg = (str) => { return (str === "true" || str === true) ? true : false };
    this.state = {
      modalIsOpen: false,
      schedules: props.schedules,
      schedulesHandler: props.schedulesHandler,
      nextId: props.nextId,
      showsAll: parseFlg(props.showsAll),
      showsAllHandler: props.showsAllHandler,
      apprNum: props.apprNum,
      apprNumHandler: props.apprNumHandler,
      color: props.color,
      colorHandler: props.colorHandler,
      newScheSt: "00:00",
      newScheEn: "00:00",
      newScheT: ""
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);

    this.addSchedule = this.addSchedule.bind(this);
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }
  afterOpenModal() {
  }
  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  handleInputChange(event) {
    const checked = event.target.checked;
    let value = event.target.value;
    let color = this.state.color;
    let name = event.target.name;
    switch (name) {
      case ("showsAll"):
        this.setState({ showsAll: checked });
        this.state.showsAllHandler(checked);
        break;
      case ("apprNum"):
        value = parseInt(value);
        if (value < 2) break; // 2未満にはしない
        this.setState({ apprNum: value });
        this.state.apprNumHandler(value);
        break;
      case ("fontColor"):
        color.font = value;
        this.setState({ color: color });
        this.state.colorHandler(color);
        break;
      case ("backColor"):
        color.back = value;
        this.setState({ color: color });
        this.state.colorHandler(color);
        break;
      case ("schedules"):
        try {
          let schedules = JSON.parse(value);
          this.setState({ schedules: schedules });
          this.state.schedulesHandler(schedules);
        } catch (e) {
          console.log(e);
        }
        break;
      default:
        this.setState({ [name]: value });
        break;
    }
  }

  addSchedule() {
    let newScheSt = this.state.newScheSt;
    let newScheEn = this.state.newScheEn;
    let st = { h: newScheSt.slice(0, 2), m: newScheSt.slice(-2) };
    let en = { h: newScheEn.slice(0, 2), m: newScheEn.slice(-2) };
    let newSche = {
      id: this.state.nextId,
      st: st,
      en: en,
      title: this.state.newScheT
    }
    let schedules = this.state.schedules;
    schedules.list.push(newSche);
    schedules.nextId += 1;
    // TODO: SORT
    this.state.schedulesHandler(schedules);
    // TODO: newScheEStを最後のEn時間に
    this.setState({ newScheSt: "00:00", newScheEn: "00:00", newScheT: "" });
  }

  submitHandle(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <img src="./setting(c)icooon.png" className="setIco" onClick={this.openModal} alt="setting" />
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Setting Modal"
        >
          <form>
            <h2>Setting</h2>
            <div>
              <label className="setLabel"> 全予定表示
                <input name="showsAll" type="checkbox"
                  checked={this.state.showsAll}
                  onChange={this.handleInputChange} />
              </label>
            </div>
            {!this.state.showsAll &&
              <div>
                <label className="setLabel"> 表示数(2~*)
                  <input name="apprNum" type="number"
                    value={this.state.apprNum}
                    onChange={this.handleInputChange} />
                </label>
              </div>
            }

            <label className="setLabel"> 文字色
                <input name="fontColor" type="text"
                value={this.state.color.font}
                onChange={this.handleInputChange} />
            </label>
            <label className="setLabel"> 背景色
                <input name="backColor" type="text"
                value={this.state.color.back}
                onChange={this.handleInputChange} />
            </label>

            {false && <label className="setLabel"> 予定JSON
                <input name="schedules" type="text"
                value={JSON.stringify(this.state.schedules)}
                onChange={this.handleInputChange} />
            </label>}
          </form>

          <hr />
          <form onSubmit={this.submitHandle}>
            <h2>予定追加</h2>
            <label className="setLabel"> 開始時刻
                <input name="newScheSt" type="time"
                value={this.state.newScheSt}
                onChange={this.handleInputChange} />
            </label>
            <label className="setLabel"> 終了時刻
                <input name="newScheEn" type="time"
                value={this.state.newScheEn}
                onChange={this.handleInputChange} />
            </label>
            <label className="setLabel"> タイトル
                <input name="newScheT" type="text"
                value={this.state.newScheT}
                onChange={this.handleInputChange} />
            </label>
            <p><button onClick={this.addSchedule}>登録</button></p>
          </form>
          <p><button onClick={this.closeModal}>close</button></p>
        </Modal>
      </div>
    );
  }
}
export default SettingModal;

/*
{this.state.schedules.map(a => (
  <div>
    <input type="text" value={a.title} onChange={this.handleInputChange} />
    <input type="text" value={a.st.h} />
    <input type="text" value={a.st.m} />
    <input type="text" value={a.en.h} />
    <input type="text" value={a.en.m} />
  </div>
))}
*/