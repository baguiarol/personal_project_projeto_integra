import React from 'react';
import {connect} from "react-redux";
import {AnonymousCredential} from 'mongodb-stitch-browser-sdk';
import Actions from "../../redux/actions/actions";

const LoginPage = ({mongoClient, userLogged, setUserLogged}) => {

    React.useEffect(() => {
        //Anonymous Login
        if (mongoClient) {
            mongoClient.auth.loginWithCredential(new AnonymousCredential())
                .then(user => {
                    setUserLogged(user);
                    console.log(user);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    });

    return (
        <div>
            <h1>Hello World!</h1>
            <p>User Logged: {userLogged ? userLogged.id : 'none'}</p>
        </div>
    )
};

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient,
    database: state.general.database,
    userLogged: state.general.userLogged
});

const mapDispatchToProps = dispatch => ({
    setUserLogged: user =>
        dispatch({type: Actions.setUserLogged, payload: user})
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)