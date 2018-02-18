layui.define(['jquery', 'element', 'laytpl', 'layer'], (exports) => {
    let $ = layui.$,
        element = layui.element,
        laytpl = layui.laytpl,
        layer = layui.layer,
        INDEX_URL = 'pages/demo.html',
        MENU_URL = './dist/store/menu.json',


        MOD_NAME = 'tabPage',
        FILTER_LAYOUT_TAB_PAGES = 'layout-tab-pages',
        THIS = 'layui-this',
        SHOW = 'layui-show',
        EVENT = 'lay-event',
        LAY_ID = 'lay-id',
        navView = $('#VIEW_NAV'),


        TabPage = function () {
            this.config = {};
        };
    /**
     * {
     *      href: '' // = id
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
            li = '<li lay-id="' + (options.href || '') + '" allow-close="' + (allowClose) + '">' + (options.title || 'unnaming') + '</li>',
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
            $contElem.append('<div class="layui-tab-item ' + SHOW + '" lay-id="' + (options.href || '') + '">' + (html || '') + '</div>');
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
        return this;
    };
    TabPage.prototype.preTabPage = function (filter = FILTER_LAYOUT_TAB_PAGES) {
        let TITLE = '.layui-tab-title',
            $tabElem = $('.layui-tab[lay-filter=' + filter + ']')
        ;
        call.preTabPage.call($tabElem);
        return this;
    };
    TabPage.prototype.nextTabPage = function (filter = FILTER_LAYOUT_TAB_PAGES) {
        let TITLE = '.layui-tab-title',
            $tabElem = $('.layui-tab[lay-filter=' + filter + ']')
        ;
        call.nextTabPage.call($tabElem);
        return this;
    };
    TabPage.prototype.closeOtherTab = function (filter = FILTER_LAYOUT_TAB_PAGES) {
        let $tabElem = $('.layui-tab[lay-filter=' + filter + ']')
        ;
        call.closeOtherTab.call($tabElem);
        return this;
    };
    TabPage.prototype.closeThisTab = function (filter = FILTER_LAYOUT_TAB_PAGES) {
        let $tabElem = $('.layui-tab[lay-filter=' + filter + ']');
        call.closeThisTab.call($tabElem);
        return this;
    };
    TabPage.prototype.closeAllTab = function (filter = FILTER_LAYOUT_TAB_PAGES) {
        let TITLE = '.layui-tab-title',
            $tabElem = $('.layui-tab[lay-filter=' + filter + ']')
        ;
        call.closeAllTab.call($tabElem);
        return this;
    };
    TabPage.prototype.tabChange = function ($tab) {
        call.tabChange.call($tab);
        return this;
    };
    TabPage.prototype.init = function () {
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
            call.tabAuto.call($parents, 'del');
            layui.event.call(this, 'element', 'tabDelete(' + FILTER_LAYOUT_TAB_PAGES + ')', {
                elem: $parents
                , index: index
            });
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
        dom = $(document),
        win = $(window)
    ;
    tabPage.render();
    win.resize(() => {
        $('.layout-side-spread-sm').removeClass('layout-side-spread-sm');
    });
    win.ready(() => {
        let EVENT_CLOSE_THIS_TAB = 'closeThisTab',
            EVENT_CLOSE_ALL_TAB = 'closeAllTab',
            EVENT_CLOSE_OTHER_TAB = 'closeOtherTab',
            hash = window.location.hash;
        tabPage.tabAdd({
            href: INDEX_URL,
            title: '<i class="layui-icon layui-icon-home"></i>',
            allowClose: false
        });
        dom.on('click', 'a[data-menu]', (e) => {
            let $this = $(e.target),
                href = $this.attr('href'),
                $clickedTab = $('.layui-tab[lay-filter="' + FILTER_LAYOUT_TAB_PAGES + '"] .layui-tab-title li[lay-id="' + href + '"]')
            ;
            if (!href || $clickedTab[0]) {
                if ($clickedTab[0] && !$clickedTab.hasClass(THIS)) { // 未被点击
                    element.tabChange(FILTER_LAYOUT_TAB_PAGES, $clickedTab.eq(0).attr(LAY_ID));
                }
                return false;
            }
            tabPage.tabAdd({
                href: href,
                title: $this.text(),
                allowClose: true
            });
            return false;
        });
        dom.on('click', '.ext-tabs-control-prev', (e) => {
            tabPage.preTabPage();
        });
        dom.on('click', '.ext-tabs-control-next', (e) => {
            tabPage.nextTabPage();
        });
        element.on('tabDelete(' + FILTER_LAYOUT_TAB_PAGES + ')', (data) => {
            let $tab = $(data.elem).children('.layui-tab-title').children('.' + THIS).eq(0),
                href = $tab.attr(LAY_ID),
                $nav = $('.ext-layout-side a');
            $nav.filter('[data-menu][href$="' + href + '"]').parent().addClass(THIS)
                .siblings().removeClass(THIS);
        });
        element.on('nav(tabs-option)', (elem) => {
            let $this = $(elem),
                event = $this.attr(EVENT);
            if (event === EVENT_CLOSE_THIS_TAB) {
                tabPage.closeThisTab();
            } else if (event === EVENT_CLOSE_ALL_TAB) {
                tabPage.closeAllTab();
            } else if (event === EVENT_CLOSE_OTHER_TAB) {
                tabPage.closeOtherTab();
            }
        });
        element.on('nav(layout-nav-right)', (elem) => {
            let $this = $(elem);
            let event = $this.attr(EVENT);
            if (event === 'about') {
                layer.open({
                    title: '版本信息',
                    area: ['300px'],
                    offset: 'r',
                    type: 1,
                    skin: 'layui-anim layui-anim-rl layui-layer-adminRight', //样式类名
                    closeBtn: 0, //不显示关闭按钮
                    anim: -1,
                    shadeClose: true, //开启遮罩关闭
                    content: '内容'
                });
            }
        });
        element.on('nav(layout-nav-tools)', (elem) => {
            let $this = $(elem);
            let event = $this.attr('lay-event');
            if (event === 'shrink') {
                if ($(window).width() < 992) {
                    $('.ext-layout-admin').toggleClass('layout-side-spread-sm');
                } else {
                    $('.ext-layout-admin').toggleClass('layadmin-side-shrink');
                }
            } else if (event === 'refresh') {
                tabPage.refresh();
            }
        });
        element.on('tab(layout-tab-pages)', (data) => {
            let $tab = $(data.elem).children('.layui-tab-title').children('li').eq(data.index),
                href = $tab.attr(LAY_ID),
                $nav = $('.ext-layout-side a[data-menu]');
            $nav.parent().removeClass(THIS);

            $nav.filter('[href$="' + href + '"]').parent().addClass(THIS)
                .parents('li').addClass('layui-nav-itemed');
            call.tabChange($tab);

            // 更换地址栏URL #href
            let hash = window.location.hash;
            if (href === INDEX_URL) {
                return;
            }
            if (/^#.*/.test(hash)) {
                hash = hash.replace(/^#.*/, '#' + href);
            } else {
                hash += '#' + href;
            }
            window.location.hash = hash;
        });


        $.get(MENU_URL, (data) => {
            if (data.code === 200) {
                laytpl(TPL_NAV.innerHTML).render(data.result, function (html) {
                    navView.html(html);
                    element.render('nav');
                    // 根据 route 打开Tab
                    if (!!hash) {
                        let href = hash.replace(/^#/, '');
                        console.log(href);
                        if (href === INDEX_URL) {
                            return;
                        }
                        $('a[data-menu][href$="' + href + '"]').trigger('click');
                    }
                });
            }

        });
    });
    exports(MOD_NAME, tabPage);
});
