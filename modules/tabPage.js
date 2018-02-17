layui.define(['jquery', 'element'], (exports) => {
    let $ = layui.$,
        element = layui.element,
        MOD_NAME = 'tabPage',
        FILTER_LAYOUT_TAB_PAGES = 'layout-tab-pages',
        TabPage = function () {
            this.config = {};
        };
    /**
     * {
     *      href: ''
     *      id: ''
     *      title: ''
     *      allowClose: false
     * }
     **/
    TabPage.prototype.tabAdd = function (options, filter = FILTER_LAYOUT_TAB_PAGES) {
        let TITLE = '.layui-tab-title',
            $tabElem = $('.layui-tab[lay-filter=' + filter + ']'),
            $titElem = $tabElem.children(TITLE),
            $contElem = $('.layui-tab-content[lay-filter=' + filter + ']'),
            li = '<li lay-id="' + (options.id || '') + '" allow-close="' + (options.allowClose) + '">' + (options.title || 'unnaming') + '</li>',
            CLOSE = 'layui-tab-close'
        ;

        $.get(options.href, (html) => {
            // tab
            let $li = $(li);
            $titElem.append($li);
            if (options.allowClose
                && !$li.find('.' + CLOSE)[0]) {
                let $close = $('<i class="layui-icon layui-unselect ' + CLOSE + '">&#x1006;</i>');
                $close.on('click', call.tabDelete);
                $li.append($close);
            }

            // content
            $contElem.children('.layui-tab-item').removeClass('layui-show');
            $contElem.append('<div class="layui-tab-item layui-show" lay-id="' + (options.id || '') + '">' + (html || '') + '</div>');
            element.tabChange(filter, options.href);

            // 调整
            call.tabAuto.call($tabElem, 'add');
        });

        return this;
    };
    TabPage.prototype.preTabPage = function (filter = FILTER_LAYOUT_TAB_PAGES) {
        let TITLE = '.layui-tab-title',
            $tabElem = $('.layui-tab[lay-filter=' + filter + ']')
        ;
        call.preTabPage.call($tabElem);

    };
    TabPage.prototype.nextTabPage = function (filter = FILTER_LAYOUT_TAB_PAGES) {
        let TITLE = '.layui-tab-title',
            $tabElem = $('.layui-tab[lay-filter=' + filter + ']')
        ;
        call.nextTabPage.call($tabElem);

    };
    TabPage.prototype.closeOtherTab = function (filter = FILTER_LAYOUT_TAB_PAGES) {
        let TITLE = '.layui-tab-title',
            $tabElem = $('.layui-tab[lay-filter=' + filter + ']')
        ;
        call.closeOtherTab.call($tabElem);
    };
    TabPage.prototype.closeThisTab = function (filter = FILTER_LAYOUT_TAB_PAGES) {
        let TITLE = '.layui-tab-title',
            $tabElem = $('.layui-tab[lay-filter=' + filter + ']')
        ;
        call.closeThisTab.call($tabElem);
    };
    TabPage.prototype.closeAllTab = function (filter = FILTER_LAYOUT_TAB_PAGES) {
        let TITLE = '.layui-tab-title',
            $tabElem = $('.layui-tab[lay-filter=' + filter + ']')
        ;
        call.closeAllTab.call($tabElem);
    };
    TabPage.prototype.tabChange = function ($tab) {
        call.tabChange.call($tab);
    };
    TabPage.prototype.init = function () {
        element.tab({
            headerElem: '.layui-tab[lay-filter="' + FILTER_LAYOUT_TAB_PAGES + '"]>.layui-tab-title>li',
            bodyElem: '.layui-tab-content[lay-filter="' + FILTER_LAYOUT_TAB_PAGES + '"]>.layui-tab-item'
        });
        return this;
    };
    let call = {
        tabDelete(e, $that) {
            let $li = $that || $(this).parent(),
                THIS = 'layui-this',
                index = $li.index()
                , $parents = $li.parents('.layui-tab').eq(0)
                , ALLOW_CLOSE = 'allow-close'
                , item = $('.layui-tab-content').children('.layui-tab-item').eq(index)
            ;

            if ($li.attr(ALLOW_CLOSE) === 'false') { // =false
                return;
            }
            if ($li.hasClass(THIS)) {
                if ($li.next()[0]) {
                    call.tabClick.call($li.next()[0], null, null, index + 1);
                } else if ($li.prev()[0]) {
                    call.tabClick.call($li.prev()[0], null, null, index - 1);
                }
            }

            $li.remove();
            item.remove();
            call.tabAuto.call($parents, 'del')
        },
        tabClick(e, $liElem, index) {
            let $this = $liElem || $(this), // tab
                THIS = 'layui-this',
                SHOW = 'layui-show',
                item = $('.layui-tab-content[lay-filter="' + FILTER_LAYOUT_TAB_PAGES + '"]').children('.layui-tab-item')
            ;
            $this.addClass(THIS).siblings().removeClass(THIS);
            item.eq(index).addClass(SHOW).siblings().removeClass(SHOW);
        },
        tabAuto(event, $that) {
            let $this = $that || $(this), // tabElem
                $title = $this.children('.layui-tab-title'),
                $tabs = $title.children('li'),
                ADD = 'add',
                DEL = 'del'

            ;
            if (!!$tabs.length) {
                let $lastTab = $tabs.eq($tabs.length - 1);
                if (event === DEL && $lastTab.offset().left + 1 < $this.offset().left) { // 减少
                    $title.css('left', -$lastTab.position().left);

                } else if (event === ADD && ($lastTab.offset().left + $lastTab.outerWidth()) + 1 > ($this.offset().left + $this.outerWidth())) { // 增加
                    $title.css('left', $title.outerWidth() - $title.prop('scrollWidth'));
                }
            }
        },
        preTabPage($that) {
            let $this = $that || $(this), // tabElem
                $title = $this.children('.layui-tab-title'),
                $tabs = $title.children('li')
            ;
            let left = Math.abs($title.position().left) - $this.outerWidth();
            $tabs.each((i, tab) => {
                let $tab = $(tab);
                if ($tab.position().left > left) {
                    $title.css('left', -$tab.position().left);
                    return false;
                }
            });
        },
        nextTabPage($that) {
            let $this = $that || $(this), // tabElem
                $title = $this.children('.layui-tab-title'),
                $tabs = $title.children('li')
            ;
            let left = Math.abs($title.position().left) + $this.outerWidth();
            left = left < 0 ? 0 : left;
            $tabs.each((i, tab) => {
                let $tab = $(tab);
                if ($tab.position().left > left) {
                    $title.css('left', -$tab.position().left);
                    return false;
                }
            });
        },
        closeOtherTab($that) {
            let $this = $that || $(this), // tabElem
                $title = $this.children('.layui-tab-title'),
                $tabs = $title.children('li'),
                THIS = 'layui-this'
            ;
            let $otherTabs = $tabs.not('.' + THIS);
            $otherTabs.each((i, tab) => {
                let $tab = $(tab);
                call.tabDelete(null, $tab);
            });
        },
        closeThisTab($that) {
            let $this = $that || $(this), // tabElem
                $title = $this.children('.layui-tab-title'),
                $tabs = $title.children('li'),
                THIS = 'layui-this'
            ;
            let $thisTab = $tabs.filter('.' + THIS);
            call.tabDelete(null, $thisTab);
        },
        closeAllTab($that) {
            let $this = $that || $(this), // tabElem
                $title = $this.children('.layui-tab-title'),
                $tabs = $title.children('li')
            ;
            $tabs.each((i, tab) => {
                let $tab = $(tab);
                call.tabDelete(null, $tab);
            });
            let $tab = $tabs.eq(0);
            call.tabClick.call($tab, null, null, $tab.index());
        },
        tabChange($tab) {
            let $this = $tab || $(this), // tabElem
                $title = $this.parent(),
                $tabElem = $title.parent()
            ;
            call.tabClick.call($this, null, null, $this.index());
            if ($this.offset().left < $tabElem.offset().left
                || ($this.offset().left + $this.outerWidth()) > ($tabElem.offset().left + $tabElem.outerWidth())) {
                $title.css('left', -$this.position().left);
            }
        }
    };
    // layout.tabs
    TabPage.prototype.render = TabPage.prototype.init;
    let tabPage = new TabPage(),
        dom = $(document)
    ;
    tabPage.render();
    exports(MOD_NAME, tabPage);
});
