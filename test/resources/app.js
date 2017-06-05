
class Base {
    constructor(opts) {
        this.optSwitchFlag = opts.switchFlag;
        this.optFilterBaiduAdFlag = opts.filterBaiduAdFlag;
    }

    restoreOptions(callback) {
        chrome.storage.sync.get({
            switchFlag: true,
            filterBaiduAdFlag: true
        }, function(opts) {
            callback(opts);
        });
    }

    getPageName() {
        var url = window.location.href.split('?');
        let pageName = url[0].replace('https://','').replace(window.location.host+'/', '');
        return pageName;
    }
}

class Google extends Base {

    constructor(opts) {
        super(opts);
        if(this.getPageName() == 'search' && this.optSwitchFlag) { //check switch flag
            this.initQueryString();
            this.addSwitchLink();
        }
        console.info('Goobai: Google initialized!');
    };

    initQueryString() {
        var self = this;
        this.queryString = $('#lst-ib').val();
        $('#lst-ib').change(function() {
            self.queryString = $('#lst-ib').val();
        });
    }


    addSwitchLink() {
        var self = this;
        let linkButton = $('<input type="button" value="百度一下" />').css({ position: 'absolute', top: 4, left: 800, height: 40, lineHeight: '40px', padding: '0 24px', color: '#fff', fontSize: 16, background: '#3385ff', border: 0, borderBottom: '1px solid #2d78f4', cursor: 'pointer' }).click(function() {
            self.goAnother();
        });
        $(linkButton).appendTo('.tsf-p');
    }

    goAnother() {
        top.location.href = 'https://www.baidu.com/s?ie=utf-8&wd=' + this.queryString;
    }

    clearAd() {
        // do something...
    }

}

class Baidu extends Base {

    constructor(opts) {
        super(opts);
        if(this.getPageName() == 's' && this.optSwitchFlag) { //check switch flag
            this.initQueryString();
            this.addSwitchLink();
        }
        if(this.optFilterBaiduAdFlag) { //check filter ad flag
            let self = this;
            self.filterAd();
            $('body').on('DOMSubtreeModified', '#content_left', function() {
                setTimeout(function() {
                    self.filterAd();
                }, 100);
            });
        }
        console.info('Goobai: Baidu initialized!');
    }

    initQueryString() {
        var self = this;
        this.queryString = $('#kw').val();
        $('#kw').change(function() {
            self.queryString = $('#kw').val();
        });
    }


    addSwitchLink() {
        var self = this;
        let linkButton = $('<input type="button" value="Google" class="bg s_btn">').css({ marginLeft: 15, background: '#ea4335', borderBottom: '1px solid #ea4335' }).click(function() {
            self.goAnother();
        });
        $(linkButton).insertAfter('#form input[type=submit]');
    }

    goAnother() {
        top.location.href = 'https://www.google.com/search?newwindow=1&q=' + this.queryString;
    }

    filterAd() {
        $('#content_left > div[id]').filter(function() {
            let id = Number( $(this).attr('id') );
            return id > 1000;
        }).each(function () {
            $(this).css({ background: '#fffae7' });
            $(this).find('span').filter(function() {
                return $(this).text() == '广告';
            }).css({ color: '#d41630' });
        });
    }

}

class App {

    constructor() {
        let self = this;
        chrome.storage.sync.get({
            switchFlag: true,
            filterBaiduAdFlag: true
        }, function(opts) {
            let site = self.getSite();
            if(/baidu/.test(site)) {
                new Baidu(opts);
            } else if(/google/.test(site)) {
                new Google(opts);
            }
        });
    };

    getSite() {
        return window.location.host;
    };

}

//initialize
new App();

