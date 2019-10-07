import React from 'react';
import { mount } from 'enzyme';
import { Tab } from '$Components/Tab';

describe( 'Tab', () => {
    let wrapper;
    let instance;
    let props;

    beforeEach( () => {
        props = {
            url: 'about:blank',
            index: 1,
            updateTab: jest.fn(),
            setActiveTab: jest.fn(),
            addNotification: jest.fn(),
            tabBackwards: jest.fn(),
            closeTab: jest.fn(),
            addTab: jest.fn(),
            addTabEnd: jest.fn()
        };

        wrapper = mount( <Tab {...props} /> );
        instance = wrapper.instance();
    } );

    describe( 'constructor( props )', () => {
        it( 'should have name Tab', () => {
            expect( instance.constructor.name ).toBe( 'Tab' );
        } );
    } );

    describe( 'componentDidUpdate( prevProps )', () => {
    // these tests are somewhat backwards as `prevProps` is taken.
    // Still the comparison is valid, as long as there's a change, we should
    // see updates called
        it( 'should not call loadUrl with the same url without a slash', () => {
            instance.webview = { src: 'about:blank' };
            instance.loadURL = jest.fn();
            instance.state = {
                browserState: { mountedAndReady: true }
            };

            instance.componentDidUpdate( { url: 'about:blank' } );
            expect( instance.loadURL.mock.calls.length ).toBe( 0 );
        } );

        it( 'should call loadUrl with a different url ', () => {
            instance.webview = { src: 'about:blank' };
            instance.loadURL = jest.fn();
            instance.state = {
                browserState: { mountedAndReady: true }
            };

            instance.componentDidUpdate( { url: 'about:blank' } );
            expect( instance.loadURL.mock.calls.length ).toBe( 0 );

            instance.componentDidUpdate( { url: 'previousHello' } );
            expect( instance.loadURL.mock.calls.length ).toBe( 1 );
        } );
    } );

    describe( 'didFailLoad', () => {
        beforeEach( () => {
            props = {
                url: '',
                index: 1,
                updateTab: jest.fn(),
                setActiveTab: jest.fn(),
                addNotification: jest.fn(),
                tabBackwards: jest.fn(),
                closeTab: jest.fn(),
                addTab: jest.fn(),
                addTabEnd: jest.fn()
            };

            wrapper = mount( <Tab {...props} /> );
            instance = wrapper.instance();
        } );

        it( 'should exist', () => {
            expect( instance.didFailLoad ).not.toBeUndefined();
        } );

        it( 'should call addNotification when ERR_BLOCKED_BY_CLIENT and trigger a tabUpdate if no canGoBack', () => {
            instance.didFailLoad( { errorDescription: 'ERR_BLOCKED_BY_CLIENT' } );
            expect( props.addNotification ).toHaveBeenCalled();
        } );

        it( 'trigger a closeTab if no canGoBack', () => {
            instance.didFailLoad( { errorDescription: 'ERR_BLOCKED_BY_CLIENT' } );
            expect( props.addNotification ).toHaveBeenCalled();
            expect( props.tabBackwards ).not.toHaveBeenCalled();
            expect( props.closeTab ).toHaveBeenCalled();
        } );

        it( 'trigger tabBackwards() if tab canGoBack', () => {
            instance.state = {
                browserState: { canGoBack: true }
            };

            instance.didFailLoad( {
                errorDescription: 'ERR_BLOCKED_BY_CLIENT',
                validatedURL: ''
            } );
            expect( props.addNotification ).toHaveBeenCalled();
            expect( props.tabBackwards ).toHaveBeenCalled();
            expect( props.closeTab ).not.toHaveBeenCalled();
        } );
    } );
} );
