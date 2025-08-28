const helper = require('@iobroker/vis-2-widgets-testing');

describe('vis-2-widgets-react-template', () => {
    before(async function () {
        this.timeout(180000);
        // install js-controller, web and vis-2-beta
        await helper.startIoBroker();
        await helper.startBrowser(process.env.CI === 'true' ? 'new' : false);
        await helper.createProject();

        // open widgets
        await helper.palette.openWidgetSet(null, 'vis-2-widgets-react-template');
        await helper.screenshot(null, '02_widgets_opened');
    });

    after(async function () {
        this.timeout(5000);
        await helper.stopBrowser();
        return helper.stopIoBroker();
    });
});
