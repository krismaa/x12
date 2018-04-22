Autobuild = {
    settings: {
        autostart: false,
        timeinterval: 600
    },
    building_queue: {},
    town: null,
    iTown: null,
    interval: null,
    currentWindow: null,
    isCaptain: false,
    Queue: 0,
    init: function() {
        ConsoleLog.Log('Initialize Autobuild', 3);
        Autobuild['initFunction']();
        Autobuild['initButton']();
        Autobuild['checkCaptain']();
        Autobuild['activateCss']()
    },
    setSettings: function(_0x19afx1) {
        if (_0x19afx1 != '' && _0x19afx1 != null) {
            $['extend'](Autobuild['settings'], JSON['parse'](_0x19afx1))
        }
    },
    activateCss: function() {
        $('.construction_queue_order_container')['addClass']('active')
    },
    setBuildingQueue: function(_0x19afx1) {
        if (_0x19afx1 != '' && _0x19afx1 != null) {
            Autobuild['building_queue'] = JSON['parse'](_0x19afx1);
            Autobuild['initQueue']($('.construction_queue_order_container'), 'building')
        }
    },
    calls: function(_0x19afx2) {
        switch (_0x19afx2) {
        case 'building_main/index':
            ;
        case 'building_main/build':
            ;
        case 'building_main/cancel':
            ;
        case 'building_main/tear_down':
            Autobuild['windows']['building_main_index'](_0x19afx2);
            break
        }
    },
    initFunction: function() {
        var _0x19afx3 = function(_0x19afx4) {
            return function() {
                _0x19afx4['apply'](this, arguments);
                if (this['$el']['selector'] == '#building_tasks_main .various_orders_queue .frame-content .various_orders_content' || this['$el']['selector'] == '#ui_box .ui_construction_queue .construction_queue_order_container') {
                    Autobuild['initQueue'](this.$el, 'building')
                }
            }
        };
        GameViews['ConstructionQueueBaseView']['prototype']['renderQueue'] = _0x19afx3(GameViews['ConstructionQueueBaseView']['prototype']['renderQueue'])
    },
    initButton: function() {
        ModuleManager['initButtons']('Autobuild', ModuleManager['modules'].Autobuild)
    },
    checkCaptain: function() {
        if ($('.advisor_frame.captain div')['hasClass']('captain_active')) {
            Autobuild['isCaptain'] = true
        }
        ;Autobuild['Queue'] = Autobuild['isCaptain'] ? 7 : 2
    },
    checkReady: function(_0x19afx5) {
        var _0x19afx6 = ITowns['towns'][_0x19afx5['id']];
        if (!ModuleManager['modules']['Autobuild']['isOn']) {
            return false
        }
        ;if (_0x19afx6['hasConqueror']()) {
            return false
        }
        ;if (typeof (Autobuild['building_queue'][_0x19afx5['id']]) == 'undefined') {
            return false
        }
        ;if (_0x19afx5['modules']['Autobuild']['isReadyTime'] < Timestamp['now']()) {
            return true
        } else {
            return _0x19afx5['modules']['Autobuild']['isReadyTime']
        }
    },
    startBuild: function(_0x19afx5) {
        Autobuild['town'] = _0x19afx5;
        Autobuild['iTown'] = ITowns['towns'][Autobuild['town']['id']];
        if (ModuleManager['currentTown'] != Autobuild['town']['key']) {
            ConsoleLog.Log(Autobuild['town']['name'] + ' move to town.', 3);
            DataExchanger['switch_town'](Autobuild['town']['id'], function() {
                ModuleManager['currentTown'] = Autobuild['town']['key'];
                Autobuild['start']()
            })
        } else {
            Autobuild['start']()
        }
    },
    start: function() {
        if (Autobuild['building_queue'][Autobuild['town']['id']] != undefined) {
            if (Autobuild['building_queue'][Autobuild['town']['id']]['building'] != undefined) {
                Autobuild['interval'] = setTimeout(function() {
                    ConsoleLog.Log(Autobuild['town']['name'] + ' getting building information.', 3);
                    DataExchanger['building_main'](Autobuild['town']['id'], function(_0x19afx7) {
                        if (Autobuild['hasFreeBuildingSlots'](_0x19afx7)) {
                            var _0x19afx8 = Autobuild['building_queue'][Autobuild['town']['id']]['building'][0];
                            if (_0x19afx8 != undefined) {
                                var _0x19afx9 = Autobuild['getBuildings'](_0x19afx7)[_0x19afx8['item_name']];
                                if (_0x19afx9['can_upgrade']) {
                                    DataExchanger['frontend_bridge'](Autobuild['town']['id'], {
                                        model_url: 'BuildingOrder',
                                        action_name: 'buildUp',
                                        arguments: {
                                            building_id: _0x19afx8['item_name']
                                        },
                                        town_id: Autobuild['town']['id'],
                                        nl_init: true
                                    }, function(_0x19afx7) {
                                        if (_0x19afx7['json']['success']) {
                                            var _0x19afxa = _0x19afx7['json']['notifications'];
                                            NotificationLoader['recvNotifyData'](_0x19afx7['json'], false);
                                            if (Autobuild['town']['id'] == Game['townId']) {
                                                var _0x19afxb = GPWindowMgr['getByType'](GPWindowMgr.TYPE_BUILDING);
                                                for (var _0x19afxc = 0; _0x19afxb['length'] > _0x19afxc; _0x19afxc++) {
                                                    _0x19afxb[_0x19afxc]['getHandler']()['refresh']()
                                                }
                                            }
                                            ;ConsoleLog.Log('<span style="color: #ffa03d;">' + _0x19afx8['item_name']['capitalize']() + ' - ' + _0x19afx7['json']['success'] + '</span>', 3);
                                            DataExchanger.Auth('removeBuildingQueue', {
                                                player_id: Autobot['Account']['player_id'],
                                                world_id: Autobot['Account']['world_id'],
                                                csrfToken: Autobot['Account']['csrfToken'],
                                                town_id: Autobuild['town']['id'],
                                                item_id: _0x19afx8['id']
                                            }, Autobuild['callbackSave']($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders')));
                                            $('.queue_id_' + _0x19afx8['id'])['remove']()
                                        }
                                        ;if (_0x19afx7['json']['error']) {
                                            ConsoleLog.Log(Autobuild['town']['name'] + ' ' + _0x19afx7['json']['error'], 3)
                                        }
                                    });
                                    Autobuild['finished'](Autobuild['settings']['timeinterval'])
                                } else {
                                    var _0x19afxd = Autobuild['iTown']['resources']();
                                    if (!_0x19afx9['enough_population']) {
                                        ConsoleLog.Log(Autobuild['town']['name'] + ' not enough population for ' + _0x19afx8['item_name'] + '.', 3);
                                        Autobuild['finished'](Autobuild['settings']['timeinterval'])
                                    } else {
                                        if (!_0x19afx9['enough_resources']) {
                                            ConsoleLog.Log(Autobuild['town']['name'] + ' not enough resources for ' + _0x19afx8['item_name'] + '.', 3);
                                            Autobuild['finished'](Autobuild['settings']['timeinterval'])
                                        } else {
                                            ConsoleLog.Log(Autobuild['town']['name'] + ' ' + _0x19afx8['item_name'] + ' can not be started due dependencies.', 3);
                                            DataExchanger.Auth('removeBuildingQueue', {
                                                player_id: Autobot['Account']['player_id'],
                                                world_id: Autobot['Account']['world_id'],
                                                csrfToken: Autobot['Account']['csrfToken'],
                                                town_id: Autobuild['town']['id'],
                                                item_id: _0x19afx8['id']
                                            }, Autobuild['callbackSave']($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders')));
                                            $('.queue_id_' + _0x19afx8['id'])['remove']();
                                            Autobuild['finished'](Autobuild['settings']['timeinterval'])
                                        }
                                    }
                                }
                            } else {
                                Autobuild['finished'](Autobuild['settings']['timeinterval'])
                            }
                        } else {
                            ConsoleLog.Log(Autobuild['town']['name'] + ' no free building slots available.', 3);
                            Autobuild['finished'](Autobuild['settings']['timeinterval'])
                        }
                    })
                }, Autobot['randomize'](1000, 2000))
            } else {
                Autobuild['finished'](Autobuild['settings']['timeinterval'])
            }
        } else {
            Autobuild['finished'](Autobuild['settings']['timeinterval'])
        }
    },
    upgradeBuilding: function(_0x19afxe, _0x19afxf) {},
    pauze: function() {
        clearInterval(Autobuild['interval'])
    },
    finished: function(_0x19afx10) {
        Autobuild['town']['modules']['Autobuild']['isReadyTime'] = Timestamp['now']() + _0x19afx10;
        Autobuild['town']['modules']['Autobuild']['isFinished'] = true;
        ModuleManager['Queue']['next']()
    },
    callbackSave: function(_0x19afx11) {
        return function(_0x19afx7) {
            if (_0x19afx7['success']) {
                _0x19afx11['each'](function() {
                    Autobuild['building_queue'] = _0x19afx7;
                    $(this)['find']('.empty_slot')['remove']();
                    if (_0x19afx7['item']) {
                        $(this)['append'](Autobuild['buildingElement']($(this), _0x19afx7['item']));
                        Autobuild['setEmptyItems']($(this))
                    } else {
                        Autobuild['setEmptyItems']($(this))
                    }
                })
            }
        }
    },
    contentSettings: function() {
        return $('<fieldset/>', {
            "\x69\x64": 'Autobuild_settings',
            "\x73\x74\x79\x6C\x65": 'float:left; width:472px; height: 270px;'
        })['append']($('<legend/>')['html']('Autobuild Settings (Beta)'))['append'](FormBuilder['checkbox']({
            "\x74\x65\x78\x74": 'AutoStart Autobuild.',
            "\x69\x64": 'autobuild_autostart',
            "\x6E\x61\x6D\x65": 'autobuild_autostart',
            "\x63\x68\x65\x63\x6B\x65\x64": Autobuild['settings']['autostart']
        }))['append'](FormBuilder['selectBox']({
            id: 'autobuild_timeinterval',
            name: 'autobuild_timeinterval',
            label: 'Check every: ',
            styles: 'width: 120px;',
            value: Autobuild['settings']['timeinterval'],
            options: [{
                value: '120',
                name: '2 minutes'
            }, {
                value: '300',
                name: '5 minutes'
            }, {
                value: '600',
                name: '10 minutes'
            }, {
                value: '900',
                name: '15 minutes'
            }]
        }))['append'](FormBuilder['button']({
            name: 'Save',
            style: 'margin-top: 10px;'
        })['on']('click', function() {
            var _0x19afx12 = $('#Autobuild_settings')['serializeObject']();
            Autobuild['settings']['autostart'] = _0x19afx12['autobuild_autostart'] != undefined;
            Autobuild['settings']['timeinterval'] = parseInt(_0x19afx12['autobuild_timeinterval']);
            DataExchanger.Auth('saveBuild', {
                player_id: Autobot['Account']['player_id'],
                world_id: Autobot['Account']['world_id'],
                csrfToken: Autobot['Account']['csrfToken'],
                autobuild_settings: Autobot['stringify'](Autobuild['settings'])
            }, Autobuild['callbackSaveSettings'])
        }))
    },
    callbackSaveSettings: function() {
        ConsoleLog.Log('Settings saved', 3);
        HumanMessage['success']('The settings were saved!')
    },
    hasFreeBuildingSlots: function(_0x19afx13) {
        var _0x19afx14 = false;
        if (_0x19afx13['json'] != undefined) {
            if (/BuildingMain\.full_queue = false;/g['test'](_0x19afx13['json']['html'])) {
                _0x19afx14 = true
            }
        }
        ;return _0x19afx14
    },
    getBuildings: function(_0x19afx13) {
        var _0x19afx9 = null;
        if (_0x19afx13['json']['html'] != undefined) {
            var _0x19afx15 = _0x19afx13['json']['html']['match'](/BuildingMain\.buildings = (.*);/g);
            if (_0x19afx15[0] != undefined) {
                _0x19afx9 = JSON['parse'](_0x19afx15[0]['substring'](25, _0x19afx15[0]['length'] - 1))
            }
        }
        ;return _0x19afx9
    },
    initQueue: function(_0x19afx16, _0x19afx17) {
        $('#building_tasks_main')['addClass']('active');
        var _0x19afx11 = _0x19afx16['find']('.ui_various_orders');
        _0x19afx11['find']('.empty_slot')['remove']();
        if (Autobuild['building_queue'][Game['townId']] != undefined) {
            if (Autobuild['building_queue'][Game['townId']][_0x19afx17] != undefined) {
                $['each'](Autobuild['building_queue'][Game['townId']][_0x19afx17], function(_0x19afx18, _0x19afx19) {
                    _0x19afx11['append'](Autobuild['buildingElement'](_0x19afx11, _0x19afx19))
                })
            }
        }
        ;Autobuild['setEmptyItems'](_0x19afx11);
        _0x19afx11['parent']()['mousewheel'](function(_0x19afx1a, _0x19afx1b) {
            this['scrollLeft'] -= (_0x19afx1b * 30);
            _0x19afx1a['preventDefault']()
        })
    },
    setEmptyItems: function(_0x19afx11) {
        var _0x19afx1c = 0;
        var _0x19afx1d = _0x19afx11['parent']()['width']();
        $['each'](_0x19afx11['find']('.js-tutorial-queue-item'), function() {
            _0x19afx1c += $(this)['outerWidth'](true)
        });
        var _0x19afx1e = _0x19afx1d - _0x19afx1c;
        if (_0x19afx1e >= 0) {
            _0x19afx11['width'](_0x19afx1d);
            for (var _0x19afxc = 1; _0x19afxc <= Math['floor'](_0x19afx1e) / 60; _0x19afxc++) {
                _0x19afx11['append']($('<div/>', {
                    "\x63\x6C\x61\x73\x73": 'js-queue-item js-tutorial-queue-item construction_queue_sprite empty_slot'
                }))
            }
        } else {
            _0x19afx11['width'](_0x19afx1c + 25)
        }
    },
    buildingElement: function(_0x19afx11, _0x19afx19) {
        return $('<div/>', {
            "\x63\x6C\x61\x73\x73": 'js-tutorial-queue-item queued_building_order last_order ' + _0x19afx19['item_name'] + ' queue_id_' + _0x19afx19['id']
        })['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'construction_queue_sprite frame'
        })['mousePopup'](new MousePopup(_0x19afx19['item_name']['capitalize']() + ' queued'))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'item_icon building_icon40x40 js-item-icon build_queue ' + _0x19afx19['item_name']
        })))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'btn_cancel_order button_new square remove js-item-btn-cancel-order build_queue'
        })['on']('click', function(_0x19afx1f) {
            _0x19afx1f['preventDefault']();
            DataExchanger.Auth('removeBuildingQueue', {
                player_id: Autobot['Account']['player_id'],
                world_id: Autobot['Account']['world_id'],
                csrfToken: Autobot['Account']['csrfToken'],
                town_id: Game['townId'],
                item_id: _0x19afx19['id']
            }, Autobuild['callbackSave']($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders')));
            $('.queue_id_' + _0x19afx19['id'])['remove']()
        })['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'left'
        }))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'right'
        }))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'caption js-caption'
        })['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'effect js-effect'
        }))))
    },
    windows: {
        wndId: null,
        wndContent: null,
        building_main_index: function() {
            if (GPWindowMgr && GPWindowMgr['getOpenFirst'](Layout['wnd'].TYPE_BUILDING)) {
                Autobuild['currentWindow'] = GPWindowMgr['getOpenFirst'](Layout['wnd'].TYPE_BUILDING)['getJQElement']()['find']('.gpwindow_content');
                var _0x19afx20 = Autobuild['currentWindow']['find']('#main_tasks h4');
                _0x19afx20['html'](_0x19afx20['html']()['replace'](/\/.*\)/, '/&infin;)'));
                var _0x19afx21 = ['theater', 'thermal', 'library', 'lighthouse', 'tower', 'statue', 'oracle', 'trade_office'];
                $['each']($('#buildings .button_build.build_grey.build_up.small.bold'), function() {
                    var _0x19afx22 = $(this)['parent']()['parent']()['attr']('id')['replace']('building_main_', '');
                    if ($['inArray'](_0x19afx22, _0x19afx21) == -1) {
                        $(this)['removeClass']('build_grey')['addClass']('build')['html']('Add to queue')['on']('click', function(_0x19afx1f) {
                            _0x19afx1f['preventDefault']();
                            DataExchanger.Auth('addBuildingQueue', {
                                player_id: Autobot['Account']['player_id'],
                                world_id: Autobot['Account']['world_id'],
                                csrfToken: Autobot['Account']['csrfToken'],
                                town_id: Game['townId'],
                                item_name: _0x19afx22
                            }, Autobuild['callbackSave']($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders')))
                        })
                    }
                })
            }
        }
    }
}
