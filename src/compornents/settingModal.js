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
      showsAll: parseFlg(props.showsAll),
      showsAllHandler: props.showsAllHandler,
      apprNum: props.apprNum,
      apprNumHandler: props.apprNumHandler
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
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
    switch (event.target.name) {
      case ("showsAll"):
        const checked = event.target.checked;
        this.setState({ showsAll: checked });
        this.state.showsAllHandler(checked);
        break;
      case ("apprNum"):
        const value = parseInt(event.target.value);
        if (value < 2) break; // 2未満にはしない
        this.setState({ apprNum: value });
        this.state.apprNumHandler(value);
        break;
      default:
        break;
    }
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

            <p><button onClick={this.closeModal}>close</button></p>
          </form>
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