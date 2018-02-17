layui.define(['jquery', 'element'], (exports) => {
    let $ = layui.$,
        element = layui.element,
        MOD_NAME = 'tabPage',
        FILTER_LAYOUT_TAB_PAGES = 'layout-tab-pages',
        THIS = 'layui-this',
        SHOW = 'layui-show',
        LAY_ID = 'lay-id',
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
            allowClose = eval(options.allowClose || false),
            li = '<li lay-id="' + (options.id || '') + '" allow-close="' + (allowClose) + '">' + (options.title || 'unnaming') + '</li>',
            CLOSE = 'layui-tab-close'
        ;

        $.get(options.href, (html) => {
            // tab
            let $li = $(li);
            $titElem.append($li);
            if (allowClose
                && !$li.find('.' + CLOSE)[0]) {
                let $close = $('<i class="layui-icon layui-unselect ' + CLOSE + '">&#x1006;</i>');
                $close.on('click', call.tabDelete);
                $li.append($close);
            }

            // content
            $contElem.children('.layui-tab-item').removeClass(SHOW);
            $contElem.append('<div class="layui-tab-item ' + SHOW + '" lay-id="' + (options.id || '') + '">' + (html || '') + '</div>');
            element.tabChange(filter, options.href);

            // 调整
            call.tabAuto.call($tabElem, 'add');
        });

        return this;
    };
    TabPage.prototype.refresh = function (filter = FILTER_LAYOUT_TAB_PAGES) {
        let $item = $('.layui-tab-content[lay-filter="' + filter + '"]').children('.layui-tab-item.' + SHOW)
        ;
        $.get($item.attr(LAY_ID), function (html) {
            $item.html(html)
        });
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
        let $tabElem = $('.layui-tab[lay-filter=' + filter + ']')
        ;
        call.closeOtherTab.call($tabElem);
    };
    TabPage.prototype.closeThisTab = function (filter = FILTER_LAYOUT_TAB_PAGES) {
        let $tabElem = $('.layui-tab[lay-filter=' + filter + ']');
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
                index = $li.index()
                , $parents = $li.parents('.layui-tab').eq(0)
                , allowClose = (eval($li.attr('allow-close')) || false),
                item = $('.layui-tab-content[lay-filter="' + FILTER_LAYOUT_TAB_PAGES + '"]').children('.layui-tab-item').eq(index)
            ;

            if (!allowClose) { // =false
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
                $tabs = $title.children('li')
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
                $tabs = $title.children('li')
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