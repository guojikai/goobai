
class Base {

    constructor(options) {
        this.options = options
    }

    restoreOptions(callback) {
        chrome.storage.sync.get({
            switchFlag: true,
            removeBaiduAdFlag: true
        }, function(opts) {
            callback(opts);
        });
    }
}

class Google extends Base {

    constructor(options) {
        super(options);
        if(this.options.switchFlag) { //check switch flag
            this.getQueryString();
            this.addSwitchLink();
        }
        console.info('Goobai: Google initialized!');
    };

    getQueryString() {
        return $('#lst-ib').val();
    }

    addSwitchLink() {
        var self = this;
        let linkButton = $('<input type="button" value="百度一下" />').css({ position: 'absolute', top: 4, left: 800, height: 40, lineHeight: '40px', padding: '0 24px', color: '#fff', fontSize: 16, background: '#3385ff', border: 0, borderBottom: '1px solid #2d78f4', cursor: 'pointer' }).click(function() {
            self.gotoGoogle();
        });
        $(linkButton).appendTo('.tsf-p');
    }

    gotoGoogle() {
        top.location.href = 'https://www.baidu.com/s?ie=utf-8&wd=' + this.getQueryString();
    }

    removeAd() {
        // do something...
    }

}

class Baidu extends Base {

    constructor(options) {
        super(options);
        if(this.options.switchFlag) { //check switch flag
            this.getQueryString();
            this.addSwitchLink();
        }
        //check ad flags
        if(this.options.highlightBaiduAdFlag) {
            this.highlightAd();
            $('body').on('DOMSubtreeModified', '#content_left', () => {
                setTimeout(() => { this.highlightAd(); }, 100);
            });
        }
        if(this.options.removeBaiduAdFlag) {
            this.removeAd();
            $('body').on('DOMSubtreeModified', '#content_left', () => {
                setTimeout(() => { this.removeAd(); }, 100);
            });
        }
        console.info('Goobai: Baidu initialized!');
    }

    getQueryString() {
        return $('#kw').val();
    }


    addSwitchLink() {
        var self = this;
        let linkButton = $('<input type="button" value="Google" class="bg s_btn" style="border-radius: 10px;">').css({ marginLeft: 15, background: '#ea4335', borderBottom: '1px solid #ea4335' }).click(function() {
            self.gotoBaidu();
        });
        $('#form .s_btn_wr').css('width', '240px');
        $(linkButton).insertAfter('#form input[type=submit]');
    }

    gotoBaidu() {
        top.location.href = 'https://www.google.com/search?newwindow=1&q=' + this.getQueryString();
    }

    highlightAd() {
        $('#content_left > div').each((k, ele) => {
            var isAd = $(ele).attr('class') == undefined
            if (!isAd) return null;
            $(ele).css('background', '#fffae7');
        });
    }
    removeAd() {
        $('#content_left > div').each((k, ele) => {
            const isAd = $(ele).attr('class') == undefined
            if (!isAd) return null;
            $(ele).remove();
        });
    }

}

class App {

    constructor() {
        let self = this;
        chrome.storage.sync.get({
            switchFlag: true,
            highlightGoogleAdFlag: true,
            removeGoogleAdFlag: false,
            highlightBaiduAdFlag: true,
            removeBaiduAdFlag: false
        }, (options) => {
            if(self.isBaidu()) {
                new Baidu(options);
            } else if(self.isGoogle()) {
                new Google(options);
            }
        });
    }

    getPageName() {
        var url = window.location.href.split('?');
        let pageName = url[0].replace('https://','').replace(window.location.host+'/', '');
        return pageName;
    }

    isGoogle() {
        return /google/.test(window.location.host) && this.getPageName() === 'search'
    }
    isBaidu() {
        return /baidu/.test(window.location.host) && this.getPageName() === 's'
    }

}

//initialize
new App();

