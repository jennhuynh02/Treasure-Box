import React from 'react';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.deleteUser = this.deleteUser.bind(this);
  }

  deleteUser() {
    const { deleteSelectedUser, user } = this.props;
    deleteSelectedUser(user._id);
    window.location.reload();
  }

  render() {
    const { user } = this.props;
    return (
      <div className="user-box">
        <div>
          <h1>
            {user.firstName}
            {' '}
            {user.lastName}
          </h1>
          <h1>{user.email}</h1>
          <br />
          <button type="button" className="user-delete-button" onClick={this.deleteUser}>Delete User</button>
        </div>
      </div>
    );
  }
}

export default User;
