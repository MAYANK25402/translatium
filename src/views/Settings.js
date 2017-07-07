/* global Windows */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';

import { parseString as parseXMLString } from 'xml2js';

import { toggleSetting, updateSetting } from '../actions/settings';
import { updateShouldShowAd } from '../actions/ad';
import { openSnackbar } from '../actions/snackbar';
import { updateStrings } from '../actions/strings';

import colorPairs from '../constants/colorPairs';
import displayLanguages from '../constants/displayLanguages';

import getPlatform from '../libs/getPlatform';
import openUri from '../libs/openUri';

class Settings extends React.Component {
  getStyles() {
    return {
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      },
      innerContainer: {
        flex: 1,
        padding: 0,
        boxSizing: 'border-box',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      },
    };
  }

  render() {
    const {
      darkMode,
      realtime,
      primaryColorId,
      chinaMode,
      displayLanguage,
      shouldShowAd,
      preventScreenLock,
      translateWhenPressingEnter,
      strings,
      onToggle,
      onSettingChange,
      onRemoveAdTouchTap,
      onRestorePurchaseTouchTap,
      onUpdateStrings,
    } = this.props;
    const styles = this.getStyles();

    return (
      <div style={styles.container}>
        <AppBar
          title={strings.settings}
          showMenuIconButton={false}
        />
        <div style={styles.innerContainer}>
          <List>
            <ListItem
              rightIconButton={(
                <IconMenu
                  iconButtonElement={(
                    <RaisedButton
                      label={strings.change}
                      primary
                    />
                  )}
                >
                  {Object.keys(colorPairs).map(colorId => (
                    <MenuItem key={`color_${colorId}`} value={colorId} primaryText={strings[colorId]} onTouchTap={() => onSettingChange('primaryColorId', colorId)} />
                  ))}
                </IconMenu>
              )}
              primaryText={strings.primaryColor}
              secondaryText={strings[primaryColorId]}
            />
            <ListItem
              rightIconButton={(
                <IconMenu
                  iconButtonElement={(
                    <RaisedButton
                      label={strings.change}
                      primary
                    />
                  )}
                >
                  {Object.keys(displayLanguages).map(langId => (
                    <MenuItem
                      key={`lang_${langId}`}
                      value={langId}
                      primaryText={displayLanguages[langId].displayName}
                      onTouchTap={() => {
                        if (langId !== displayLanguage) {
                          onSettingChange('displayLanguage', langId);
                          onUpdateStrings(langId);
                        }
                      }}
                    />
                  ))}
                </IconMenu>
              )}
              primaryText={strings.displayLanguage}
              secondaryText={displayLanguages[displayLanguage].displayName}
            />
            <ListItem
              primaryText={strings.darkMode}
              rightToggle={(
                <Toggle
                  toggled={darkMode}
                  onToggle={() => onToggle('darkMode')}
                />
              )}
            />
            <ListItem
              primaryText={strings.realtime}
              rightToggle={(
                <Toggle
                  toggled={realtime}
                  onToggle={() => onToggle('realtime')}
                />
              )}
            />
            {getPlatform() === 'windows' ? (
              <ListItem
                primaryText={strings.preventScreenLock}
                rightToggle={(
                  <Toggle
                    toggled={preventScreenLock}
                    onToggle={() => onToggle('preventScreenLock')}
                  />
                )}
              />
            ) : null}
            <ListItem
              primaryText={strings.translateWhenPressingEnter}
              rightToggle={(
                <Toggle
                  toggled={translateWhenPressingEnter}
                  onToggle={() => onToggle('translateWhenPressingEnter')}
                />
              )}
            />
            <ListItem
              primaryText={strings.chinaMode}
              rightToggle={(
                <Toggle
                  toggled={chinaMode}
                  onToggle={() => onToggle('chinaMode')}
                />
              )}
              secondaryText={strings.chinaModeDesc}
            />
            <Divider />
            {getPlatform() === 'windows' && shouldShowAd ? (
              <ListItem
                primaryText={strings.removeAds}
                onTouchTap={() => onRemoveAdTouchTap(strings)}
              />
            ) : null}
            {getPlatform() === 'windows' && shouldShowAd ? (
              <ListItem
                primaryText={strings.restorePurchase}
                secondaryText={strings.restorePurchaseDesc}
                onTouchTap={() => onRestorePurchaseTouchTap(strings)}
              />
            ) : null}
            {getPlatform() === 'windows' && !shouldShowAd ? (
              <ListItem
                primaryText={strings.removeAds}
                secondaryText={strings.activated}
              />
            ) : null}
            <Divider />
            {getPlatform() === 'windows' ? (
              <ListItem
                primaryText={strings.rateWindowsStore}
                onTouchTap={() => openUri('ms-windows-store://review/?ProductId=9wzdncrcsg9k')}
              />
            ) : null}
            {getPlatform() === 'mac' ? (
              <ListItem
                primaryText={strings.rateMacAppStore}
                onTouchTap={() => openUri('macappstore://itunes.apple.com/app/id1176624652?mt=12')}
              />
            ) : null}
            <ListItem primaryText={strings.help} onTouchTap={() => openUri('https://moderntranslator.com/support')} />
            <ListItem primaryText={strings.website} onTouchTap={() => openUri('https://moderntranslator.com')} />
            <Divider />
            <ListItem primaryText={`Version ${process.env.REACT_APP_VERSION}`} />
          </List>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  darkMode: PropTypes.bool,
  primaryColorId: PropTypes.string,
  preventScreenLock: PropTypes.bool,
  translateWhenPressingEnter: PropTypes.bool,
  realtime: PropTypes.bool,
  chinaMode: PropTypes.bool,
  displayLanguage: PropTypes.string,
  shouldShowAd: PropTypes.bool,
  strings: PropTypes.objectOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  onSettingChange: PropTypes.func.isRequired,
  onRemoveAdTouchTap: PropTypes.func.isRequired,
  onRestorePurchaseTouchTap: PropTypes.func.isRequired,
  onUpdateStrings: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  darkMode: state.settings.darkMode,
  primaryColorId: state.settings.primaryColorId,
  preventScreenLock: state.settings.preventScreenLock,
  translateWhenPressingEnter: state.settings.translateWhenPressingEnter,
  realtime: state.settings.realtime,
  chinaMode: state.settings.chinaMode,
  displayLanguage: state.settings.displayLanguage,
  shouldShowAd: state.ad.shouldShowAd,
  strings: state.strings,
});

