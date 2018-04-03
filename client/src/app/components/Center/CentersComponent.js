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
    filter: Proptypes.string,
    alert: Proptypes.string,
    history: Proptypes.object,
    limit: Proptypes.number,
  }

  /**
   * constructor
   */
  constructor() {
    super();
    this.handleScroll = this.handleScroll.bind(this);
  }

  /**
   * executes after component mounts
   * @returns { void }
   */
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, false);
    CenterActions.updateCenters(this.loader);
  }

  /**
   * executes before component unmounts
   * @returns { void }
   */
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, false);
    OtherActions.resetPageLimit();
    OtherActions.updateAlertState(null);
  }

  /**
   * onScroll event handler
   * @returns { void }
   */
  handleScroll() {
    if (window.innerHeight + window.scrollY === document.body.offsetHeight &&
      this.props.limit < this.props.centers.length) {
      OtherActions.updatePageLimit();
    }
  }

  /**
   * renders component in browser
   * @returns { component } to be rendered on the page
   */
  render() {
    const { limit } = this.props;
    let pointer = 0;
    return (
      <React.Fragment>
        <div className="centers-loader success-background" ref={(input) => { this.loader = input; }} />
        <div className="centers-container">
          <div className={`${!this.props.alert ? 'hidden' : ''}`}>
            <div className="alert alert-info" role="alert">
              <strong>{this.props.alert}</strong>
            </div>
          </div>
          <div className="row">
            {
              this.props.centers.map((center) => {
              const match = new RegExp(this.props.filter, 'gi');
              if (center.name.match(match) || center.address.match(match)) {
                if (pointer < limit) {
                  pointer++;
                  return (
                    <div className="col-md-6 col-lg-4 single-center" key={center.id}>
                      <Center center={center} history={this.props.history} />
                    </div>
                  );
                }
              }
              return null;
            })
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    centers: state.centersState,
    filter: state.centerFilter,
    alert: state.alertState,
    limit: state.limit,
  };
};

export default connect(mapStateToProps)(Centers);
