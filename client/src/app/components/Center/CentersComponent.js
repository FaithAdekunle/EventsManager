import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import Center from './CenterComponent';
import OtherActions from '../../actions/others';
import CenterActions from '../../actions/centerActions';

/**
 * Centers component class
 */
class Centers extends React.Component {
  static propTypes = {
    centers: Proptypes.array,
    alert: Proptypes.string,
    history: Proptypes.object,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.offset = 0;
    this.limit = 2;
    this.handleScroll = this.handleScroll.bind(this);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, false);
    CenterActions.updateCenters(this.mainLoader, this.offset, this.limit);
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
    OtherActions.updateAlertState(null);
    CenterActions.emptyCentersState();
  }

  /**
   * onScroll event handler
   * @returns { void }
   */
  handleScroll() {
    if (window.innerHeight + window.scrollY === document.body.offsetHeight) {
      this.offset += 2;
      CenterActions.updateCenters(this.subLoader, this.offset, this.limit);
    }
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    return (
      <React.Fragment>
        <div className="centers-loader" ref={(input) => { this.mainLoader = input; }} />
        <div className="centers-container">
          {
            this.props.alert ? (
              <div className="alert alert-info" role="alert">
                <strong>{this.props.alert}</strong>
              </div>
            ) : ''
          }
          {
            this.props.centers.length > 0 ? (
              <div className="row">
                {
                  this.props.centers.map((center) => {
                    return (
                      <div className="col-md-6 col-lg-4 single-center" key={center.id}>
                        <Center center={center} history={this.props.history} />
                      </div>
                    );
                  })
              }
              </div>
            ) : ''
          }
          <div className="centers-loader" ref={(input) => { this.subLoader = input; }} />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    centers: state.centersState,
    alert: state.alertState,
  };
};

export default connect(mapStateToProps)(Centers);
