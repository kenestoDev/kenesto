import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';
import createLogger from 'redux-logger';

const logger = createLogger();

//const createStoreWithMiddleware = compose(applyMiddleware(thunkMiddleware, logger))(createStore);

const createStoreWithMiddleware = compose(applyMiddleware(thunkMiddleware))(createStore);

export default function configureStore(initialState) {

    //     const store = createStore(
    //   rootReducer,
    //   applyMiddleware(thunkMiddleware , logger)
    // );


    const store = createStoreWithMiddleware(rootReducer, initialState);

    return store;
}
