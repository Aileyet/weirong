define(['zepto', '../base/i18nMain', "../base/templates/template"], function ($, I18n, _TU) {
    var Schema = {
        //设备类别
        DeviceCatg:
              [
               { "module": "IRRC", "type": "MAGICBOX", "apiType": "", "name": I18n.magicbox.name, "isAutoMatch": 0, "isManual": 0, "url": "", "img": "&#xe604;", "isShow": 0 },
               { "module": "IRRC", "type": "AC00", "apiType": "Ac", "name": I18n.IR_Ac.name, "isAutoMatch": 1, "isManual": 1, "url": "ehome/CoAir", "img": "&#xe60c;", "isShow": 1 },
               { "module": "IRRC", "type": "PRJ0", "apiType": "Prj", "name": I18n.IR_Prj.name, "isAutoMatch": 1, "isManual": 0, "url": "ehome/CoProjector", "img": "&#xe60d;", "isShow": 1 },
               { "module": "IRRC", "type": "FAN0", "apiType": "Fan", "name": I18n.IR_Fan.name, "isAutoMatch": 1, "isManual": 0, "url": "ehome/CoFanSetup", "img": "&#xe66e;", "isShow": 1 },
               { "module": "IRRC", "type": "FAN1", "apiType": "Fan", "name": I18n.IR_Fan.name, "isAutoMatch": 1, "isManual": 0, "url": "ehome/CoFanSetup", "img": "&#xe66e;", "isShow": 1 },
               { "module": "IRRC", "type": "STB0", "apiType": "Stb", "name": I18n.IR_Stb.name, "isAutoMatch": 1, "isManual": 0, "url": "ehome/CoSTB", "img": "&#xe663;", "isShow": 1 },
               { "module": "IRRC", "type": "DVD0", "apiType": "Dvd", "name": I18n.IR_Dvd.name, "isAutoMatch": 1, "isManual": 1, "url": "ehome/CoSDVD", "img": "&#xe665;", "isShow": 1 },
               { "module": "IRRC", "type": "TV00", "apiType": "Tv", "name": I18n.IR_Tv.name, "isAutoMatch": 1, "isManual": 1, "url": "ehome/CoTV", "img": "&#xe611;", "isShow": 1 },
               { "module": "IRRC", "type": "IPTV", "apiType": "Iptv", "name": I18n.IR_Iptv.name, "isAutoMatch": 1, "isManual": 1, "url": "ehome/CoIPTV", "img": "&#xe6a4;", "isShow": 1 },
               { "module": "ZB00", "type": "SW00", "apiType": "Sw", "name": I18n.ZB_Sw.name, "isAutoMatch": 0, "isManual": 0, "url": "ehome/CoSwitch", "img": "&#xe609;", "isShow": 1 },
               { "module": "ZB00", "type": "SS00", "apiType": "Ss", "name": I18n.ZB_Ss.name, "isAutoMatch": 0, "isManual": 0, "url": "ehome/CoSocket", "img": "&#xe60a;", "isShow": 1 },
               { "module": "ZB00", "type": "SLB0", "apiType": "Slb", "name": I18n.ZB_Slb.name, "isAutoMatch": 0, "isManual": 0, "url": "ehome/CoLamp", "img": "&#xe60b;", "isShow": 1 },
               { "module": "IRRC", "type": "Study", "apiType": "", "name": I18n.IR_Study.name, "isAutoMatch": 0, "isManual": 0, "url": "ehome/CoStudy", "img": "&#xe6a8;", "isShow": 0 },
              ],


        //电视机
        TVControl:
            [{ "key": "power", "name": I18n.ehome_CoTV.power, "img": _TU._T.ehome_CoTV.data.power_icon, },
             { "key": "menu", "name": "", "img": I18n.ehome_CoTV.menu },
             { "key": "source", "name": "", "img": I18n.ehome_CoTV.source },
             { "key": "up", "name": I18n.ehome_CoTV.up, "img": _TU._T.ehome_CoTV.data.up_icon, },
             { "key": "down", "name": I18n.ehome_CoTV.down, "img": _TU._T.ehome_CoTV.data.down_icon, },
             { "key": "left", "name": I18n.ehome_CoTV.left, "img": _TU._T.ehome_CoTV.data.left_icon, },
             { "key": "right", "name": I18n.ehome_CoTV.right, "img": _TU._T.ehome_CoTV.data.right_icon, },
             { "key": "ok", "name":'', "img": _TU._T.ehome_CoTV.data.ok, },
             { "key": "volDown", "name": I18n.ehome_CoTV.volume, "img": _TU._T.ehome_CoTV.data.volume_down_icon, },
             { "key": "volUp", "name": I18n.ehome_CoTV.volume, "img": _TU._T.ehome_CoTV.data.volume_up_icon, },
             { "key": "mute", "name": I18n.ehome_CoTV.mute, "img": _TU._T.ehome_CoTV.data.mute_icon, },
             { "key": "Return", "name": I18n.ehome_CoTV.Return, "img": _TU._T.ehome_CoTV.data.return_icon, },
             { "key": "chUp", "name": I18n.ehome_CoTV.channel, "img": _TU._T.ehome_CoTV.data.channel_up_icon, },
             { "key": "chDown", "name": I18n.ehome_CoTV.channel, "img": _TU._T.ehome_CoTV.data.channel_down_icon, },
            ],
        //机顶盒
        STBControl:
            [{ "key": "power", "name": I18n.ehome_CoSTB.power, "img": _TU._T.ehome_CoSTB.data.power_icon },
             { "key": "left", "name": I18n.ehome_CoSTB.left, "img": _TU._T.ehome_CoSTB.data.left_icon },
             { "key": "up", "name": I18n.ehome_CoSTB.up, "img": _TU._T.ehome_CoSTB.data.up_icon },
             { "key": "right", "name": I18n.ehome_CoSTB.right, "img": _TU._T.ehome_CoSTB.data.right_icon },
             { "key": "down", "name": I18n.ehome_CoSTB.down, "img": _TU._T.ehome_CoSTB.data.down_icon },
             { "key": "ok", "name": '', "img": _TU._T.ehome_CoSTB.data.ok },
             { "key": "director", "name": I18n.ehome_CoSTB.director, "img": _TU._T.ehome_CoSTB.data.director_icon },
             { "key": "Return", "name": I18n.ehome_CoSTB.return, "img": _TU._T.ehome_CoSTB.data.return_icon },
             { "key": "menu", "name": I18n.ehome_CoSTB.menu, "img": _TU._T.ehome_CoSTB.data.menu_icon },
             { "key": "volUp", "name": I18n.ehome_CoSTB.volUp, "img": _TU._T.ehome_CoSTB.data.volume_up_icon },
             { "key": "volDown", "name": I18n.ehome_CoSTB.volDown, "img": _TU._T.ehome_CoSTB.data.volume_down_icon },
             { "key": "tvMute", "name": I18n.ehome_CoSTB.tvMute, "img": _TU._T.ehome_CoSTB.data.mute_icon },
             { "key": "tvPower", "name": I18n.ehome_CoSTB.tvPower, "img": _TU._T.ehome_CoSTB.data.power_icon },
            ],
        //IPTV
        IPTVControl:
             [{ "key": "power", "name": I18n.ehome_CoSTB.power, "img": _TU._T.ehome_CoSTB.data.power_icon },
             { "key": "left", "name": I18n.ehome_CoSTB.left, "img": _TU._T.ehome_CoSTB.data.left_icon },
             { "key": "up", "name": I18n.ehome_CoSTB.up, "img": _TU._T.ehome_CoSTB.data.up_icon },
             { "key": "right", "name": I18n.ehome_CoSTB.right, "img": _TU._T.ehome_CoSTB.data.right_icon },
             { "key": "down", "name": I18n.ehome_CoSTB.down, "img": _TU._T.ehome_CoSTB.data.down_icon },
             { "key": "ok", "name": '', "img": _TU._T.ehome_CoSTB.data.ok },
             { "key": "chUp", "name": I18n.ehome_CoSTB.director, "img": _TU._T.ehome_CoSTB.data.director_icon },
             { "key": "Return", "name": I18n.ehome_CoSTB.return, "img": _TU._T.ehome_CoSTB.data.return_icon },
             { "key": "chDown", "name": I18n.ehome_CoSTB.menu, "img": _TU._T.ehome_CoSTB.data.menu_icon },
             { "key": "volUp", "name": I18n.ehome_CoSTB.volUp, "img": _TU._T.ehome_CoSTB.data.volume_up_icon },
             { "key": "volDown", "name": I18n.ehome_CoSTB.volDown, "img": _TU._T.ehome_CoSTB.data.volume_down_icon },
             { "key": "tvMute", "name": I18n.ehome_CoSTB.tvMute, "img": _TU._T.ehome_CoSTB.data.mute_icon },
             { "key": "tvPower", "name": I18n.ehome_CoSTB.tvPower, "img": _TU._T.ehome_CoSTB.data.power_icon },
             ],
        //空调
        AriControl:
            [{
                "key": "power", "name": I18n.ehome_Air.power, "img": _TU._T.ehome_Air.data.power.icon,
                "value": [{ "key": "on", "name": I18n.ehome_Air.powerOpen, "img": "" },
                        { "key": "off", "name": I18n.ehome_Air.powerOff, "img": "" }
                ]
            },
             {
                 "key": "mode", "name": I18n.ehome_Air.mode, "img": _TU._T.ehome_Air.data.mode.icon,
                 "value": [{ "key": "auto", "name": I18n.ehome_Air.auto, "img": _TU._T.ehome_Air.data.mode.auto },
                        { "key": "cool", "name": I18n.ehome_Air.cool, "img": _TU._T.ehome_Air.data.mode.cool },
                        { "key": "dry", "name": I18n.ehome_Air.dry, "img": _TU._T.ehome_Air.data.mode.dry },
                        { "key": "fan", "name": I18n.ehome_Air.fan, "img": _TU._T.ehome_Air.data.mode.fan },
                        { "key": "heat", "name": I18n.ehome_Air.heat, "img": _TU._T.ehome_Air.data.mode.heat }]
             },
             { "key": "temperature", "name": I18n.ehome_Air.temperature, "img": "temp" },
             {
                 "key": "airVolume", "name": I18n.ehome_Air.airVolume, "img": _TU._T.ehome_Air.data.airVolume.icon,
                 "value": [{ "key": "low", "name": I18n.ehome_Air.low, "img": _TU._T.ehome_Air.data.airVolume.low },
                        { "key": "middle", "name": I18n.ehome_Air.middle, "img": _TU._T.ehome_Air.data.airVolume.middle },
                        { "key": "high", "name": I18n.ehome_Air.high, "img": _TU._T.ehome_Air.data.airVolume.high },
                        { "key": "auto", "name": I18n.ehome_Air.auto, "img": _TU._T.ehome_Air.data.airVolume.auto }
                 ]
             },
             {
                 "key": "airDir", "name": I18n.ehome_Air.airDir, "img": _TU._T.ehome_Air.data.airDir.icon,
                 "value": [{ "key": "up", "name": I18n.ehome_Air.up, "img": _TU._T.ehome_Air.data.airDir.up },
                        { "key": "middle", "name": I18n.ehome_Air.middle, "img": _TU._T.ehome_Air.data.airDir.middle },
                        { "key": "down", "name": I18n.ehome_Air.down, "img": _TU._T.ehome_Air.data.airDir.down }
                 ]
             },
             {
                 "key": "autoDir", "name": I18n.ehome_Air.autoDir, "img": _TU._T.ehome_Air.data.autoDir.icon,
                 "value": [{ "key": "on", "name": I18n.ehome_Air.on, "img": "" },
                         { "key": "off", "name": I18n.ehome_Air.off, "img": "" }
                 ]
             },
            ],
        //电风扇
        FanControl:
            [{ "key": "power", "name": I18n.ehome_CoFanSetup.power, "img": _TU._T.ehome_CoFanSetup.data.power_icon, },
             { "key": "oscillate", "name": '', "img": I18n.ehome_CoFanSetup.oscillate },
             {
                 "key": "speed", "name": '', "img": I18n.ehome_CoFanSetup.speed,
                 "value": [{ "key": "low", "name": I18n.ehome_CoFanSetup.low, "img": "" },
                          { "key": "middle", "name": I18n.ehome_CoFanSetup.middle, "img": "" },
                          { "key": "high", "name": I18n.ehome_CoFanSetup.high, "img": "" }
                 ]
             },
             { "key": "time", "name": I18n.ehome_CoFanSetup.time, "img": _TU._T.ehome_CoFanSetup.data.time_icon, },
             { "key": "mode", "name": '', "img": I18n.ehome_CoFanSetup.mode},
            ],
        //DVD
        DVDControl:
            [{ "key": "power", "name": I18n.ehome_CoSDVD.power, "img": _TU._T.ehome_CoSDVD.data.power_icon, },
             { "key": "mute", "name": I18n.ehome_CoSDVD.mute, "img": _TU._T.ehome_CoSDVD.data.mute_icon, },
             { "key": "open", "name": '', "img": I18n.ehome_CoSDVD.switchBin },
             { "key": "previous", "name": '', "img": _TU._T.ehome_CoSDVD.data.lastSong, },
             { "key": "reverse", "name": I18n.ehome_CoSDVD.rewind, "img": _TU._T.ehome_CoSDVD.data.rewind_icon, },
             { "key": "up", "name": I18n.ehome_CoSDVD.up, "img": _TU._T.ehome_CoSDVD.data.up_icon, },
             { "key": "down", "name": I18n.ehome_CoSDVD.down, "img": _TU._T.ehome_CoSDVD.data.down_icon, },
             { "key": "left", "name": I18n.ehome_CoSDVD.left, "img": _TU._T.ehome_CoSDVD.data.left_icon, },
             { "key": "right", "name": I18n.ehome_CoSDVD.right, "img": _TU._T.ehome_CoSDVD.data.right_icon, },
             { "key": "ok", "name": '', "img": _TU._T.ehome_CoSDVD.data.ok, },
             { "key": "next", "name": '', "img": _TU._T.ehome_CoSDVD.data.nextSong, },
             { "key": "forware", "name": I18n.ehome_CoSDVD.fastForward, "img": _TU._T.ehome_CoSDVD.data.fastForward_icon, },
             { "key": "menu", "name": I18n.ehome_CoSDVD.menu, "img": _TU._T.ehome_CoSDVD.data.menu_icon, },
             { "key": "play", "name": I18n.ehome_CoSDVD.play, "img": _TU._T.ehome_CoSDVD.data.play_icon, },
             { "key": "Return", "name": I18n.ehome_CoSDVD.returning, "img": _TU._T.ehome_CoSDVD.data.returning_icon, },
            ],
        //PRJ
        PRJControl:
            [{ "key": "power", "name": I18n.ehome_CoProjector.power, "img": _TU._T.ehome_CoProjector.data.power_icon, },
             { "key": "exit", "name": I18n.ehome_CoProjector.exit, "img": _TU._T.ehome_CoProjector.data.signout_icon, },
             { "key": "pc", "name": '', "img": I18n.ehome_CoProjector.pc, },
             { "key": "video", "name": '', "img": I18n.ehome_CoProjector.video, },
             { "key": "source", "name": '', "img": I18n.ehome_CoProjector.signalSource, },
             { "key": "zoomin", "name": I18n.ehome_CoProjector.zoom, "img": _TU._T.ehome_CoProjector.data.up_icon, },
             { "key": "zoomout", "name": I18n.ehome_CoProjector.zoom, "img": _TU._T.ehome_CoProjector.data.down_icon, },
             { "key": "left", "name": I18n.ehome_CoProjector.direction, "img": _TU._T.ehome_CoProjector.data.chang_icon, },
             { "key": "up", "name": I18n.ehome_CoProjector.direction, "img": _TU._T.ehome_CoProjector.data.upchang_icon, },
             { "key": "right", "name": I18n.ehome_CoProjector.direction, "img": _TU._T.ehome_CoProjector.data.rightchang_icon, },
             { "key": "down", "name": I18n.ehome_CoProjector.direction, "img": _TU._T.ehome_CoProjector.data.downchang_icon, },
             { "key": "ok", "name": I18n.ehome_CoProjector.confirm, "img": I18n.ehome_CoProjector.confirm, },
             { "key": "picAdd", "name": I18n.ehome_CoProjector.frame, "img": _TU._T.ehome_CoProjector.data.up_icon, },
             { "key": "picDec", "name": I18n.ehome_CoProjector.frame, "img": _TU._T.ehome_CoProjector.data.down_icon, },
             { "key": "volUp", "name": I18n.ehome_CoProjector.voice, "img": _TU._T.ehome_CoProjector.data.voice_up_icon, },
             { "key": "mute", "name": I18n.ehome_CoProjector.voice, "img": _TU._T.ehome_CoProjector.data.voice_mute_icon, },
             { "key": "volDown", "name": I18n.ehome_CoProjector.voice, "img": _TU._T.ehome_CoProjector.data.voice_down_icon, },
            ],

        //日程周期
        PeriodArray:
            [{ "key": "second", "name": I18n.Period.second },
             { "key": "minute", "name": I18n.Period.minute },
             { "key": "hour", "name": I18n.Period.hour },
             { "key": "day", "name": I18n.Period.day },
             { "key": "week", "name": I18n.Period.week },
             { "key": "month", "name": I18n.Period.month },
             { "key": "year", "name": I18n.Period.year },
             { "key": "manual", "name": I18n.Period.manual },
             { "key": "none", "name": I18n.Period.none }
            ],
        //周重复
        WeekArray:
        [{ "key": "1", "name": I18n.Week.Mon },
         { "key": "2", "name": I18n.Week.Tus },
         { "key": "3", "name": I18n.Week.Wed },
         { "key": "4", "name": I18n.Week.Thr },
         { "key": "5", "name": I18n.Week.Fri },
         { "key": "6", "name": I18n.Week.Sat },
         { "key": "7", "name": I18n.Week.Sun }
        ],
        //场景模式图标
        ModeImgArray:
            [{ "key": "&#xe6a2;", "name": I18n.ModeImg.video },
             { "key": "&#xe6a3;", "name": I18n.ModeImg.meeting },
             { "key": "&#xe6a1;", "name": I18n.ModeImg.casual },
             { "key": "&#xe6a0;", "name": I18n.ModeImg.meals },
             { "key": "&#xe69f;", "name": I18n.ModeImg.sleep },
             { "key": "&#xe630;", "name": I18n.ModeImg.aaronli },
             { "key": "&#xe635;", "name": I18n.ModeImg.customer }
            ],
        //语音识别跳转
        VoiceNavigate:
		[{ "txt": I18n.VoiceNavigate.device, "url": "devicemanage/Ehome" },
		{ "txt": I18n.VoiceNavigate.home, "url": "home/MeIndex" }],
    };
    return Schema;
});
