import React from 'react';
import NavBarContainer from '../navbar/navbar_container';
import AdminBarContainer from '../adminbar/admin_bar_container';

class TreasureIsland extends React.Component {
  componentDidMount() {
    const { getCurrentUser, currentUser } = this.props;
    getCurrentUser(currentUser._id);
  }

  render() {
    const { currentUser } = this.props;

    return (
      <div className="main">
        {(currentUser.email === 'admin@krma.com'
          ? <AdminBarContainer />
          : <NavBarContainer />
        )}
      </div>
    );
  }
}

export default TreasureIsland;
