import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Import Style
import styles from './App.css';

// Import Components
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Import Actions
import { toggleAddWorkspace } from './AppActions';
import { switchLanguage } from '../../modules/Intl/IntlActions';
import { loadUserProps, logout } from '../../modules/User/UserActions';

// Import cookie
import cookie from 'react-cookie';
import { fetchWorkspaces } from '../Workspace/WorkspaceActions';
import { getWorkspace } from '../Workspace/WorkspaceReducer';
import { browserHistory } from 'react-router';


export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
    this.props.dispatch(fetchWorkspaces());    
  }

  componentWillMount() {
    const loginResult = cookie.load('mernAuth');
    console.log(loginResult)
    const token = loginResult ? loginResult.t : null;
    const username = loginResult ? loginResult.u : null;
    if(this.props.user == null && token && username) {
      this.props.dispatch(loadUserProps( {token: token, username: username} ));
    } 
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log(nextProps)
      if(nextProps.user) {
        browserHistory.push(nextProps.user.user.workspace_title);
      }
  }
    
  handleLogout = () => {
    this.props.dispatch(logout());
  };

  toggleAddWorkspaceSection = () => {
    this.props.dispatch(toggleAddWorkspace());
  };

  render() {
    console.log(JSON.stringify(this.props.params))
    return (
      <div>
        {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <div>
          <Helmet
            title="MERN Starter - Blog App"
            titleTemplate="%s - Blog App"
            meta={[
              { charset: 'utf-8' },
              {
                'http-equiv': 'X-UA-Compatible',
                content: 'IE=edge',
              },
              {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
              },
            ]}
          />
          <Header
            switchLanguage={lang => this.props.dispatch(switchLanguage(lang))}
            intl={this.props.intl}
            toggleAddWorkspace={this.toggleAddWorkspaceSection}
            logout={this.handleLogout}
            user={this.props.user}
            params={this.props.params}
          />
          <div className={styles.container}>
            {this.props.children}
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
    user: store.user.data
  };
}

export default connect(mapStateToProps)(App);