const mapDispatchToProps = dispatch => ({
  onToggle: name => dispatch(toggleSetting(name)),
  onSettingChange: (name, value) => dispatch(updateSetting(name, value)),
  onRemoveAdTouchTap: (strings) => {
    const currentApp = process.env.NODE_ENV === 'production' ? Windows.ApplicationModel.Store.CurrentApp
                    : Windows.ApplicationModel.Store.CurrentAppSimulator;

    const purchaseStatus = Windows.ApplicationModel.Store.ProductPurchaseStatus;

    currentApp.requestProductPurchaseAsync('remove.ads.durable')
      .done((purchaseResults) => {
        if (purchaseResults.status === purchaseStatus.succeeded) {
          dispatch(updateShouldShowAd(false));
        }
      }, () => {
        dispatch(openSnackbar(strings.somethingWentWrong));
      });
  },
  onRestorePurchaseTouchTap: (strings) => {
    const currentApp = process.env.NODE_ENV === 'production' ? Windows.ApplicationModel.Store.CurrentApp
                    : Windows.ApplicationModel.Store.CurrentAppSimulator;

    const purchaseStatus = Windows.ApplicationModel.Store.ProductPurchaseStatus;

    currentApp.getAppReceiptAsync().done((xmlReceipt) => {
      parseXMLString(xmlReceipt, (err, receipt) => {
        if (err) return;
        // const licenseType = receipt.Receipt.AppReceipt[0].$.LicenseType;

        const purchaseDate = receipt.Receipt.AppReceipt[0].$.PurchaseDate;

        if (new Date(purchaseDate) <= new Date('2017-05-15T05:00:00Z')) {
          currentApp.requestProductPurchaseAsync('remove.ads.free')
            .done((purchaseResults) => {
              if (purchaseResults.status === purchaseStatus.succeeded) {
                dispatch(updateShouldShowAd(false));
              }
            }, () => {
              dispatch(openSnackbar(strings.somethingWentWrong));
            });
        } else {
          dispatch(openSnackbar(strings.notQualified));
        }
      });
    }, () => {
      dispatch(openSnackbar(strings.somethingWentWrong));
    });
  },
  onUpdateStrings: langId => dispatch(updateStrings(langId)),
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(Settings);

// f