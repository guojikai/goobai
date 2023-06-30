
class Options {

    constructor() {
        this.restoreOptions(() => {
            this.render();
        });
        this.bindActions();
    }

    restoreOptions(callback) {
        chrome.storage.sync.get({
            switchFlag: true,
            highlightGoogleAdFlag: true,
            removeGoogleAdFlag: false,
            highlightBaiduAdFlag: true,
            removeBaiduAdFlag: false
        }, (options) => {
            this.options = options
            callback();
        });
    }

    saveOptions(ele) {
        if ($(ele.currentTarget).attr('id') == 'highlightBaiduAdFlagBox' && $('#highlightBaiduAdFlagBox').prop('checked')) $('#removeBaiduAdFlagBox').prop('checked', false)
        if ($(ele.currentTarget).attr('id') == 'removeBaiduAdFlagBox' && $('#removeBaiduAdFlagBox').prop('checked')) $('#highlightBaiduAdFlagBox').prop('checked', false)
        if ($(ele.currentTarget).attr('id') == 'highlightGoogleAdFlagBox' && $('#highlightGoogleAdFlagBox').prop('checked')) $('#removeGoogleAdFlagBox').prop('checked', false)
        if ($(ele.currentTarget).attr('id') == 'removeGoogleAdFlagBox' && $('#removeGoogleAdFlagBox').prop('checked')) $('#highlightGoogleAdFlagBox').prop('checked', false)

        this.options.switchFlag = $('#switchFlagBox').prop('checked');
        this.options.highlightBaiduAdFlag = $('#highlightBaiduAdFlagBox').prop('checked');
        this.options.removeBaiduAdFlag = $('#removeBaiduAdFlagBox').prop('checked');
        this.options.highlightGoogleAdFlag = $('#highlightGoogleAdFlagBox').prop('checked');
        this.options.removeGoogleAdFlag = $('#removeGoogleAdFlagBox').prop('checked');
        if (this.options.removeBaiduAdFlag) this.options.highlightBaiduAdFlag = false
        if (this.options.removeGoogleAdFlag) this.options.highlightGoogleAdFlag = false

        chrome.storage.sync.set(this.options, () => {
            $('#tip').text('保存成功！');
            setTimeout(() => {
                $('#tip').text('');
            }, 750);
        });
    }

    bindActions() {
        $('#boxes input').on('click', (e) => {
            this.saveOptions(e)
        });
    }

    render() {
        $('#switchFlagBox').prop('checked', this.options.switchFlag);
        $('#highlightBaiduAdFlagBox').prop('checked', this.options.highlightBaiduAdFlag);
        $('#removeBaiduAdFlagBox').prop('checked', this.options.removeBaiduAdFlag);
        $('#highlightGoogleAdFlagBox').prop('checked', this.options.highlightGoogleAdFlag);
        $('#removeGoogleAdFlagBox').prop('checked', this.options.removeGoogleAdFlag);
    }
}

//initialize
new Options();

