define(['zepto'], function($) {
    var i18n_zh = {
        Common:{
            tip:"提示",
            needlogin:'亲！您需要登陆后才能操作~' ,
            ok:"确定",
            cancel:"取消",
            getUserMagicboxError:"获取用户魔方数据出错",
            getUserDeviceError:"获取用户设备数据出错！",
            edit:"修改",
            delete:"删除",
            operate:"操作",
            deleteSucess:"删除成功",
            deleteError:"删除失败",
            editDeviceName:"修改设备名称",
            save:"保存",
            editSucess:"修改成功",
            editError:"修改失败",
            zigbeeIsLoading:"zigbee正在加载，暂时无法使用.",
            inputMsg:"请输入名称",
            addMsg:"添加",
            customDevice:"自定义设备",
            magicboxError:"请先添加一个魔方！",
            saveSuccess:"保存成功",
            functionUnable:"该功能还未实现！",
            addMbAutoError:"扫描遇到错误，正在重试...",
            deviceIsExitsError:"该设备已经存在!",
            deviceAddError:"未获取到所添加设备的类别名称",
            repeatError:"请勿重复提交!",
            confirmBarCode:"请确认是正确的产品码!",
            serverError:"无法连接服务器，请重试...",
            timeOut:"操作超时，请重试...",
            noMagicBoxError:"未获取到该设备所属魔方编号！",
            noDeviceSeriError:"未获取到设备序列号！",
            noDeviceOfSeriError:"未找到相关序列号设备！",
            noMagicBoxIdError:"未获取到魔方编号！",
            getUserMagicboxDeviceTimeOut:"获取设备列表超时!",
            updateTimeOut:"更新超时，请重试!",
            updateSucess:"更新成功!",
            choiceTimeError:"开始时间不可大于结束时间！",	
            enterAccountPrompt:"登录名请输入手机号/邮箱",	
            inShareUserConfirm:"确定共享给该用户吗?",
            inShareUserSuccess:"共享成功",
            inShareUserFail:"共享失败",
            choiceBeginTime:"请选择开始时间",
            choiceEndTime:"请选择结束时间",
            delSuccess:"删除成功",
            delFail:"删除失败",
            mapGeolocationFailed:"获取定位失败",
            mapWeatherOK:"更新天气成功",
            mapWeatherFailed:"更新天气失败",
            AuthorizationFailed:"授权失败",
            wxClientNotInstalled:"未安装微信客户端",
            enterPasswordMsg:"请输入密码",
            accounMsg:"账号为手机号或邮箱",
            passwordErrorMsg:"密码为6~12位",
            connectNetFailed:"网络已经断开，请打开网络",
            signInError:"登录失败用户名或密码错误！",
            signInSuccess:"登陆成功",
            phoneNoRrror:"手机号输入格式错误",
            passwordLength:"密码为6~12位",
            registerCaptchaOuttime	:"验证码超时",
            inputValidIpError: "请输入合法的IP地址！",	
            inputValidNetMaskError : "请输入合法的子网掩码！",
            inputValidGatewayError : "请输入合法的网关！",
            inputValidDns1Error : "请输入合法的DNS！",
            magicboxUsableError  : "魔方不可用，请重试",
            setIpNetworkSuc :"设置IP地址、子网掩码、网关、DNS成功！",
            inputSSID:"请输入SSID！",
            inputPassword:"请输入密码！",
            addWifiFailed : "添加WIFI失败，请重试",
            setModeSSIDPasswordSuc : "设置模式、SSID、密码成功！",
            setCameraBrightnessFailed : "设置魔方摄像头亮度失败，请重试",
            setCameraContrastFailed : "设置魔方摄像头对比度失败，请重试",
            areUSuresetCameraContrast : "确定修改摄像头对比度为",
            setMagixboxCameraFailed : "设置魔方摄像头失败，请重试",
            setMbVedioConnectionFailed : "魔方视频连接错误，请重试",
            registerSuccess		:"用户注册成功",
            registerFailed		:"用户注册失败",
            registerPasswordUnmatched	:"新设密码不匹配",
            registerUserloginRepeat	:"该手机号码已被注册",
            registerSendMsgFailed	:"发送短信失败",
            registerCaptchaUnmatched	:"验证码错误",
            registerCaptchaOuttime	:"验证码超时",
            registerCaptchaNotnull	:"验证码不能为空",
            phoneNoNotnull:"手机号输入格式错误",
            shortMessageSending:"验证码短信已经发送至",
            surplus:"剩余",
            second:"秒",
            sameNameError:"该名称已存在，请重新输入！",
            setCustomerBtnName:"设置自定义按钮名称",
            maxUserBtnMsg:"最多只能创建10个自定义按钮！",
            notLoggedIn:"未登录",
            pleaseLogIn:"请登录",
            pleaseLoginFirst: "请先登录",
            deleteConfirm: "确认删除吗？",
        },
        InUserInfoL:{
            title:"智能家居",
            subtitle:"您身边的智能助理",
            accountNumber:"账号",
            password:"密码",
            land:"登录",

            fTPassword:"忘记密码",
            nAccount:"还没有账号？",
            regAccount:"注册账号",
            passwordPlaceholder:"登陆密码",
            accountPlaceholder:"手机号/邮箱"
        },
        InUserInfoReg:{
            accountNumber:"账号",
            register_password:"设置密码",
            register_password_confirm:"确认密码",
            register_phoneNO:"手机号码",
            register_captcha:"验证码",
            submit_register_info:"注册",
            register_password_placeholder:"6-12位字母及数字组合",
            register_password_confirm_placeholder:"再次填写密码",
            register_phoneNO_placeholder:"请输入11位手机号码",
            register_captcha_placeholder:"短信验证码",
            time_CAPTCHA:"50秒获取验证码",
            accountNumber_placeholder:"手机号/邮箱"
        },
        magicbox_Infraredremotecontrol:{
            CoTV:"电视",
            CoSTB:"机顶盒",
            CoAir:"空调",
            CoFanSetup:"风扇",
            CoLamp:"电灯",
            CoSDVD:"DVD",
            CoClean:"净化器",
            SeAddDev:"添加设备"
        },
        InMBSetup:{
            SeAddDev:"添加配置的智慧设备",
            add:"添加",
            NetSetup:"网络设置",
            msgSub:"消息订阅",
            BluSet:"蓝牙设置",
            EquDetails:"设备详情",
            upgrade:"固件升级",
            DeviceRestart:"设备重启",
            about:"关于智能魔方"
        },
        addInShareUser:{
            choiceTime:"请选择有效时限",
            loginName:"登录名",
            QQ:"QQ",
            weiXin:"微信",
            weiBo:"微博",
            remarks:"备注",
            save:"保存",
            to:"至"
        },
        InShareUser:{
            alreadyShare:"已共享",
            userText:"用户"
        },
        magicbox_InProfileSet:{
            title:"情景模式",
            businessAffairs:"商务商务",
            fashionDynamic:"时尚动感",
            charmYouth:"魅力青春"
        },
        magicbox_PhoneticFunction:{
            title:"语音功能",
            prompt:"您好，请问需要什么帮助？",
            warning:"录音时间太短"
        },
        CameraSetup:{
            cSwitch:"开关",
            timingSwitch:"定时开关",
            photoRecord:"照片记录",
            emptyPhoto:"清空照片",
            empty:"清空"
        },
        StCharger:{
            situation:"可为本机充电",
            frequency:"1.5",
            frequencyText:"次",
            status:"空闲中",
            presentSituation:"正在充电中",
            ratedCurrent:"额定总电流",
            percentage:"当前电流比",
            electricCurrent:"USB-电流",
            geterror:"获取失败!",
            getload:"正在获取!"
        },
        MeIndex:{
            mobilePhone:"未登录",
            nickName:"请登录",
            title:"智能家居",
			
            intelligentFinance:"智慧金融",
            healthManagement:"健康管理",
            myEhome:"我的E家",
            homeSecurity:"家居安防",
            smallSquidCube:"小尤鱼魔方",
            layoutScene:"布置场景",
            crackRepair:"修哒哒",
            financialFish:"理财鱼",
            yunYizhen:"云易诊",

            messageCenter:"消息中心",
            equipmentSharing:"设备共享",
            controlPanel:"控制面板",
            intelligentLinkage:"智能联动",
            sceneMode:"情景模式",
            functionSetting:"功能设置",
            helpCenter:"帮助中心",
            about:"关于"
        },
        CoLinkedDetails:{
            ifText:"如果",
            pm2Check:"pm2.5检测仪",
            condition:"条件",
            value:"数值",
            pleaseInput:"(值可输入)",
            then:"就",
            purifier:"净化器",
            excute:"执行",
            pushMsg:"就推送\“开启空气净化器\”",
            cancle:"取消",
            save:"保存",
            pleaseNeedDeviceFirst:"请添加设备后再添加联动!",
            tempListen:"温度检测仪",
            tempBind:"温度联动"
        },
        CoLinkedList:{
            smartLinkageGanged:"智能联动",
            pollutionAlarm:"污染报警",
            alarmMsg:"室内净化器PM2.5大于95，推送\“有人抽烟\”",
            edit:"编辑",
            deleteText:"删除",
            scurityAlarm:"安防报警",
            purifierTreaterMsg:"室内净化器PM2.5大于95，推送\“有人抽烟\”",
            turnonLight:"开走廊灯",
            setTimeOut:"联动设置超时!",
            setSucess:"联动设置成功!",
            listenWhere:"触发条件：%d",
            aboutDevices:"有关设备：",
            ac:"空调",
            tv:"电视",
            dvd:"DVD",
            stb:"机顶盒",
            fan:"电风扇",
            sw:"开关",
            ss:"插座",
            slb: "电灯",
            iptv: "iptv",
            prj:"投影仪",
        },
        MeControlPanel:{
            controlPanel:"控制面板",
            setUp:"设置",
            open:"打开",
            study:"书房",
            bathroom:"卫生间",
            livingroom:"客厅",
            kitchen:"厨房",
            bedroom:"卧室"
        },
        MeFuncSet:{
            funcSetup:"功能设置",
            myMenue:"我的菜单",
            smartFinance:"智慧金融",
            healthManage:"健康管理",
            myEhome:"我的E家",
            homeSecurity:"家居安防",
            smallSquidCube:"小尤鱼魔方",
            layoutScene:"布置场景",
            crackRepair:"修哒哒",
            financialFish:"理财鱼",
            yunYizhen:"云易诊",
            extentionFunc:"扩展功能",
            newFunc:"增加新功能",
            oneKeySetting:"一键设置",
            find:"找回",
            mormalUse:"正常使用",
            wrSmartCamera:"维融智能摄像头"
        },
        SeAlertList:{
            msgCenter:"消息中心"
        },
        ehome_Ehome:{
            title:"我的E家",
            coswitch:"开关",
            socket:"插座",
            lamp:"电灯",
            air:"空调",
            projector:"投影仪",
            fansetup:"电风扇",
            tv:"电视",
            entertainment:"娱乐",
            clean:"净化器",
            kitchen:"智能厨房",
            toilet:"智能卫生间",
            curtain:"窗帘",
            stb:"机顶盒",
            recipe:"美食谱",
            fastoper:"快捷操作",
            sdvd:"DVD"
        },
        ehome_Air:{
            title:"空调",
            titleHide:'编辑遥控器',
            mode:"模式",
            airVolume:"风速",
            airDir:"风向",
            autoDir: "左右扫风",
            power: "电源开关",
            powerOpen: "打开",
            powerOff: "关闭",
            auto: "自动",
            cool: "制冷",
            dry: "除湿",
            fan: "通风",
            heat: "加热",
            temperature: "温度",
            low: "低风",
            middle: "中风",
            high: "高风",
            up: "向上",
            middle: "水平",
            down: "向下",
            on: "打开",
            off: "关闭",
        },
        magicbox_PlBTMain:{
            title:"蓝牙音箱",
            onBT:"开",
            offBT:"关",
            noPlay:"无播放",
            play:"正在播放：",
            BT:"蓝牙",
            readCard:"读卡",
            musicList:"曲目",
            sleep:"睡眠助理",
            msg1:"魔方不支持此功能！",
            msg2:"此功能还未完成！"
        },
        magicbox_CoBTSetup:{
            title:"蓝牙设置",
            switch_title:"开关",
            phoneBT:"手机蓝牙",
            switch_on:"已开启",
            switch_off:"已关闭",
            pairedDevice:"已配对设备",
            unPairedDevice:"未配对设备"
        },
        magicbox_PlBTSongList:{
            title:"音乐文件",
            noSelect_msg:"未选择播放歌曲！",
            noPlay_msg:"未播放歌曲！",
            last_msg:"已经是最后一首歌曲！",
            first_msg:"已经是第一首歌曲！"
        },
        ehome_CoSocket:{
            title:'插座',
            startTime:"开启时间",
            today:'今天'
        },
        ehome_Lamp:{
            title:"电灯",
            brightness:'亮度',
            color:"颜色"
        },
        ehome_CoSwitch:{
            title:"开关",
            off:'OFF',
            on:"ON",
            timing:"定时",
            room:"房间"
        },
        ehome_CoProjector:{
            title:'投影仪',
            titleHide:'编辑遥控器',
            pc:"电脑",
            video:"视频",
            signalSource:"信号源",
            zoom:"变焦",
            confirm:"确认",
            frame: "画面",
            direction: "方向",
            voice: "音量",
            power: "电源",
            exit:"退出",
        },
        ehome_CoFanSetup:{
            title:'电风扇',
            titleHide:'编辑遥控器',
            stall:"档位",
            head:"摇头",
            files:"档",
            off:"关闭",
            on:"打开",
            height:"高",
            lowTxt:"低",
            hourDialogTitle:"定时设置",
            hour:"小时",
            timeError: "电风扇未开启，无法设置定时！",
            power: "电源开关",
            oscillate: "摇头",
            speed: "风速",
            low: "1档",
            middle: "2档",
            high: "3档",
            time: "定时",
            mode: "风类",
            refrig:"制冷",
        },
        Ehome:{
            title:"设备列表",
            remark: "设备列表",
            irrcTitle: "红外设备列表",
            deviceDetail:"设备详情",
        },
        ZegBeeList:{
            title:"ZigBee",
            remark:"ZigBee",
            Switch:"开关",
            Socket:"插座",
            Lamp:"电灯"
        },
        remotecopy:{
            title:"遥控学习",
            remark:"遥控学习"
        },
        ModelChoice:{
            title:"选择型号",
            remark:"",
            type:"选择型号",
            auto:"自动匹配"
        },
        magicbox:{
            name:"魔方"
        },
        IR_Ac:{
            name:"空调",
            type:"AC00"
        },
        IR_Prj:{
            name:"投影仪",
            type: "PRJ0"
        },
        IR_Fan:{
            name:"风扇",
            type:"FAN0"
        },
        IR_Stb:{
            name:"机顶盒",
            type:"STB0"
        },
        IR_Dvd:{
            name:"DVD",
            type:"DVD0"
        },
        IR_Tv:{
            name:"电视机",
            type:"TV00"
        },
        IR_Iptv:{
            name:"IPTV",
            type:"IPTV"
        },
        IR_Study: {
            name: "学习型设备",
            type: "Study"
        },
        ZB_Sw:{
            name:"智能开关",
            type:"SW00"
        },
        ZB_Ss:{
            name:"智能插座",
            type:"SS00"
        },
        ZB_Slb:{
            name:"智能灯泡",
            type:"SLB0"
        },
        IRDevList:{
            title:"红外设备",
            remark:"",
            custom:"自定义"
        },
        gataway_choice:{
            title:"网关选择",
            remark:"网关选择"
        },
        Dev_Rename:{
            title:"设置{}名称",
            remark:"设置",
            fail:"新增失败，请重试",
            addMagicFail:"新增魔方失败！",
        },
        brandChoice:{
            title:"选择品牌",
            remark:"选择品牌"
        },
        AutoMatch:{
            title:"自动匹配设备",
            remark:"自动匹配设备",
            btnYes:"是",
            btnNo:"否",
            loadGetSearchIndex:"正在从远程记载搜索码!",
            thisBrandDeviceHaveNoSearchIndex:"已经没有可扫描的搜索码！",
            checkSearchIndexFor:"请对准目标进行测试，若设备正常反应请选择“是”，按“否”则快速切换到下一组匹配指令，什么也不选择则%d秒后自动切换到下一组",
            checkLastSearchIndexFinish:"已经没有可扫描的搜索码！",
            waitForLoadSearchIndex:"请等待加载搜索码!"
        },
        AddDev:{
            title:"添加设备",
            remark:"添加设备",
            MB:"小尤鱼魔方",
            IR:"红外设备",
            ZB:"ZigBee"
        },
        AddMB:{
            title:"添加小尤鱼魔方",
            remark:"添加小尤鱼魔方",
            autoscan:"自动搜索",
            barcord:"扫描二维码"
        },
        AddMBAuto:{
            title:"添加魔方",
            remark:"添加魔方",
            waitMsg:"正在扫描魔方，请确保手机和魔方在同一网段，该过程大概需要10秒钟...",
        },
        AddZigBee:{
            title:"添加",
            remark:"添加",
            msg1:"直接输入识别码",
            msg2:"扫码识别"
        },
        ehome_CoTV:{
            title:"电视机",
            titleHide:'编辑遥控器',
            volume:"音量",
            channel:"频道",
            source: "信号源",
            power:"电源",
            mute:"静音",
            menu:"菜单",
            Return: "返回",
            ok: "OK",
            up: "上",
            down: "下",
            left: "左",
            right: "右",

        },
        ehome_CoClean:{
            title:'净化器',
            titleHide:'编辑遥控器',
            currentState_tab:"当前状态",
            historyRecord_tab:"历史记录",
            timingSwitch_tab:"定时开关",
            text_1:"当前室内空气情况",
            text_2:"良好",
            text_3:"温度",
            text_4:"湿度",
            text_5:"放心呼吸吧，我的主人☺",
            text_6:"风速"
        },
        ehome_Kitchen:{
            title:"智能厨房",
            titleHide:'编辑遥控器',
            microwaveOven:"微波炉",
            refrigerator:"冰箱",
            oven:"烤箱",
            rangeHood:"吸油烟机",
            riceCooker:"电饭煲",
            notBound:"未绑定",
            open:"开启"
        },
        ehome_CoToilet:{
            title:'智能卫生间',
            titleHide:'编辑遥控器',
            someone:"有人",
            notSomeone:"无人",
            temperature:"便圈温度",
            water:"水量",
            close:"关",
            low:"底",
            middle:"中",
            height:"高",
            small:"小",
            large:"大"
        },
        ehome_CoCurtain:{
            title:'窗帘',
            titleHide:'编辑遥控器',
            opening:"当前开合度",
            close:"关闭",
            halfOpen:"半开",
            open:"全开"
        },
        ehome_CoIPTV:{
            title:'IPTV',
            titleHide:'编辑遥控器',
            tv:'电视机'
        },
        ehome_CoSTB:{
            title:'机顶盒',
            titleHide:'编辑遥控器',
            tv: '电视机',
            power: "电源",
            return: "返回",
            left: "左", 
            up: "上", 
            right: "右",
            down: "下",
            ok: "确认",
            volUp: "音量+",
            mute: "静音",
            volDown: "音量-",
            ok: "确定",
            director: "节目导播",
            menu: "菜单",
            tvMute: "电视静音",
            tvPower: "电视电源开关",
        },
        ehome_CoSDVD:{
            title:"DVD",
            titleHide:'编辑遥控器',
            power:'电源',
            mute:"静音",
            switchBin: "关/开仓",
            volume:"音量",
            fastForward:"快进",
            rewind:"快退",
            lastSong:"上一曲",
            nextSong:"下一曲",
            play:"播放",
            menu:"菜单",
            returning: "返回",
            up: "上",
            down: "下",
            ok:"OK",
        },
        magicbox_InAboutMB:{
            title:'关于魔方',
            loadConfigTimeOut:"恢复配置超时!",
            loadConfigSucess:"恢复配置成功!"
        },
        magicbox_InConfBackup:{
            title:'配置备份',
            remark_text:'备注：',
            saveConfigTimeOut:"保存配置超时!",
            saveConfigSucess:"保存配置成功!"
        },
        footer_menu:{
            home:"主页",
            equipment:"设备",
            mall:"敢尚商城",
            my:"我的"
        },
        magicbox_PlRealTimeVideo:{
            title:"摄像头"
        },
        magicbox_CameraSetup:{
            title:"摄像头设置",
            cSwitch:"开关",
            timingSwitch:"定时开关",
            photoRecord:"照片记录",
            emptyPhoto:"清空照片",
            empty:"清空"
        },
        magicbox_PlCaptureRec:{
            title:"照片记录"
        },
        magicbox_PhotoDetail:{
            title:"照片放大"
        },
        magicbox_StCharger:{
            title:"充电宝",
            situation:"",
            frequency:"?",
            frequencyText:"%",
            status:"空闲中",
            presentSituation:"正在充电中",
            ratedCurrent:"额定总电量",
            percentage:"当前电流比",
            electricCurrent:"USB-电流"
        },
        magicbox_InShareUser:{
            title:"设备共享",
            alreadyShare:"已共享",
            userText:"用户"
        },
        magicbox_addInShareUser:{
            title:"设备共享",
            choiceTime:"请选择有效时限",
            loginName:"登录名",
            QQ:"QQ",
            weiXin:"微信",
            weiBo:"微博",
            remarks:"备注",
            save:"保存"
        },
        magicbox_InMBSetup:{
            title:"设置",
            SeAddDev:"添加配置的智慧设备",
            add:"添加",
            NetSetup:"网络设置",
            msgSub:"消息订阅",
            BluSet:"蓝牙设置",
            EquDetails:"设备详情",
            upgrade:"固件升级",
            DeviceRestart:"设备重启",
            about:"关于智能魔方"
        },
        magicbox_InNetSetup:{
            title:"网络设置",
            networkMode:"网路模式",
            router:"路由器",
            relay:"中继",
            wifiSettings:"WIFI设置",
            ssid:"SSID",
            ssidPlaceholder:"输入SSID",
            password:"密码",
            passwordPlaceholder:"输入密码",
            networkSettings:"网路设置",
            ipAddress:"IP地址",
            ipAddressPlaceholder:"请输入IP地址",
            netMask:"子网掩码",
            netMaskPlaceholder:"输入子网掩码",
            gateway:"网关",
            gatewayPlaceholder:"输入网关",
            dns:"DNS",
            dnsPlaceholder:"输入DNS"
        },
        magicbox_InMBRestart:{
            title:"重启魔方",
            restart:"重启",
            restartPrompt:"系统正在重启中，请稍后...",
            restartTimeOut:"设备重启超时!",
            restartSucess:"设备重启成功!"
        },
        magicbox_InUpgrade:{
            title:"固件升级",
            Prompt:"正在执行更新，请稍等..."
        },
        magicbox_StMBMain:{
            title:"智能魔方",
            HW:"红外遥控",
            CDB:"充电宝",
            YX:"蓝牙音箱",
            SXT:"摄像头",
            CJ:"场景模式",
            QJ:"情景模式",
            GX:"设备共享",
            comfortableDegree:"舒适度",
            temperature:"温度",
            humidity:"湿度",
            methanol:"甲醇",
            chemicalPollutants:"化学污染物",
            quantized:"空气质量"
        },
        tooltip_tooltip:{
            study_title:"按键学习提示",//学习-标题
            study_content1:"1.将遥控器发射处对准备手机顶部的红外接收口，并保持5厘米的距离。",//学习-内容1
            study_content2:"2.在学习开始后，再按住遥控器上需要学习的按键保持3秒。",//学习-内容2
            study_noprompt:"不再提示",//学习-不再提示（文字）
            study_submit:"确定",//学习-确定（文字）
            study_cancle:"取消",//学习-取消（文字）
            btcnn_text:"正在连接..."//蓝牙连接-正在连接
        },
        magicbox_SeSubscribe:{
            title:"消息订阅",
            ldDetection:"电池低电量探测",
            repeatedAlarm:"重复报警",
            no:"否",
            yes:"是",
            alarmInterval:"报警间隔(毫秒)",
            aqDetection:"空气质量探测",
            ihDetection:"红外人体探测",
            tempDetection:"温度探测",
            tempMax:"温度上限",
            tempMin:"温度下限",
            thDetection:"湿度探测",
            thMax:"湿度上限",
            thMin:"湿度下限"
        },
        CoStageSet:{
            title:"布置场景",
        },
        FixStage:{
            BackHome:"回家模式",
            ExitHome:"离家模式",
            Schedule:"日程",
            Mode:"场景",
        },
        StageRightMenu:{
            Start:"启动",
            End:"关闭",
            Edit:"修改",
            Delete:"删除",
        },
        DeviceRightMenu:{
            Study:"学习",
            Add:"新增",
            Edit:"修改",
            Delete:"删除",
        },
        CoChoice:{
            title:"添加场景",
            stageTitle:"场景",
            scheduleTitle:"日程",
        },
        CoSetName:{
            title:"设置名称",
        },
        CoSchedule:{
            power:"关/开",
            mode:"自动",
            airVolume:"风速",
            airDir:"风向",
            autoDir:"扫风",
            stop:"暂停",
            play:"播放",
            oscillate:"摇头",
            light:"亮度",
            step:"档",
            noPeriod: "无",
            video: "视频",
            pc:"电脑",
            nextBtn:"下一步",
            choicePeriod:"周期选择",
            modeImgDialogTitle:"场景图片选择",
            weekDialogTitle:"周重复设置",
            periodDialogTitle:"周期选择",
            tempDialogTitle:"温度调节",
            fanSpeedDialogTitle:"档位调节",
            lampColorDialogTitle:"选择一个颜色",
            lampLightDialogTitle:"选择一个亮度",
            deviceDialogTitle:"设备列表",
            noScheduleError:"未获取到情景类别！",
            noDeviceError:"请先添加设备！",
            withNoDeviceError:"未选择任何设备！",
            timeSelectError:"开始时间不可大于结束时间！",
        },
        ehome_SeRemoteCopy:{
            title:"按键学习",
            message1:"正在接收遥控信号......",
            message2:"请点击遥控器上需要学习的按键并且保持3秒以上进行学习。",
            message3:"已经学习了该按键，请对准目标设备测试。",
            message4:"若设备正常响应，请点击“保存”。",
            reStudy:"重新学习",
            failStudy:"学习失败，请重试",
        },
        magicbox_VideoList:{
            title:"视频列表"
        },
        Period:{
            second: "每秒",
            minute: "每分钟" ,
            hour: "每小时" ,
            day: "每天" ,
            week: "每周" ,
            month: "每月" ,
            year: "每年" ,
            manual: "手动" ,
            none: "无" 
        },
        //周重复
        Week:{
           Mon: "周一" ,
           Tus: "周二" ,
           Wed: "周三" ,
           Thr: "周四" ,
           Fri: "周五" ,
           Sat: "周六" ,
           Sun: "周日" 
        },
	    //场景模式图标
        ModeImg: {
            video: "影音模式",
            meeting: "会客模式",
            casual: "休闲模式",
            meals: "用餐模式",
            sleep: "就寝模式",
            aaronli: "免扰模式",
            customer: "自定义",
        },
        //语音识别跳转
        VoiceNavigate: {
            device: "打开|设备列表",
            home: "打开|主页",

        },
        home_OneKeyConfig:{
        	title:"一键设置"
        }
	};
	return i18n_zh;
});