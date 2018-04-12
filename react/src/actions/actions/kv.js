import {
  DASHBOARD_ACTIVE_COIN_SENDTO,
} from '../storeType';
import translate from '../../translate/translate';
import {
  triggerToaster,
  sendToAddressState,
} from '../actionCreators';
import Config from '../../config';
import Store from '../../store';
import fetchType from '../../util/fetchType';

export const sendKV = (str) => {
  console.warn('sendKV', str);

  return dispatch => {
    const payload = {
      mode: null,
      chain: 'KV',
      cmd: 'kvupdate',
      rpc2cli: Config.rpc2cli,
      token: Config.token,
      params: null,
    };

    fetch(
      `http://127.0.0.1:${Config.agamaPort}/shepherd/cli`,
      fetchType(JSON.stringify({ payload })).post
    )
    .catch((error) => {
      console.log(error);
      dispatch(
        triggerToaster(
          'sendKV',
          'Error',
          'error'
        )
      );
    })
    .then((response) => {
      const _response = response.text().then((text) => { return text; });
      return _response;
    })
    .then((json) => {
      if (json.indexOf('"code":') > -1) {
        let _message = json.substring(
          `${json.indexOf('"message":"') + 11}`,
          json.indexOf('"},"id":"jl777"')
        );

        if (json.indexOf('"code":-4') > -1) {
          dispatch(
            triggerToaster(
              translate('API.WALLETDAT_MISMATCH'),
              translate('TOASTR.WALLET_NOTIFICATION'),
              'info',
              false
            )
          );
        } else if (json.indexOf('"code":-5') > -1) {
          dispatch(
            triggerToaster(
              translate('TOASTR.INVALID_ADDRESS', coin),
              translate('TOASTR.WALLET_NOTIFICATION'),
              'error',
            )
          );
        } else {
          if (Config.rpc2cli) {
            _message = JSON.parse(json).error.message;
          }

          dispatch(
            triggerToaster(
              _message,
              translate('TOASTR.WALLET_NOTIFICATION'),
              'error'
            )
          );
        }
      } else {
        dispatch(sendToAddressState(JSON.parse(json).result));
        dispatch(
          triggerToaster(
            translate('TOASTR.TX_SENT_ALT'),
            translate('TOASTR.WALLET_NOTIFICATION'),
            'success'
          )
        );
      }
    });
  }
}