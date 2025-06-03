import React from 'react';
import { Card, CardContent } from '@mui/material';

class DemoWidget extends window.visRxWidget {
    static adapter;
    static getWidgetInfo() {
        return {
            id: 'tplDemoWidget',
            visSet: 'vis-2-widgets-react-template',
            visSetLabel: 'vis_2_widgets_template', // Widget set translated label (should be defined only in one widget of a set)
            visSetColor: '#cf00ff', // Color of a widget set. it is enough to set color only in one widget of a set
            visName: 'DemoWidget', // Name of widget
            visAttrs: [
                {
                    name: 'common', // group name
                    fields: [
                        {
                            name: 'type', // name in data structure
                            label: 'type', // translated field label
                            type: 'select',
                            options: ['all', 'current', 'days'],
                            default: 'all',
                        },
                    ],
                },
                {
                    name: 'private', // group name
                    label: 'private', // translated group label
                    fields: [
                        {
                            name: 'oid', // name in data structure
                            type: 'id',
                            label: 'oid', // translated field label
                        },
                    ],
                },
                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visPrev:
                'widgets/vis-2-widgets-react-template/img/vis-widget-demo.png',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    propertiesUpdate() {
        // The widget has 3 important states
        // 1. this.state.values - contains all state values, that are used in widget (automatically collected from widget info).
        //                        So you can use `this.state.values[this.state.rxData.oid + '.val']` to get the value of state with id this.state.rxData.oid
        // 2. this.state.rxData - contains all widget data with replaced bindings. E.g. if this.state.data.type is `{system.adapter.admin.0.alive}`,
        //                        then this.state.rxData.type will have state value of `system.adapter.admin.0.alive`
        // 3. this.state.rxStyle - contains all widget styles with replaced bindings. E.g. if this.state.styles.width is `{javascript.0.width}px`,
        //                        then this.state.rxData.type will have state value of `javascript.0.width` + 'px
    }

    componentDidMount() {
        super.componentDidMount();

        // Update data
        this.propertiesUpdate();
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return DemoWidget.getWidgetInfo();
    }

    // If the "prefix" attribute in translations.ts is true or string, you must implement this function.
    // If true, the adapter name + _ is used.
    // If string, then this function must return exactly that string
    static getI18nPrefix() {
        return `${DemoWidget.adapter}_`;
    }

    // This function is called every time when rxData is changed
    onRxDataChanged() {
        this.propertiesUpdate();
    }

    // This function is called every time when rxStyle is changed
    // eslint-disable-next-line class-methods-use-this
    onRxStyleChanged() {}

    // This function is called every time when some Object State updated, but all changes lands into this.state.values too
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    onStateUpdated(id, state) {}

    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        const text = DemoWidget.t('My Demo widget:');

        return (
            <Card style={{ width: '100%', height: '100%' }}>
                <CardContent>
                    {text} {this.state.values[`${this.state.rxData.oid}.val`]}
                </CardContent>
            </Card>
        );
    }
}

export default DemoWidget;
