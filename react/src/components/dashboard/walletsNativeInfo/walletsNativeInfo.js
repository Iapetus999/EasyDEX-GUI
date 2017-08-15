import React from 'react';
import { toggleClaimInterestModal } from '../../../actions/actionCreators';
import Store from '../../../store';
import WalletsNativeInfoRender from './walletsNativeInfo.render';

class WalletsNativeInfo extends React.Component {
  constructor(props) {
    super(props);
    this.openClaimInterestModal = this.openClaimInterestModal.bind(this);
  }

  openClaimInterestModal() {
    Store.dispatch(toggleClaimInterestModal(true));
  }

  render() {
    if (this.props &&
        this.props.Dashboard &&
        this.props.Dashboard.progress &&
        this.props.ActiveCoin.nativeActiveSection === 'settings') {
      return WalletsNativeInfoRender.call(this);
    }

    return null;
  }
}

export default WalletsNativeInfo;
