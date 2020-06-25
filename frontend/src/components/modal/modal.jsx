import React from 'react';
import { connect } from 'react-redux';

import { closeModal } from '../../actions/modal_actions';
import CreateImageTreasureContainer from '../treasure/create_image_treasure_container';
import CreateStringTreasureContainer from '../treasure/create_string_treasure_container';
import RetrieveTreasureContainer from '../retrieve_treasure/retrieve_treasure_container';
import ImageContainer from '../image/image_container';
import ReportTreasureContainer from '../report_treasure/report_treasure_container';
import './modal.css';

const Modal = ({ modal, closeModal }) => {
  if (!modal) return null;

  let component;
  switch (Object.keys(modal)[0]) {
    case 'photo':
      component = <CreateImageTreasureContainer />;
      break;
    case 'type':
      component = <CreateStringTreasureContainer type={modal.type} />;
      break;
    case 'retrieve':
      component = <RetrieveTreasureContainer />;
      break;
    case 'image':
      component = <ImageContainer treasure={modal.image} />;
      break;
    case 'report':
      component = <ReportTreasureContainer treasure={modal.image} />;
      break;
    default:
      return null;
  }
  return (
    <div className="modal-background" onClick={closeModal}>
      <div className="modal-child" onClick={(e) => e.stopPropagation()}>
        {component}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  modal: state.ui.modal,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
