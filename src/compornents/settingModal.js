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
    let editId = (props.schedules.list.length > 0) ? props.schedules.list[0].id : 0;
    this.state = {
      modalIsOpen: false,
      schedules: props.schedules,
      schedulesHandler: props.schedulesHandler,
      showsAll: parseFlg(props.showsAll),
      showsAllHandler: props.showsAllHandler,
      apprNum: props.apprNum,
      apprNumHandler: props.apprNumHandler,
      color: props.color,
      colorHandler: props.colorHandler,
      newScheSt: "00:00",
      newScheEn: "00:00",
      newScheT: "",
      editedScheSt: "00:00",
      editedScheEn: "00:00",
      editedScheT: "",
      editId: editId
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);

    this.addSchedule = this.addSchedule.bind(this);
    this.rmSchedule = this.rmSchedule.bind(this);
    this.editSchedule = this.editSchedule.bind(this);
  }

  zeroPad(num, len) {
    let rslt = "";
    for (let i = 0; i < len; i += 1) rslt += "0";
    return (rslt + num).slice(-len);
  };

  initEditedSche(id = this.state.editId) {
    if (this.state.schedules.list.length <= 0) return -1;
    let sli = this.state.schedules.list.find(sli => sli.id === id);
    this.setState({
      editedScheSt: this.parseTimeStr(sli.st),
      editedScheEn: this.parseTimeStr(sli.en),
      editedScheT: sli.title
    });
  }

  parseTimeStr(time) {
    return this.zeroPad(time.h, 2) + ":" + this.zeroPad(time.m, 2);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
    this.initEditedSche();
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
      case ("rmOpt"):
        value = parseInt(value);
        this.setState({ editId: value });
        this.initEditedSche(value);
        break;
      case ("editedScheSt"):
        this.setState({ [name]: value });
        this.editSchedule(null, value, null, null);
        break;
      case ("editedScheEn"):
        this.setState({ [name]: value });
        this.editSchedule(null, null, value, null);
        break;
      case ("editedScheT"):
        this.setState({ [name]: value });
        this.editSchedule(null, null, null, value);
        break;
      default:
        this.setState({ [name]: value });
        break;
    }
  }

  addSchedule() {
    let schedules = this.state.schedules;
    let st = this.parseTimeObj(this.state.newScheSt);
    let en = this.parseTimeObj(this.state.newScheEn);
    let newSche = {
      id: schedules.nextId,
      st: st,
      en: en,
      title: this.state.newScheT
    }
    schedules.list.push(newSche);
    schedules.nextId += 1;
    this.state.schedulesHandler(schedules);
    // TODO: newScheEStを最後のEn時間に
    this.setState({ newScheSt: "00:00", newScheEn: "00:00", newScheT: "" });
    // TODO: バリデーション st<enか
  }

  rmSchedule() {
    let id = this.state.editId;
    let schedules = this.state.schedules;
    schedules.list = schedules.list.filter((sli) => { return sli.id !== id });
    this.state.schedulesHandler(schedules);
    let nextEditId = (schedules.list.length > 0) ? schedules.list[0].id : 0;
    this.setState({ editId: nextEditId });
    this.initEditedSche(nextEditId);
  }

  editSchedule(id, st, en, title) {
    id = id || this.state.editId;
    let schedules = this.state.schedules;
    if (schedules.list.length <= 0) return -1;
    let index;
    for (index = schedules.list.length - 1; index >= 0; index--) {
      if (schedules.list[index].id === id) break;
    }
    st = this.parseTimeObj(st || this.state.editedScheSt);
    en = this.parseTimeObj(en || this.state.editedScheEn);
    title = title || schedules.list[index].title;
    schedules.list[index] = {
      id: id,
      st: st,
      en: en,
      title: title
    }
    this.state.schedulesHandler(schedules);
  }

  parseTimeObj(HMStr) {
    return { h: parseInt(HMStr.slice(0, 2)), m: parseInt(HMStr.slice(-2)) };
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
          </form>

          <hr />
          <form onSubmit={this.submitHandle}>
            <h2>予定編集・削除</h2>
            <label className="setLabel"> 予定選択
              <select value={this.state.editId} name="rmOpt"
                onChange={this.handleInputChange} >
                {this.state.schedules.list.map(a => (
                  <option
                    label={a.title + "(" + ("00" + a.st.h).slice(-2) +
                      ":" + ("00" + a.st.m).slice(-2) + "~)"}
                    value={a.id} key={a.id} />
                ))}
              </select>
            </label>

            <label className="setLabel"> 開始時刻
                <input name="editedScheSt" type="time"
                value={this.state.editedScheSt}
                onChange={this.handleInputChange} />
            </label>
            <label className="setLabel"> 終了時刻
                <input name="editedScheEn" type="time"
                value={this.state.editedScheEn}
                onChange={this.handleInputChange} />
            </label>
            <label className="setLabel"> タイトル
                <input name="editedScheT" type="text"
                value={this.state.editedScheT}
                onChange={this.handleInputChange} />
            </label>
            <p><button onClick={this.rmSchedule}>削除</button></p>
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