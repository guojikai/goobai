
class Options {

    constructor() {
        var self = this;
        this.restoreOptions(function(opts) {
            self.optSwitchFlag = opts.switchFlag;
            self.optFilterBaiduAdFlag = opts.filterBaiduAdFlag;
            self.render();
        });
        this.bindActions();
    }

    restoreOptions(callback) {
        chrome.storage.sync.get({
            switchFlag: true,
            filterBaiduAdFlag: true
        }, function(opts) {
            callback(opts);
        });
    }

    saveOptions() {
        this.optSwitchFlag = $('#switchFlagBox').prop('checked');
        this.optFilterBaiduAdFlag = $('#filterBaiduAdFlagBox').prop('checked');
        chrome.storage.sync.set({
            switchFlag: this.optSwitchFlag,
            filterBaiduAdFlag: this.optFilterBaiduAdFlag
        }, function() {
            $('#tip').text('保存成功！');
            setTimeout(function() {
                $('#tip').text('');
            }, 750);
        });
    }

    bindActions() {
        var self = this;
        $('#switchFlagBox').click(this.saveOptions);
        $('#filterBaiduAdFlagBox').click(this.saveOptions);
    }

    render() {
        $('#switchFlagBox').prop('checked', this.optSwitchFlag);
        $('#filterBaiduAdFlagBox').prop('checked', this.optFilterBaiduAdFlag);
    }
}

//initialize
new Options();

