angular.module('ngApp', [])
.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})
.filter('number', function() {
    return function(input) {
        return parseInt(input, 10);
    };
})

.controller("IndexController", function IndexController($scope, $compile,$timeout){

        $scope.SelectedGang;
        $scope.DataNumberGang = [];
        $scope.DataNumberGangForShowData = [];
        $scope.DataMaxNumberGang = [];

        $scope.CreateDateData = function(date,format,number){
            var dateArr = [];
            var _date = moment(date,format);
            var fromDate,toDate;
            if (typeof number == 'undefined') {
                fromDate = -1;
                toDate = 7;
            }
            else {
                fromDate = -number;
                toDate = number + 1;
            }

            for(var i=fromDate;i<toDate;i++)
            {
                var isSunday = false;
                var isSaturday = false;
                var date_temp =  moment(_date).add("days",i);
                var day = date_temp.day();
                if(day == 6)
                    isSaturday = true;
                if(day == 0)
                     isSunday =true;

                var obj = {
                    "idx":i+1,
                    "title": date_temp.format("MM")+"/"+date_temp.format("DD")+" ("+ date_temp.format("ddd")+")",
                    "numberDay":4,
                    "value":["00","06","12","18"],
                    "isSunday": isSunday,
                    "isSaturday": isSaturday,
                    "date":date_temp
                };
                dateArr.push(obj);
                var obj1 = {
                    "item1":0,
                    "item2":0,
                    "item3":0,
                    "item4":0,
                    "date":date_temp
                }
                $scope.DataNumberGang.push(obj1);
                $scope.DataNumberGangForShowData.push({"date":date_temp, "value":["","","",""]});
                $scope.DataMaxNumberGang.push({"date":date_temp, "value":""});
            }

            return dateArr;
        }


        //Create style for col date time left
        $scope.width_rec = 30;
        $scope.height_rec = 60;
        $scope.number_hour = 6;
        $scope.time_rate = $scope.height_rec/$scope.number_hour; //change 1h to px
        //time step 5 = 30p, 10 = 1h
        $scope.time_step = 5;
        $scope.tableTimes = [];
        $scope.InitTableTime = function (date,format,number){

            $scope.timeData = $scope.CreateDateData(date,format,number);
            var count =0;
            $scope.timeData.forEach(function (item) {

                $scope.styleChildLeft = [];
                $scope.styleChildRigth1 = [];
                $scope.styleChildRigth2 = [];
                item.value.forEach(function(){
                   $scope.styleLeft = {
                       "position": "absolute",
                       "width": $scope.width_rec+ "px",
                       "height": ($scope.height_rec -1) + "px",
                       "border-bottom": "1px solid #ABABAB",
                       "top": (count*$scope.height_rec + 1) +"px",
                       "font-size": "14px",
                       "left":"60px"
                   }
                    $scope.styleChildLeft.push($scope.styleLeft);

                    $scope.styleRight1 = {
                        "position": "absolute",
                        "width": $scope.width_rec + "px",
                        "height": ($scope.height_rec -1) + "px",
                        "border-bottom": "1px solid #ABABAB",
                        "top": (count*$scope.height_rec + 1) +"px",
                        "left": "1px",
                        "font-size": "14px"
                    }
                    $scope.styleChildRigth1.push($scope.styleRight1);

                    $scope.styleRight2 = {
                        "position": "absolute",
                        "width": $scope.width_rec + "px",
                        "height": ($scope.height_rec -1) + "px",
                        "border-bottom": "1px solid #ABABAB",
                        "top": (count*$scope.height_rec + 1) +"px",
                        "left": "32px",
                        "font-size": "14px"
                    }
                    $scope.styleChildRigth2.push($scope.styleRight2);

                    count ++;
                });

                var color = "";
                if(item.isSaturday || item.isSunday)
                    color = "red";

                if(!$scope.tableTimes[item.idx]) {
                    $scope.tableTimes[item.idx] ={
                        style:{
                            "height": $scope.height_rec*item.value.length -3 ,
                            "font-size": "14px",
                            "color": color,
                            "text-transform": "uppercase"
                        },
                        styleLeft:{
                            "height": $scope.height_rec*item.value.length -3 ,
                            "font-size": "14px"
                        },
                        styleChildLeft : $scope.styleChildLeft,
                        styleChildRigth1: $scope.styleChildRigth1,
                        styleChildRigth2: $scope.styleChildRigth2
                    }
                }
            });
        }


        //Berth data function
        $scope.BerthStyle = {};
        $scope.ContentStyle = {};
        $scope.StyleColGang = {};
        $scope.TotalBittData = [];
        var total_width = 0;
        // 1m = 2px
        $scope.BittRate = 1;
        $scope.InitBerth = function (BerthData,BittData){

            $scope.BerthData = BerthData;
            $scope.BittData = BittData;
            var common_height = 20;
            var berth_width = 0;
            var berth_height = 25;
            var berth_start_postion = 0;
            var berth_end_postion= 0;
            var style_position = [];
            var style_group = [];
            var style_content = [];
            var style_bitt = [];
            var bitt_table_width =0;

            for(var i=0;i<BerthData.length;i++)
            {
                for(var j=0;j<BittData.length;j++)
                {
                     if(BerthData[i].id == BittData[j].id_berth)
                     {
                         var bitt_data = BittData[j].data;

                         //Add distant when convert m to px
                         //var distant_plus = bitt_data.length*bitt_width_plus;
                         BerthData[i].start_postion = BerthData[i].start_postion*$scope.BittRate;
                         BerthData[i].end_position = BerthData[i].end_position*$scope.BittRate;

                         //Berth style and data
                         if(total_width < BerthData[i].end_position)
                             total_width = BerthData[i].end_position ;

                         berth_width = BerthData[i].end_position - BerthData[i].start_postion;
                         var obj_style_group = {
                             "width": (berth_width -1) +"px",
                             "position": "absolute",
                             "border": "1px solid #ABABAB",
                             "left": BerthData[i].start_postion +"px",
                             "top":"0",
                             "height":"22px"
                         }
                         style_group.push(obj_style_group);

                         var obj_style_content = {
                             "width": (berth_width -3) +"px",
                             "position": "absolute",
                             "left": BerthData[i].start_postion +"px",
                             "top": (berth_height -2) +"px"
                         }
                         style_content.push(obj_style_content);

                         if(berth_end_postion < BerthData[i].end_position)
                             berth_end_postion = BerthData[i].end_position;

                         //Bitt style and style
                         if(bitt_data != null)
                         {
                             var bitt_end_position =0;
                             for(var k =0;k<bitt_data.length;k++)
                             {
                                 bitt_data[k].start_position = parseFloat(bitt_data[k].start_position)*$scope.BittRate;
                                 bitt_data[k].end_position = parseFloat(bitt_data[k].end_position)*$scope.BittRate;

                                 if(bitt_end_position < bitt_data[k].end_position)
                                     bitt_end_position = bitt_data[k].end_position;

                                 var obj_bit_style = {
                                     "style": {
                                        "width": bitt_data[k].end_position - bitt_data[k].start_position,
                                        "height": common_height +"px",
                                        "left": bitt_data[k].start_position ,
                                         "position": "absolute",
                                         "text-align": "left"
                                     },
                                     "style_rule": {
                                         "width": (j==0 && k==0) ? bitt_data[k].end_position - bitt_data[k].start_position - 1 : bitt_data[k].end_position - bitt_data[k].start_position,
                                         "height": 10 +"px",
                                         "left": bitt_data[k].start_position,
                                         "border-left": (j==0 && k==0) ? "1px solid #525252":"" ,
                                         "border-right": "1px solid #525252",
                                         "position": "absolute",
                                         "bottom":"0"
                                     },
                                     "name":bitt_data[k].name
                                 }
                                 style_bitt.push(obj_bit_style);

                                 var bittData = {
                                     "id": bitt_data[k].id,
                                     "id_berth": BittData[j].id_berth,
                                     "start_position": bitt_data[k].start_position,
                                     "end_position": bitt_data[k].end_position,
                                     "name":bitt_data[k].name,
                                     "idx":bitt_data[k].idx
                                 }
                                 $scope.TotalBittData.push(bittData);
                             }

                             if(bitt_table_width <bitt_end_position)
                             bitt_table_width = bitt_end_position;
                         }

                         BittData[j].data = bitt_data;
                     }
                }
            }

            //Get style for position data
            var count =0;
            for(var i = berth_start_postion; i<= berth_end_postion - (100*$scope.BittRate); i= i + 100*$scope.BittRate)
            {
               var obj_style_position = {
                   "style":{
                        "width": (100*$scope.BittRate) +"px",
                        "left": i+ "px",
                        "position": "absolute",
                        "text-align": "left"
                   },
                   "value":  100*count
               }
                count++;
                style_position.push(obj_style_position);
            }

            $scope.BerthStyle = {
                "style_group":style_group,
                "style_content":style_content,
                "style_position": style_position,
                "style_bitt": {
                    "data_style":style_bitt,
                    "style": {
                       "width":bitt_table_width
                    }
                }
            }


            $scope.ContentStyle = {
                "style":{
                    "width":(total_width+1)+"px"
                }
            }

            $scope.StyleColGang = {
                "left":(total_width + 100) + "px",
                "position": "absolute"
            }
        }

        $scope.mapStyles;
        $scope.mapStyle;
        $scope.InitMap = function (timeData){
            $scope.mapStyles = [];
            $scope.mapStyle = {};
            var totalDay = 0;
            timeData.forEach(function (item) {
                totalDay += item.numberDay;
            });
            for(var i=0;i<totalDay;i++)
            {
                var objStyle = {
                    "id":i,
                    "childStyle": {
                        width: total_width +"px",
                        height: ($scope.height_rec -1) + "px",
                        "border-bottom": "1px solid rgb(90, 90, 90)",
                        "position": "absolute",
                        "top": (i*$scope.height_rec + 1)+"px",
                        "left":"0"
                    }
                }

                $scope.mapStyles.push(objStyle);
            }

            $scope.mapStyle = {
                "style": {
                    "width": (total_width + 1) + "px",
                    "height": (totalDay * $scope.height_rec +1) + "px"
                },
                "height":{
                    "height": (totalDay * $scope.height_rec +1) + "px"
                }
            }

        }


        $scope.VesselDataEdit =[];
        $scope.VesselStyle = [];
        $scope.InitVessel = function(previousDate,VesselData,mooring_distant_left,mooring_distant_right){

            mooring_distant_left = mooring_distant_left*$scope.BittRate;
            mooring_distant_right= mooring_distant_right*$scope.BittRate;

            var content = "";
            for(var i=0;i<VesselData.length;i++) {

                //Cal m to px with rate
                VesselData[i].head_position = VesselData[i].head_position*$scope.BittRate;
                VesselData[i].LOA = VesselData[i].LOA*$scope.BittRate;
                VesselData[i].LBP = VesselData[i].LBP*$scope.BittRate;
                VesselData[i].bridge_to_stern = VesselData[i].bridge_to_stern*$scope.BittRate;
                //stern ramp
                VesselData[i].stern_ramp.ramp_width =VesselData[i].stern_ramp.ramp_width*$scope.BittRate;
                VesselData[i].stern_ramp.ramp_start_position =VesselData[i].stern_ramp.ramp_start_position*$scope.BittRate;
                VesselData[i].stern_ramp.ramp_occupied_distance =VesselData[i].stern_ramp.ramp_occupied_distance*$scope.BittRate;
                //Side ramp
                VesselData[i].side_ramp.ramp_width =VesselData[i].side_ramp.ramp_width*$scope.BittRate;
                VesselData[i].side_ramp.ramp_start_position =VesselData[i].side_ramp.ramp_start_position*$scope.BittRate;
                VesselData[i].side_ramp.ramp_occupied_distance =VesselData[i].side_ramp.ramp_occupied_distance*$scope.BittRate;

                var format = "DD/MM/YYYY hh:mm";
                var ETA_Date = moment(VesselData[i].eta_date, format);
                var ETD_Date = moment(VesselData[i].etd_date, format);

                var eta_number_days =  ETA_Date.diff(previousDate, 'days');
                var eta_hh = parseInt(ETA_Date.format("HH"));
                var etd_number_days = ETD_Date.diff(ETA_Date, 'days');
                var etd_hh = parseInt(ETD_Date.format("HH"));

                //Cal top
                var rectangle_height = $scope.height_rec;
                var vessel_top = eta_number_days*(rectangle_height*4) +(eta_hh)*$scope.time_rate;

                //Cal vessel heigh
                var vessel_height = 0;
                if(etd_number_days <= 0) {
                    vessel_height = (24 - eta_hh)*$scope.time_rate - ((24 - etd_hh)*$scope.time_rate);
                }
                else {
                    vessel_height = (24 - eta_hh)*$scope.time_rate + (etd_number_days -1)*24*$scope.time_rate +  etd_hh*$scope.time_rate;
                }

                var along_side = VesselData[i].along_side;
                var head_position = VesselData[i].head_position;
                var LOA = VesselData[i].LOA;
                var berth_dir_cd = VesselData[i].berth_dir_cd;
                var bridge_to_stern = VesselData[i].bridge_to_stern;
                var stern = 0;
                var bridge_position = 0;
                var vessel_left = 0;

                //Calculator
                if(berth_dir_cd == $scope.berth_direction[0]) {
                   if(along_side == $scope.along_side_type[0]) {
                       stern = head_position - LOA;
                       bridge_position = head_position - LOA + bridge_to_stern;
                   }
                   else if(along_side == $scope.along_side_type[1]){
                       stern = head_position + LOA;
                       bridge_position = head_position + LOA - bridge_to_stern;
                   }
                }
                else if(berth_dir_cd == $scope.berth_direction[1]) {
                    if(along_side == $scope.along_side_type[0]) {
                        stern = head_position + LOA;
                        bridge_position = head_position + LOA - bridge_to_stern;
                    }
                    else if(along_side == $scope.along_side_type[1]){
                        stern = head_position - LOA;
                        bridge_position = head_position - LOA + bridge_to_stern;
                    }
                }

                var vessel_direction = "";
                //Vessel left to right
                var distant = head_position - stern;
                if(distant >0)
                {
                    vessel_direction = "left-right";
                    vessel_left = stern - mooring_distant_left;
                }
                else
                {
                    vessel_direction = "right-left";
                    vessel_left = head_position - mooring_distant_left;
                }

                var dataSave = {
                    "id": VesselData[i].id,
                    "head_position": head_position,
                    "LOA": LOA,
                    "vessel_top":0,
                    "vessel_height":0,
                    "vessel_dir":vessel_direction,
                    "ETA_date": ETA_Date.format('DD/MM/YYYY HH:SS'),
                    "ETD_date": ETD_Date.format('DD/MM/YYYY HH:SS'),
                    "start_time":ETA_Date.format('HH:SS'),
                    "end_time":ETD_Date.format('HH:SS'),
                    "morring_bitt_left": {},
                    "morring_bitt_right": {},
                    "berth_bitt_left": {},
                    "berth_bitt_right": {},
                    "gang_item":[],
                    "vessel_name":VesselData[i].name,
                    "vessel_code":VesselData[i].code,
                    "mooring_distant_left":mooring_distant_left,
                    "mooring_distant_right":mooring_distant_right
                }

                $scope.VesselDataEdit.push(dataSave);

                //Cal ramp
                var stern_ramp_radians = (VesselData[i].stern_ramp.ramp_degree -90) * Math.PI / 180;
                var stern_ramp_width = Math.round(VesselData[i].stern_ramp.ramp_width/Math.cos(stern_ramp_radians));
                var side_ramp_radians = (VesselData[i].side_ramp.ramp_degree -90) * Math.PI / 180;
                var side_ramp_width = Math.round(VesselData[i].side_ramp.ramp_width/Math.cos(side_ramp_radians));

                //Draw vessel
                //Create option for draw vessel
                var option = {
                    "stern" : stern,
                    "bridge_position" : bridge_position,
                    "mooring_distant_left" : mooring_distant_left,
                    "mooring_distant_right" : mooring_distant_right,
                    "vessel_height": vessel_height -3,
                    "vessel_top": vessel_top,
                    "vessel_left": vessel_left,
                    "vessel_direction" : vessel_direction,
                    "stern_ramp_width" :  VesselData[i].stern_ramp.ramp_occupied_distance,
                    "stern_ramp_start_position": VesselData[i].stern_ramp.ramp_start_position,
                    "stern_ramp_degree" : VesselData[i].stern_ramp.ramp_degree,
                    "side_ramp_width" : VesselData[i].side_ramp.ramp_occupied_distance,
                    "side_ramp_start_position" : VesselData[i].side_ramp.ramp_start_position,
                    "side_ramp_degree" : VesselData[i].side_ramp.ramp_degree
                }

                content += $scope.DrawVessel(VesselData[i],option,i);
            }

            if(typeof content !='undefined' && content != "undefined")
                $("#vessel-content").append(content);

             $scope.InitSortable();
             $scope.InitDraggableShip();
             $scope.InitResizable();

            console.log("data edit: ",$scope.VesselDataEdit);
            console.log("data save: ",$scope.VesselDataSave());

            $timeout(function(){
                //$scope.CheckValidationVesselInBerth();
                $scope.CheckValidationVessel();
            },100);
        }

        //Distant Between block1 and block2
        var block2_margin  = 4;
        $scope.DrawVessel = function (data, option,index) {

            var distant = data.head_position - option.stern;
            var width_vessel = Math.abs(distant);
            var width = width_vessel + option.mooring_distant_left + option.mooring_distant_right;
            var height = option.vessel_height;

            var content = " ";
            var mooring_bitt_left = $scope.GetBittByPosition(option.vessel_left);
            var mooring_bitt_right = $scope.GetBittByPosition(option.vessel_left + width);

            var berth_bitt_left = $scope.GetBittByPosition(option.vessel_left + option.mooring_distant_left);
            var berth_bitt_right = $scope.GetBittByPosition(option.vessel_left + option.mooring_distant_left + width_vessel);
            var ramp_line_height = option.vessel_top + option.vessel_height;
            var bridge_position = $scope.GetBridgeByPosition(option.bridge_position);

            if(typeof mooring_bitt_left == 'undefined' || typeof mooring_bitt_right == 'undefined' || typeof berth_bitt_left == 'undefined' || typeof berth_bitt_right == 'undefined')
                return "";

            $scope.VesselDataEdit[index].morring_bitt_left  = mooring_bitt_left;
            $scope.VesselDataEdit[index].morring_bitt_right = mooring_bitt_right;
            $scope.VesselDataEdit[index].berth_bitt_left  = berth_bitt_left;
            $scope.VesselDataEdit[index].berth_bitt_right = berth_bitt_right;
            $scope.VesselDataEdit[index].vessel_top = option.vessel_top;
            $scope.VesselDataEdit[index].vessel_height = height;

            var block_content = $("#vessel-line-content");
            var div_rule = $("#div_rule");
            if(option.vessel_direction == "left-right") {

                var stern_ramp_distant = option.stern_ramp_start_position - option.stern_ramp_width;
                var stern_ramp_left = option.mooring_distant_left + stern_ramp_distant;

                var side_ramp_distant = option.side_ramp_start_position - option.side_ramp_width;
                var side_ramp_left =  option.mooring_distant_left + side_ramp_distant;

                var stern_ramp_left_line = option.vessel_left +stern_ramp_left;
                var side_ramp_left_line = option.vessel_left + side_ramp_left;
                var vessel_line_content =  "<div class='vessel-line line-horizontal' id='vessel-line-top-"+data.id+"' style='width:100%;position: absolute;top:"+(option.vessel_top + block2_margin )+"px'></div>\
                                            <div class='vessel-line line-horizontal' id='vessel-line-bottom-"+data.id+"' style='width:100%;position: absolute;top:"+(option.vessel_top + height + 3 + block2_margin)+"px'></div>\
                                            <div class='vessel-line line-vertical' id='vessel-line-left-"+data.id+"' style='left:"+(option.vessel_left + 100)+"px;'></div>\
                                            <div class='vessel-line line-vertical' id='vessel-line-right-"+data.id+"' style='left:"+(option.vessel_left + 100 + width)+"px;'></div>\
                                            <div class='vessel-line line-vertical' id='vessel-line-mooring-left-"+data.id+"' style='left:"+(option.vessel_left + 100 + option.mooring_distant_left)+"px;'></div>\
                                            <div class='vessel-line line-vertical' id='vessel-line-mooring-right-"+data.id+"' style='left:"+(option.vessel_left + 100 + width - option.mooring_distant_right)+"px;'></div>";


                $(block_content).append(vessel_line_content);

                var ramp_content = "<div id='stern-ramp-top-"+data.id+"' class='line-1 vessel-ramp-top' style='display:none;width: "+option.stern_ramp_width+"px;position: absolute;bottom:0;left: "+(stern_ramp_left + option.vessel_left + 2)+"px;z-index: 100;border-bottom: 3px solid red;'></div>\
                                    <div id='side-ramp-top-"+data.id+"' class='line-2 vessel-ramp-top' style='display:none;width:"+option.side_ramp_width+"px;position: absolute;bottom:0;left: "+(side_ramp_left + option.vessel_left + 2)+"px;z-index: 100;border-bottom: 3px solid red;'></div>";
                $(div_rule).append(ramp_content);

                content = "\
                    <div id='bridge-line-"+data.id+"' class='bridge' style='height:"+option.vessel_top+"px;left:"+(option.bridge_position -1)+"px'></div>\
                    <div id='vessel-"+data.id+"' calling_status_color='"+data.calling_status_color+"' calling_type_color='"+data.calling_type_color+"' service_lane_color='"+data.service_lane_color+"' berth-dir-cd='"+data.berth_dir_cd+"' along-side='"+data.along_side+"' LOA='"+data.LOA+"' bridge-to-stern='"+data.bridge_to_stern+"' vessel-status='"+data.status+"' vessel-id='"+data.id+"' head-position='"+data.head_position+"' stern-position='"+option.stern+"' vessel-dir='"+option.vessel_direction+"' morrring_bitt_left='"+option.mooring_distant_left+"' morrring_bitt_right='"+option.mooring_distant_right+"' class='shiping wrapper' style='width: "+(width-3)+"px;height: "+height+"px;position: absolute;top: "+ option.vessel_top +"px;left: "+option.vessel_left+"px;border: 2px solid;text-align: center;'>\
                        <div id='stern-ramp-"+data.id+"' class='line-1 vessel-ramp' style='width: "+option.stern_ramp_width+"px;position: absolute;bottom:0;left: "+stern_ramp_left+"px;z-index: 100;border-bottom: 3px solid red;'></div>\
                        <div id='side-ramp-"+data.id+"' class='line-2 vessel-ramp' style='width:"+option.side_ramp_width+"px;position: absolute;bottom:0;left: "+side_ramp_left+"px;z-index: 100;border-bottom: 3px solid red;'></div>\
                        <div class='ship-left' style='width: "+(option.mooring_distant_left -2)+"px;height:100%;float: left; position: relative;'><span id='morring-bitt-left-"+data.id+"' bitt_id='"+mooring_bitt_left.id+"' style='font-size: 13px;float: left'>"+mooring_bitt_left.name+"</span></div>\
                        <div id='vessel-content-"+data.id+"' vessel-id="+data.id+" vessel-dir='"+option.vessel_direction+"' class='shipping-content' style='background: "+data.vessel_color+";height: "+height+"px;border-left: 2px solid;border-right: 2px solid;float: left;width: "+(width_vessel -3)+"px; position: relative;'>\
                                <span style='font-size: 10px;float: left;font-weight: bold;margin-top: 2px;'>"+data.code+"</span>\
                                <div id='bridge-"+data.id+"' class='vessel-bridge' style='height: 100%; position:absolute; border-left: 2px dashed red;left:"+(Math.abs(option.stern - option.bridge_position) -3)+"px'></div>\
                                <div class='head-vessel-right'> \
                                        <div class='vessel-status-right'>"+data.status+"</div> \
                                        <div style='border-top: 10px solid transparent;border-left: 12px solid  #000000;border-bottom: 10px solid transparent;right:0'></div>\
                                </div>\
                                <div vessel-id='"+data.id+"' class='has-gang shiping-child wrapper' style='height: 100%;float: left;width: calc(100% - 30px);float: right;position: absolute;right: 30px;'></div>\
                                <div class='along-side-left'><span>"+data.along_side_name+"</span></div>\
                                <div id='bridge-content"+data.id+"' bridge-position='"+option.bridge_position+"' style='position: absolute;bottom: 4px;left: 20px;font-size: 10px;font-weight: bold;'><span>"+bridge_position.bridge_content+"</span></div>\
                        </div>\
                        <div class='ship-right' style='width: "+(option.mooring_distant_right -2)+"px;height: 100%;float: right';position: relative;><span id='morring-bitt-right-"+data.id+"' bitt_id='"+mooring_bitt_right.id+"' style='font-size: 13px;float: right;'>"+mooring_bitt_right.name+"</span></div>\
                    </div>\
                    <div id='stern-ramp-line-left-"+data.id+"' style='height:"+ramp_line_height+"px; left:"+(stern_ramp_left_line +2)+"px' id='line-stern-ramp-"+data.id+"' id='line-stern-ramp-"+data.id+"' class='vertical vessel-ramp-line'> </div>\
                    <div id='side-ramp-line-left-"+data.id+"' style='height:"+ramp_line_height+"px; left:"+(side_ramp_left_line+2)+"px' id='line-stern-ramp-"+data.id+"' id='line-side-ramp-"+data.id+"' class='vertical vessel-ramp-line'> </div> \
                    <div id='stern-ramp-line-right-"+data.id+"' style='height:"+ramp_line_height+"px; left:"+(stern_ramp_left_line + option.stern_ramp_width +1)+"px' id='line-stern-ramp-"+data.id+"' id='line-stern-ramp-"+data.id+"' class='vertical vessel-ramp-line'> </div>\
                    <div id='side-ramp-line-right-"+data.id+"' style='height:"+ramp_line_height+"px; left:"+(side_ramp_left_line+ option.side_ramp_width +1)+"px' id='line-stern-ramp-"+data.id+"' id='line-side-ramp-"+data.id+"' class='vertical vessel-ramp-line'> </div>";
            }
            else{
                /*var stern_ramp_left = option.stern_ramp_start_position - option.vessel_left;
                var side_ramp_left =  option.side_ramp_start_position - option.vessel_left;*/

                var stern_ramp_distant = width_vessel -  option.stern_ramp_start_position;
                var stern_ramp_left = option.mooring_distant_left + stern_ramp_distant;
                var side_ramp_distant = width_vessel -  option.side_ramp_start_position;
                var side_ramp_left = option.mooring_distant_left + side_ramp_distant;

                var stern_ramp_left_line = option.vessel_left +stern_ramp_left;
                var side_ramp_left_line = option.vessel_left + side_ramp_left;
                var vessel_line_content = "<div class='vessel-line line-horizontal' id='vessel-line-top-"+data.id+"' style='top:"+(option.vessel_top + block2_margin)+"px'></div>\
                                           <div class='vessel-line line-horizontal' id='vessel-line-bottom-"+data.id+"' style='top:"+(option.vessel_top + height + 3 + block2_margin) +"px'></div>\
                                           <div class='vessel-line line-vertical' id='vessel-line-left-"+data.id+"' style='left:"+(option.vessel_left + 100)+"px;'></div>\
                                           <div class='vessel-line line-vertical' id='vessel-line-right-"+data.id+"' style='left:"+(option.vessel_left + 100 + width)+"px;'></div>\
                                           <div class='vessel-line line-vertical' id='vessel-line-mooring-left-"+data.id+"' style='left:"+(option.vessel_left + 100 + option.mooring_distant_left)+"px;'></div>\
                                           <div class='vessel-line line-vertical' id='vessel-line-mooring-right-"+data.id+"' style='left:"+(option.vessel_left + 100 + width - option.mooring_distant_right)+"px;'></div>";

                $(block_content).append(vessel_line_content);

                var ramp_content = "<div id='stern-ramp-top-"+data.id+"' class='line-1 vessel-ramp-top' style='display:none;width: "+option.stern_ramp_width+"px;position: absolute;bottom:0;left: "+(stern_ramp_left + option.vessel_left + 2)+"px;z-index: 100;border-bottom: 3px solid red;'></div>\
                                    <div id='side-ramp-top-"+data.id+"' class='line-2 vessel-ramp-top' style='display:none;width:"+option.side_ramp_width+"px;position: absolute;bottom:0;left: "+(side_ramp_left + option.vessel_left + 2)+"px;z-index: 100;border-bottom: 3px solid red;'></div>";
                $(div_rule).append(ramp_content);

                content = "\
                    <div id='bridge-line-"+data.id+"' class='bridge' style='height:"+option.vessel_top+"px;left:"+(option.bridge_position)+"px'></div>\
                    <div id='vessel-"+data.id+"' calling_status_color='"+data.calling_status_color+"' calling_type_color='"+data.calling_type_color+"' service_lane_color='"+data.service_lane_color+"' berth-dir-cd='"+data.berth_dir_cd+"' along-side='"+data.along_side+"' LOA='"+data.LOA+"' bridge-to-stern='"+data.bridge_to_stern+"' vessel-status='"+data.status+"' vessel-id="+data.id+" head-position='"+data.head_position+"' stern-position='"+option.stern+"' vessel-dir='"+option.vessel_direction+"' morrring_bitt_left='"+option.mooring_distant_left+"' morrring_bitt_right='"+option.mooring_distant_right+"' class='shiping wrapper' style='width: "+(width-3)+"px;height: "+height+"px;position: absolute;top: "+ option.vessel_top+"px;left: "+ option.vessel_left +"px;border: 2px solid;text-align: center;'>\
                        <div id='stern-ramp-"+data.id+"' class='line-1 vessel-ramp' style='width: "+option.stern_ramp_width+"px;position: absolute;bottom:0;left: "+stern_ramp_left+"px;z-index: 100;border-bottom: 3px solid red;'></div>\
                        <div id='side-ramp-"+data.id+"' class='line-2 vessel-ramp' style='width: "+option.side_ramp_width+"px;position: absolute;bottom:0;left: "+side_ramp_left+"px;z-index: 100;border-bottom: 3px solid red;'></div>\
                        <div class='ship-left' style='width: "+(option.mooring_distant_left -2)+"px;height:100%;float: left;position: relative'><span id='morring-bitt-left-"+data.id+"' bitt_id='"+mooring_bitt_left.id+"' style='font-size: 13px;float: left'>"+mooring_bitt_left.name+"</span></div>\
                        <div id='vessel-content-"+data.id+"' vessel-id="+data.id+" vessel-dir='"+option.vessel_direction+"' class='shipping-content' style='background: "+data.vessel_color+";height: "+height+"px;border-left: 2px solid;border-right: 2px solid;float: left;width: "+(width_vessel -3)+"px; position: relative;'>\
                                <div class='head-vessel-left'> \
                                        <div class='vessel-status-left'>"+data.status+"</div> \
                                        <div style='border-bottom: 10px solid transparent;border-right: 12px solid  #000000;border-top: 10px solid transparent;left: 0;'></div>\
                                </div>\
                                <span style='font-size: 10px;float: right;font-weight: bold;margin-top: 2px;'>"+data.code+"</span>\
                                <div id='bridge-"+data.id+"' class='vessel-bridge' style='height: 100%; position:absolute;border-left: 2px dashed red;;right:"+(Math.abs(option.stern - option.bridge_position) - 3)+"px'></div>\
                                <div vessel-id='"+data.id+"' class='has-gang shiping-child wrapper' style='height: 100%;float: left;width: calc(100% - 30px);position: absolute;left: 30px;'></div>\
                                <div class='along-side-right'><span>"+data.along_side_name+"</span></div>\
                                <div id='bridge-content"+data.id+"' bridge-position='"+option.bridge_position+"' style='position: absolute;bottom: 4px;right: 20px;font-size: 10px;font-weight: bold;'><span>"+bridge_position.bridge_content+"</span></div>\
                        </div>\
                        <div class='ship-right' style='width: "+(option.mooring_distant_right -2)+"px;height: 100%;float: right';position: relative;><span id='morring-bitt-right-"+data.id+"' bitt_id='"+mooring_bitt_right.id+"' style='font-size: 13px;float: right;'>"+mooring_bitt_right.name+"</span></div>\
                    </div> \
                    <div id='stern-ramp-line-left-"+data.id+"' style='height:"+ramp_line_height+"px;left:"+(stern_ramp_left_line +2)+"px' class='vertical vessel-ramp-line'></div>\
                    <div id='side-ramp-line-left-"+data.id+"' style='height:"+ramp_line_height+"px;left:"+(side_ramp_left_line +2)+"px' class='vertical vessel-ramp-line'></div> \
                    <div id='stern-ramp-line-right-"+data.id+"' style='height:"+ramp_line_height+"px;left:"+(stern_ramp_left_line + option.stern_ramp_width +1)+"px' class='vertical vessel-ramp-line'></div>\
                    <div id='side-ramp-line-right-"+data.id+"' style='height:"+ramp_line_height+"px;left:"+(side_ramp_left_line + option.side_ramp_width +1)+"px' class='vertical vessel-ramp-line'></div>";
            }

            return content;
        }

        $scope.InitDraggableShip = function ()
        {
            var target = $("div.shiping").not(".ui-draggable");
            if(typeof  target == "undefined")
                 return ;

            $.each($(target),function(index,item){
                if($(item).attr("vessel-status") == "P") {
                    $(item).draggable({
                        /*containment: "parent" ,*/
                        grid: [ 1, $scope.time_step],
                        containment:"parent",
                        drag: function( event, ui ) {

                            var target = ui.helper[0];
                            if(typeof target == 'undefined')
                                return;
                            $scope.UpdateLine(target);
                            $("div.shiping").css("z-index","100");
                            $(target).css("z-index","120");
                        },
                        stop: function( event, ui ) {

                            var target = ui.helper[0];
                            if(typeof target == 'undefined')
                                return;
                            $scope.UpdateLine(target);
                            $scope.UpdateData(target);
                            $scope.UpdateGangRightPositionByVessel(target);
                        }
                    }).disableSelection();
                }

            });
        }

        Date.prototype.addHours= function(h){
            this.setHours(this.getHours()+h);
            return this;
        }
        $scope.GetBittByPosition = function(position)
        {
            var bitt_obj;
            if($scope.TotalBittData.length >0)
            {
                for(var i=0;i<$scope.TotalBittData.length;i++) {
                   if(position >= $scope.TotalBittData[i].start_position && position <= $scope.TotalBittData[i].end_position)
                   {
                       var midd = ($scope.TotalBittData[i].end_position - $scope.TotalBittData[i].start_position)/2;
                       if(midd >= (position - $scope.TotalBittData[i].start_position))
                           bitt_obj = $scope.TotalBittData[i];
                       else
                       {
                           if(i == $scope.TotalBittData.length -1)
                                bitt_obj = $scope.TotalBittData[i];
                           else
                               bitt_obj = $scope.TotalBittData[i +1];
                       }
                   }
                }
            }
            return bitt_obj;
        }

        $scope.GetBridgeByPosition = function(position)
        {
            var bridge_obj;
            if($scope.TotalBittData.length >0)
            {
                for(var i=0;i<$scope.TotalBittData.length;i++) {
                    if(position >= $scope.TotalBittData[i].start_position && position <= $scope.TotalBittData[i].end_position)
                    {
                        var midd = ($scope.TotalBittData[i].end_position - $scope.TotalBittData[i].start_position)/2;
                        if(midd >= (position - $scope.TotalBittData[i].start_position))
                        {
                            bridge_obj = $scope.TotalBittData[i];
                            bridge_obj["operator"] = "+";
                        }
                        else
                        {
                            bridge_obj = $scope.TotalBittData[i+1];
                            bridge_obj["operator"] = "-";
                        }
                    }
                }
            }

            var  bridge_content ="";
            if(typeof bridge_obj != 'undefined') {
                if(bridge_obj.operator == '+'){

                    bridge_content = bridge_obj.name + " + " + Math.round((position - bridge_obj.start_position) /$scope.BittRate)  + "m";
                }
                else if(bridge_obj.operator == '-'){
                    bridge_content = bridge_obj.name + " - " + Math.round((bridge_obj.start_position - position)/$scope.BittRate) + "m";
                }
                else {
                    bridge_content = bridge_obj.name + " + " + "0m";
                }
            }
            bridge_obj["bridge_content"] = bridge_content;
            return bridge_obj;
        }


        $scope.GetDateByValue = function(date, value){

            var date_temp = moment(date).add("days", value.days);
            var start_date = new Date(date_temp.toDate()).addHours(value.hour);
            return start_date;
        }
        $scope.InitSortable = function ()
        {
            var target = $("div.has-gang").not(".ui-sortable");
            if(typeof target == "undefined")
                return;

            $(target).sortable({
                connectWith: ".has-gang",
                start:function(event,ui){
                    var target = ui.item;
                    if(typeof target != 'undefined')
                    {
                        var destination = ui.item.closest('div#col3-sub1');
                        if(typeof destination != 'undefined' && (destination).attr("id") != 'col3-sub1')
                            return;

                        var item_clone = $(target).clone();
                        if(typeof item_clone != 'undefined')
                        {
                            $(item_clone).css("position","");
                            $(target).after($(item_clone));
                        }

                    }
                },
                receive: function( event, ui ) {

                    var target = ui.item;
                    if(typeof target != 'undefined')
                    {

                        var destination = ui.item.closest('div.shipping-content');
                        if(typeof destination =='undefined')
                            return ;

                        if($(destination).attr("vessel-dir") != "")
                        {
                            var gang_id = $scope.RandomHasCode();
                            $(target).removeClass("gang-horizontal");
                            $(target).addClass("gang-vertical shiping-child gang-child vessel-gang");
                            $(target).attr("id",gang_id);

                            if($(destination).attr("vessel-dir") == "right-left") {
                                var style = $(target).attr("style") + "float:left;white-space: nowrap;";
                                $(target).attr("style",style);
                            }else{
                                var style = $(target).attr("style") + "float:right;white-space: nowrap;";
                                $(target).attr("style",style);
                            }

                            var vessel_id = $(destination).attr("vessel-id");
                            $(target).attr("vessel-id",vessel_id);
                            $scope.AddGangDataToVessel($(target)[0],vessel_id);

                            var tag_vessel = $("#vessel-"+vessel_id);
                            var gang_content = $(tag_vessel).find("div.has-gang");
                            if(typeof tag_vessel !="undefined" && typeof gang_content !="undefined") {

                               var number_gang = $(gang_content).find("div.gang-child").length;
                                var objGang = {
                                    "top":$(tag_vessel).position().top,
                                    "left": number_gang == 1?0: (number_gang -1)*18,
                                    "height":$(tag_vessel).height() +4,
                                    "id":gang_id,
                                    "color":$(target).attr("gang-color"),
                                    "vessel_id": vessel_id
                                };
                                $scope.DrawGang(objGang);
                            }
                        }

                        destination = ui.item.closest('div#col3-sub1');
                        if(typeof destination != 'undefined' && (destination).attr("id") == 'col3-sub1')
                        {
                            $(this).sortable('cancel');
                            $(ui.sender).sortable('cancel');
                        }

                        $scope.InitResizableForGang(vessel_id);

                        $("div.gang-child").click(function(e){
                            $("div.gang-child").css("opacity","1");
                            var target = e.target;

                            if(typeof target == 'undefined')
                                return;

                            $(target).css("opacity","0.7");
                            $scope.SelectedGang = target;
                        });
                    }
                },
                stop:function(event,ui){

                    var target = ui.item;
                    if(typeof target != 'undefined')
                    {
                        var destination = ui.item.closest('div.shipping-content');
                        if($(destination).attr("class")!="shipping-content")
                        {
                            $(ui.item).remove();
                        }
                    }
                }
            }).disableSelection();
        }

        $scope.InitResizable = function() {

            var target = $("div.shiping").not(".ui-resizable");
            if(typeof target == "undefined")
                return;

            $.each($(target),function(index,item){

                var vessel_id = $(item).attr("vessel-id");
                var content_id = "vessel-content-" + vessel_id;
                $(item).append('<div class="ui-resizable-handle ui-resizable-n"  id="ngrip"></div>');
                $(item).append('<div class="ui-resizable-handle ui-resizable-s"  id="sgrip"></div>');
                $(item).resizable({
                    containment: "#col2-sub2",
                    minHeight: $scope.time_step,
                    alsoResize: "#"+content_id,
                    autoHide: true,
                    handles: {
                        'n': '#ngrip',
                        's': '#sgrip'
                    },
                    grid: [ 1, $scope.time_step],
                    resize: function( event, ui ) {

                        var target = ui.helper[0];
                        if(typeof target == 'undefined')
                            return;
                        $scope.UpdateLine(target);
                    },
                    stop: function( event, ui ) {

                        var target = ui.helper[0];
                        if(typeof target == 'undefined')
                            return;

                        $scope.UpdateLine(target);
                        $scope.UpdateData(target);

                        var vessel_id = $(target).attr("vessel-id");
                        var height = $(target).height();
                        $("#vessel-content-"+vessel_id+"").css("height",height);
                    }
                }).disableSelection();
            });
        }
        $scope.InitResizableForGang = function (vessel_id){

            var target =$(".gang-child").not(".ui-resizable");
            if (typeof target == 'undefined')
                return;

            $(target).append('<div class="ui-resizable-handle ui-resizable-n"  id="ngrip"></div>');
            $(target).append('<div class="ui-resizable-handle ui-resizable-s"  id="sgrip"></div>');

            $(target).resizable({
                containment: "parent",
                minHeight: 1,
                grid: [ 1, $scope.time_step],
                autoHide: true,
                handles: {
                    'n': '#ngrip',
                    's': '#sgrip'
                },
                resize: function( event, ui ) {

                    var target = ui.helper[0];
                    if(typeof target == 'undefined')
                        return;

                },
                stop:function(event , ui){

                    var target = ui.element;
                    if(typeof target != 'undefined')
                    {
                        $scope.UpdateDateTimeGang(target,$(target).attr("vessel-id"));
                        $scope.UpdateGangRightPositionWhenResizeGang(target);
                    }
                }
            }).disableSelection();
        };

        $scope.DrawGang = function(objGang){

            var strGang = "<div gang-id='"+objGang.id+"' style='background:"+objGang.color+";top:"+objGang.top+"px; left:"+objGang.left+"px;height:"+(objGang.height -3)+"px;position: absolute;' class='gang-vertical'>Gang 1</div>";
            $("#col3-sub2").append(strGang);


            //Update gang position
            var vessel_id = objGang.vessel_id;
            var vessel_items = $("div.shiping");
            if(typeof vessel_items != 'undefined')
            {
                if(vessel_items.length >1){

                    //Sort
                    for(var i=0;i<vessel_items.length-1;i++){
                        for(var j=i;j<vessel_items.length;j++)
                        {
                            if($(vessel_items[i]).position().top > $(vessel_items[j]).position().top)
                            {
                                var temp = vessel_items[i];
                                vessel_items[i] = vessel_items[j];
                                vessel_items[j] = temp;
                            }
                        }
                    }


                    var gang_width =17;
                    var isEqual = false;
                    var left_distant = 0;
                    var total_width =0;

                    for(var i=0;i<vessel_items.length;i++){

                        var number_gang = $(vessel_items[i]).find("div.gang-child").length;
                        var gang_items = $(vessel_items[i]).find("div.gang-child");

                        if(i ==0)
                            total_width = number_gang*gang_width;

                        //Update gang position
                        if(number_gang >0){
                           for(var j=0;j<number_gang;j++){
                                var gang_id =  $(gang_items[j]).attr("id");
                                $("div[gang-id='"+gang_id+"']").css("left", left_distant + j*gang_width + j);
                           }
                        }

                        left_distant = (i+1)*gang_width*number_gang + 10;
                    }
                    total_width = left_distant;
                    $scope.UpdateWidthCol3(total_width);
                    console.log("total width: ",total_width -10);
                }
            }
        };

        $scope.UpdateWidthCol3 = function(total_width){

           if(total_width > 127){
              $("#col3-sub2").css("width",total_width -6);
              $("#col3").css("width",total_width + 95);
              $("#col3-sub1").css("width",total_width + 93);
           }
        }

        $scope.UpdateGangRightPositionByVessel = function (target){
           if(typeof target !='undefined') {
               var gangs = $(target).find("div.gang-child");
               if(typeof gangs != 'undefined' && gangs.length >0) {
                   for(var i=0;i<gangs.length;i++)
                   {
                       var id = $(gangs[i]).attr("id");
                       var offset = $(gangs[i]).offset();
                       var tag_gang_right = $("div[gang-id="+id+"]");
                       $(tag_gang_right).offset({top:offset.top,left:$(tag_gang_right).offset().left});
                   }
               }
           }
        };

        $scope.UpdateGangRightPositionWhenResizeGang = function (target){
            if(typeof target !='undefined'){

                var id= $(target).attr("id");
                var offset = $(target).offset();
                var height = $(target).height();

                var tag_gang_right = $("div[gang-id="+id+"]");
                if(typeof tag_gang_right != 'undefined'){
                    $(tag_gang_right).offset({top:offset.top -1,left:$(tag_gang_right).offset().left});
                    $(tag_gang_right).css("height",height +4);
                }
            }
        };

        $scope.InitMouseEvent = function()
        {
            $("div.gang-child").hover(function() {
                $("div.shiping > div.ui-resizable-handle").hide();

            });

            $("#btn_close_tooltip").click(function(){
                $("#tooltip").css("opacity",0);
                $("#tooltip").css("z-index",0);
            });

            $('html').keyup(function(e){
                if(e.keyCode == 46) {
                    if(typeof $scope.SelectedGang != 'undefined' && $($scope.SelectedGang).attr("id") != '')
                    {
                        $scope.RemoveGang($($scope.SelectedGang).attr("id"),$($scope.SelectedGang).attr("vessel-id"));
                        console.log("data edit: ",$scope.VesselDataEdit);
                        console.log("data save: ",$scope.VesselDataSave());
                    }
                }
            });

            $("#col1").mouseover(function(){
                $scope.SetDisableScroll("#col1",true);
            });
            $("#col1").mouseout(function(){
                $scope.SetDisableScroll("#col1",false);
            });

            $("#col3").mouseover(function(){
                $scope.SetDisableScroll("#col3",true);
            });
            $("#col3").mouseout(function(){
                $scope.SetDisableScroll("#col3",false);
            });

            $("#col2-sub1").mouseover(function(){
                $scope.SetDisableScroll("#col2-sub1",true);
            });
            $("#col2-sub1").mouseout(function(){
                $scope.SetDisableScroll("#col2-sub1",false);
            });

            $("div.shiping").click(function(e){

                $(this).addClass("vessel-selected");
                div_vessel_selected = $(this);

                var target = $(e.target).closest("div.shiping");
                if(typeof target == 'undefined')
                    return;

                //Hide vessel line
                $("div.bridge").hide();
                $("div.vessel-line").hide();

                var vessel_id= $(target).attr("vessel-id");
                $("#stern-ramp-top-"+vessel_id).show();
                $("#side-ramp-top-"+vessel_id).show();
                $("#stern-ramp-line-left-"+vessel_id).show();
                $("#stern-ramp-line-right-"+vessel_id).show();
                $("#side-ramp-line-left-"+vessel_id).show();
                $("#side-ramp-line-right-"+vessel_id).show();
                $("div[id$='bridge-line-"+vessel_id+"']").show();
                $("div[id$='bridge-line-"+vessel_id+"']").show();
                $("div[id$='vessel-line-top-"+vessel_id+"']").show();
                $("div[id$='vessel-line-bottom-"+vessel_id+"']").show();
                $("div[id$='vessel-line-left-"+vessel_id+"']").show();
                $("div[id$='vessel-line-right-"+vessel_id+"']").show();
                $("div[id$='vessel-line-mooring-left-"+vessel_id+"']").show();
                $("div[id$='vessel-line-mooring-right-"+vessel_id+"']").show();
            });

            //Hide all line of vessel
            $("#table-ship").click(function(){
                $("div.shiping").removeClass("vessel-selected");
                div_vessel_selected = null;

                $("div.bridge").hide();
                $("div.vessel-line").hide();
                $("#tooltip").css("opacity",0);
                $("div.vessel-ramp-line").hide();
                $("div.vessel-ramp-top").hide();
            });


            //Init event right tooltip
            // Trigger action when the contexmenu is about to be shown
            $("div.shiping").bind("contextmenu", function (event) {
                // Avoid the real one
                event.preventDefault();

                var target = event.target;
                if(typeof target =='undefined')
                    return;

                var vessel_id = $(target).attr("vessel-id");
                var dataSave = $scope.GetVesselDataEdit();
                if(typeof dataSave != 'undefined' && dataSave.length >0){
                    for(var i=0;i<dataSave.length;i++) {
                        if(dataSave[i].id ==vessel_id) {

                            var content =  "<p>ETA: "+dataSave[i].ETA_date+"</p> \
                                           <p>ETB: "+dataSave[i].ETD_date+"</p>\
                                           <p>ETD: "+dataSave[i].ETD_date+"</p>\
                                           <p>Est. Volume(D/L/R) : 300/500/0</p>";

                            $("#tooltip").find("p").remove();
                            $("#tooltip").append(content);
                        }
                    }
                }

                var top =$("#vessel-"+vessel_id).position().top + $(target).height();
                var left =$("#vessel-"+vessel_id).position().left;
                $("#tooltip").css("opacity",1);
                $("#tooltip").css("z-index",9999);
                $("#tooltip").css("top",top -5);
                $("#tooltip").css("left",left);
            });

            /*col3-sub1*/
            $("div.gang-vertical-box").unbind("mousedown");
            $("div.gang-vertical-box").mousedown(function(){
              $("div#col3-sub1").removeClass("col3-sub1-scroll");
            });

            $("div.gang-vertical-box").mouseup(function(){
                $("div#col3-sub1").addClass("col3-sub1-scroll");
            });
        }

        $scope.RemoveGang = function(id,vessel_id){

            if(id == "" || vessel_id=="")
                return;

            $("div[id$='"+id+"']").remove();
            $("div[gang-id$='"+id+"']").remove();
            var dataSave = $scope.GetVesselDataEdit();
            if(typeof dataSave != "undefined" && dataSave.length >0) {
                for(var i=0;i<dataSave.length;i++){
                    if(dataSave[i].id == vessel_id)
                    {
                        var gangItems = dataSave[i].gang_item;
                        if(typeof gangItems !="undefined" && gangItems.length >0){
                            for(var j=0;j<gangItems.length;j++){
                                if(gangItems[j].id == id){
                                    gangItems.splice(j,1);
                                }
                            }
                        }
                    }
                }
            }
            $scope.GetNumberGang();
        };


        $scope.col1Width = 100;
        $scope.UpdateLine = function(target){

            $timeout(function(){
                var vessel_id = $(target).attr("vessel-id");
                var left1 = $(target).find("div[id$='stern-ramp-"+vessel_id+"']");
                var left2 = $(target).find("div[id$='side-ramp-"+vessel_id+"']");
                var height = $(target).position().top + $(target).height();

                var width1= $("#stern-ramp-"+vessel_id).width();
                var width2= $("#side-ramp-"+vessel_id).width();

                $("#stern-ramp-line-left-"+vessel_id).attr("style","height:"+height+"px;");
                $("#side-ramp-line-left-"+vessel_id).attr("style","height:"+height+"px;");
                $("#bridge-line-"+vessel_id).attr("style","height:"+$(target).position().top+"px;display:block");

                $("#stern-ramp-line-left-"+vessel_id).offset({
                    top:0,
                    left:$(left1).position().left + $(target).position().left + 2
                });
                $("#side-ramp-line-left-"+vessel_id).offset({
                    top:0,
                    left:$(left2).position().left + $(target).position().left + 2
                });

                $("#bridge-line-"+vessel_id).offset({
                    top:0,
                    left:$("#bridge-"+vessel_id).offset().left
                });

                $("#stern-ramp-line-right-"+vessel_id).attr("style","height:"+height+"px;");
                $("#side-ramp-line-right-"+vessel_id).attr("style","height:"+height+"px;");
                $("#stern-ramp-line-right-"+vessel_id).offset({
                    top:0,
                    left:$(left1).position().left + $(target).position().left + width1 + 1
                });
                $("#side-ramp-line-right-"+vessel_id).offset({
                    top:0,
                    left:$(left2).position().left + $(target).position().left + width2 + 1
                });

                //Ramp top
                $("#stern-ramp-top-"+vessel_id).css("left",$(target).position().left + $(left1).position().left +2 - $scope.scrollLeft);
                $("#side-ramp-top-"+vessel_id).css("left",$(target).position().left + $(left2).position().left +2 - $scope.scrollLeft);

                //Line vessel
                $("#vessel-line-top-"+vessel_id).css("top",$(target).position().top - $scope.scrollTop + block2_margin);
                $("#vessel-line-bottom-"+vessel_id).css("top", $(target).position().top + $(target).height() +3 - $scope.scrollTop + block2_margin);

                $("#vessel-line-left-"+vessel_id).css("left",$scope.col1Width + $(target).position().left - $scope.scrollLeft);
                $("#vessel-line-right-"+vessel_id).css("left",$scope.col1Width + $(target).position().left + $(target).width() +3 - $scope.scrollLeft);

                $("#vessel-line-mooring-left-"+vessel_id).css("left",$scope.col1Width + $(target).position().left + $("#vessel-content-"+vessel_id).position().left +2 - $scope.scrollLeft);
                $("#vessel-line-mooring-right-"+vessel_id).css("left",$scope.col1Width + $(target).position().left + $("#vessel-content-"+vessel_id).position().left + $("#vessel-content-"+vessel_id).width() + 5 - $scope.scrollLeft);

                $("#stern-ramp-line-left-"+vessel_id).css("display","block");
                $("#side-ramp-line-left-"+vessel_id).css("display","block");
                $("#stern-ramp-line-right-"+vessel_id).css("display","block");
                $("#side-ramp-line-right-"+vessel_id).css("display","block");

            },50);

        }

        $scope.UpdateData = function (target)
        {
            if(typeof target == 'undefined')
                return false;

            var vessel_id = $(target).attr("vessel-id");
            var top = $(target).position().top -2;
            var bottom = top + $(target).height() + 4;
            var left = $(target).position().left;
            var right = $(target).position().left + $(target).width() +3;
            var ramp_left_width = $(target).find("div.ship-left").width()+2;

            var total_hour_start = top/$scope.time_rate;
            var days_start = Math.floor(total_hour_start/24);
            var hour_start = total_hour_start % 24;
            var start_day = {"days":days_start,"hour":hour_start};

            var total_hour_end = bottom/$scope.time_rate;
            var days_end = Math.floor(total_hour_end/24);
            var hour_end = total_hour_end % 24;
            var end_day = {"days":days_end,"hour":hour_end};

            var start_date =  $scope.GetDateByValue(previousDate,start_day);
            var end_date =  $scope.GetDateByValue(previousDate,end_day);

            var morring_bitt_left = $scope.GetBittByPosition(left);
            var morring_bitt_right = $scope.GetBittByPosition(right);
            if(typeof morring_bitt_left == "undefined" || typeof morring_bitt_right == "undefined")
                return;

            var morring_bit_left_tag = $("#morring-bitt-left-"+vessel_id);
            var morring_bit_right_tag = $("#morring-bitt-right-"+vessel_id);
            if(typeof morring_bit_left_tag == "undefined" || typeof morring_bit_right_tag == "undefined")
                return;

            $(morring_bit_left_tag).attr("bitt_id",morring_bitt_left.id)
            $(morring_bit_right_tag).attr("bitt_id",morring_bitt_right.id);
            $(morring_bit_left_tag).text(morring_bitt_left.name)
            $(morring_bit_right_tag).text(morring_bitt_right.name);

            var berth_bitt_left = $scope.GetBittByPosition(left + ramp_left_width);
            var berth_bitt_right = $scope.GetBittByPosition($(target).position().left + $("#vessel-content-"+vessel_id).width() + 3 + ramp_left_width);

            var head_position =0;
            var direction = $("#vessel-content-"+vessel_id).attr("vessel-dir");
            if(direction == "left-right")
                head_position = $(target).position().left + $("#vessel-content-"+vessel_id).width() + 3 + $("#vessel-"+vessel_id).find("div.ship-left").width() +2;
            else if(direction == "right-left")
                head_position = $(target).position().left + $("#vessel-"+vessel_id).find("div.ship-left").width() +2;

            var berth_dir_cd = $(target).attr("berth-dir-cd");
            var along_side = $(target).attr("along-side");
            var LOA = parseInt($(target).attr("loa"));
            var bridge_to_stern = parseInt($(target).attr("bridge-to-stern"));
            var bridge_position =0;
            //Calculator
            if(berth_dir_cd == $scope.berth_direction[0]) {
                if(along_side == $scope.along_side_type[0]) {
                    bridge_position = head_position - LOA + bridge_to_stern;
                }
                else if(along_side == $scope.along_side_type[1]){
                    bridge_position = head_position + LOA - bridge_to_stern;
                }
            }
            else if(berth_dir_cd == $scope.berth_direction[1]) {
                if(along_side == $scope.along_side_type[0]) {
                    bridge_position = head_position + LOA - bridge_to_stern;
                }
                else if(along_side == $scope.along_side_type[1]){
                    bridge_position = head_position - LOA + bridge_to_stern;
                }
            }

            var bridge_position = $scope.GetBridgeByPosition(bridge_position);
            var  bridge_content_tag = $("#bridge-content"+vessel_id);
            if(typeof bridge_content_tag != 'undefined'){
              $(bridge_content_tag).find("span").text(bridge_position.bridge_content);
            }


            for(var i=0;i<$scope.VesselDataEdit.length;i++)
            {
                if($scope.VesselDataEdit[i].id == vessel_id)
                {
                    $scope.VesselDataEdit[i].head_position = head_position;
                    $scope.VesselDataEdit[i].ETA_date = moment(start_date).format('DD/MM/YYYY HH:SS');
                    $scope.VesselDataEdit[i].ETD_date = moment(end_date).format('DD/MM/YYYY HH:SS');
                    $scope.VesselDataEdit[i].start_time = moment(start_date).format('HH:SS');
                    $scope.VesselDataEdit[i].end_time = moment(end_date).format('HH:SS');
                    $scope.VesselDataEdit[i].morring_bitt_left = morring_bitt_left;
                    $scope.VesselDataEdit[i].morring_bitt_right = morring_bitt_right;
                    $scope.VesselDataEdit[i].berth_bitt_left = berth_bitt_left;
                    $scope.VesselDataEdit[i].berth_bitt_right = berth_bitt_right;
                    $scope.VesselDataEdit[i].vessel_top = top;
                }

                //Update gang datetime
                var gang_items = $scope.VesselDataEdit[i].gang_item;
                if(typeof gang_items != 'undefined' && gang_items.length >0){
                    for(var j=0;j<gang_items.length;j++){

                        var tag_gang = $("div[id$='"+gang_items[j].id+"']");
                        if(typeof tag_gang != 'undefined')
                            $scope.UpdateDateTimeGang(tag_gang,$scope.VesselDataEdit[i].id);

                    }
                }
            }
            $scope.GetNumberGang();
            $scope.CheckValidationVessel();
            //$scope.CheckValidationVesselInBerth();

            console.log("data edit: ",$scope.VesselDataEdit);
            console.log("data save: ",$scope.VesselDataSave());
        }


        $scope.AddGangDataToVessel = function(gang,vessel_id){
            if($scope.VesselDataEdit != null && $scope.VesselDataEdit.length >0) {

                for(var i=0;i<$scope.VesselDataEdit.length;i++)
                {
                    if($scope.VesselDataEdit[i].id == vessel_id)
                    {
                        var gangArr = $scope.VesselDataEdit[i].gang_item;
                        var gang = {
                           "id": $(gang).attr("id"),
                           "name": $(gang).text(),
                           "start_time": $scope.VesselDataEdit[i].start_time,
                           "end_time": $scope.VesselDataEdit[i].end_time,
                           "work_start":$scope.VesselDataEdit[i].ETA_date,
                           "work_end":$scope.VesselDataEdit[i].ETD_date
                        }

                        gangArr.push(gang);
                        $scope.VesselDataEdit[i].gang_item = gangArr;
                    }
                }
            }

            $scope.GetNumberGang();
        }


        $scope.UpdateDateTimeGang = function (gang,vessel_id) {

            var id = $(gang).attr("id");
            var height = $(gang).height() + 4;
            var top = $("#vessel-"+vessel_id).position().top -2 + $(gang).position().top;
            var bottom = top + height;
            var total_hour_start = top/$scope.time_rate;
            var days_start = Math.floor(total_hour_start/24);
            var hour_start = total_hour_start % 24;
            var start_day = {"days":days_start,"hour":hour_start};

            var total_hour_end = bottom/$scope.time_rate;
            var days_end = Math.floor(total_hour_end/24);
            var hour_end = total_hour_end % 24;
            var end_day = {"days":days_end,"hour":hour_end};

            var start_date =  $scope.GetDateByValue(previousDate,start_day);
            var end_date =  $scope.GetDateByValue(previousDate,end_day);

            if($scope.VesselDataEdit != null && $scope.VesselDataEdit.length >0) {

                for (var i = 0; i < $scope.VesselDataEdit.length; i++) {
                    if ($scope.VesselDataEdit[i].id == vessel_id) {
                        var arr = $scope.VesselDataEdit[i].gang_item;
                        if(arr != null && arr.length >0) {
                            for(var j=0;j<arr.length;j++) {
                                if(arr[j].id == id)
                                {
                                    arr[j].start_time = moment(start_date).format("HH:MM");
                                    arr[j].end_time   = moment(end_date).format("HH:MM");
                                    arr[j].work_start = moment(start_date).format("DD/MM/YYYY HH:MM");
                                    arr[j].work_end   = moment(end_date).format("DD/MM/YYYY HH:MM");
                                }
                            }
                        }
                        $scope.VesselDataEdit[i].gang_item = arr;
                    }
                }
            }
            $scope.GetNumberGang();
        }
        $scope.RandomHasCode = function()
        {
            var hasCode = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( var i=0; i < 5; i++ )
                hasCode += possible.charAt(Math.floor(Math.random() * possible.length));
            return hasCode;
        }


        //Update add
        //$scope.VesselDataSave =[]; => $scope.GetVesselDataEdit
        //$scope.GetDataToSave => $scope.VesselDataEdit
        $scope.VesselDataSave = function(){
            var DataToSave = [];
            var dataEdit =  $.extend(true, [], $scope.VesselDataEdit);
            if(dataEdit != null && dataEdit.length >0){
                for(var i=0;i<dataEdit.length;i++) {
                    var obj = dataEdit[i];
                    obj.LOA = Math.round(obj.LOA/$scope.BittRate);
                    obj.head_position = Math.round(obj.head_position/$scope.BittRate);
                    obj.mooring_distant_left = Math.round(obj.mooring_distant_left/$scope.BittRate);
                    obj.mooring_distant_left = Math.round(obj.mooring_distant_left/$scope.BittRate);
                    DataToSave.push(obj);
                }
            }

            return DataToSave;
        }

        $scope.GetVesselDataEdit = function ()
        {
            return $scope.VesselDataEdit;
        }
        $scope.GetNumberGang = function(){

            //Reset data number gang
            for(var n=0;n<$scope.DataNumberGang.length;n++)
            {
                $scope.DataNumberGang[n]["item1"] = 0;
                $scope.DataNumberGang[n]["item2"] = 0;
                $scope.DataNumberGang[n]["item3"] = 0;
                $scope.DataNumberGang[n]["item4"] = 0;
            }

            var dataSave = $scope.GetVesselDataEdit();
            if(typeof dataSave != 'undefined' && dataSave.length >0){
                for(var i=0;i<dataSave.length;i++)
                {
                    var gang_items = dataSave[i].gang_item;
                    if(typeof gang_items != 'undefined' && gang_items.length >0){
                        for(var j=0;j<gang_items.length;j++){

                            var format = "DD/MM/YYYY HH:SS";
                            var work_start = moment(gang_items[j].work_start, format);
                            var work_end = moment(gang_items[j].work_end, format);

                            var format1 = "DD/MM/YYYY";
                            var work_start1 = moment(gang_items[j].work_start, format1);
                            var work_end1 = moment(gang_items[j].work_end, format1);

                            var isSame =  work_end.isSame(work_start, 'days');
                            //get number hour in date:
                            var start_hour = parseInt(work_start.format("HH"));
                            var end_hour = parseInt(work_end.format("HH"));
                            var result = [];
                            if(isSame){ //work_start = work_end
                                result = $scope.ProcessDataTime(work_start,start_hour,end_hour);
                                for(var k=0;k<$scope.DataNumberGang.length;k++) {

                                   var date = $scope.DataNumberGang[k].date;
                                   var isSame_Child =  work_end.isSame(date, 'days');
                                   if(isSame_Child){
                                       for(var l=0;l<result.value.length;l++)
                                       {
                                           $scope.DataNumberGang[k][result.value[l]] +=1;
                                       }
                                   }
                                }
                            }
                            else {  //Work start != work end
                                var number_days =  work_end1.diff(work_start1, 'days');
                                if(number_days ==1) {
                                    var result1 = $scope.ProcessDataTime(work_start,start_hour,23);
                                    var result2 = $scope.ProcessDataTime(work_end,0,end_hour);
                                    result.push(result1);
                                    result.push(result2);

                                    for(var k=0;k<$scope.DataNumberGang.length;k++) {
                                        for(var l=0;l<result.length;l++) {

                                            var date = $scope.DataNumberGang[k].date;
                                            var isSame_Child =  date.isSame(result[l].date, 'days');
                                            if(isSame_Child){
                                                for(var m=0;m<result[l].value.length;m++)
                                                {
                                                    $scope.DataNumberGang[k][result[l].value[m]] +=1;
                                                }
                                            }
                                        }
                                    }
                                }
                                else {

                                    var result1 = $scope.ProcessDataTime(work_start,start_hour,23);
                                    result.push(result1);

                                    for(var i=0;i<number_days-1;i++)
                                    {
                                        var date_temp =  moment(work_start).add("days",i+1);
                                        result.push($scope.ProcessDataTime(date_temp,0,23));
                                    }

                                    var result2 = $scope.ProcessDataTime(work_end,0,end_hour);
                                    result.push(result2);

                                    for(var k=0;k<$scope.DataNumberGang.length;k++) {
                                        for(var l=0;l<result.length;l++) {

                                            var date = $scope.DataNumberGang[k].date;
                                            var isSame_Child =  date.isSame(result[l].date, 'days');
                                            if(isSame_Child){
                                                for(var m=0;m<result[l].value.length;m++)
                                                {
                                                    $scope.DataNumberGang[k][result[l].value[m]] +=1;
                                                }
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            }

            //Update data to show
            $timeout(function(){
                $scope.DataNumberGangForShowData=[];
                $scope.DataMaxNumberGang = [];

                var temp =[];
                var temp1 =[];
                for(var i=0;i<$scope.DataNumberGang.length;i++)  {
                    var arrTemp = [];
                    var item1 = $scope.DataNumberGang[i]["item1"] ==0?"": $scope.DataNumberGang[i]["item1"];
                    var item2 = $scope.DataNumberGang[i]["item2"] ==0?"": $scope.DataNumberGang[i]["item2"];
                    var item3 = $scope.DataNumberGang[i]["item3"] ==0?"": $scope.DataNumberGang[i]["item3"];
                    var item4 = $scope.DataNumberGang[i]["item4"] ==0?"": $scope.DataNumberGang[i]["item4"];
                    temp.push( {"date":$scope.DataNumberGang[i]["date"],"value":[item1,item2,item3,item4]});
                    arrTemp.push(item1);arrTemp.push(item2);arrTemp.push(item3);arrTemp.push(item4);
                    var maxValue = Math.max.apply(Math, arrTemp);
                    temp1.push({"date":$scope.DataNumberGang[i]["date"],"value":maxValue==0?"":maxValue});
                }
                $scope.DataNumberGangForShowData = temp;
                $scope.DataMaxNumberGang = temp1;

            },100);
        }

        $scope.ProcessDataTime = function (date,st,ed)
        {
            var arr = [];
            arr[0] = Array('item1',0,5);
            arr[1] = Array('item2',6,11);
            arr[2] = Array('item3',12,17);
            arr[3] = Array('item4',18,99999);

            var arrResult =[];
            for(var i=0; i<4; i++){
                if(( arr[i][1] <= st  &&  st <=  arr[i][2]) || ( arr[i][1] <= ed  &&  ed <=  arr[i][2]) || (  st <= arr[i][1]   &&   arr[i][1] <= ed) || (  st <= arr[i][2]   &&   arr[i][2] <= ed)){
                    arrResult.push(arr[i][0]);
                }
            }
            return {"date":date,"value":arrResult};
        }

        $scope.UpdateDate = function(date,key)
        {
            if($scope.DataNumberGang != null && $scope.DataNumberGang.length >0){
                for(var i=0;i<$scope.DataNumberGang.length;i++)
                {
                    var d = $scope.DataNumberGang[i].date;
                    var eta_number_days =  d.diff(date, 'days');
                    if(eta_number_days ==0){
                            $scope.DataNumberGang[i][key] = $scope.DataNumberGang[i][key] +1;
                    }
                }
            }
        }

        $scope.InitMoveMouse = function (){

            var div = $('#content'), wrapHeight = div.height(), listHeight = div.find('col2').outerHeight();

            div.on('mousemove',
                function(e){
                    var cPointY = e.pageY,
                        cST = div.scrollTop();
                    if (cPointY >= (wrapHeight/2)) {
                        div.scrollTop(cST + 10);
                    }
                    else {
                        div.scrollTop(cST - 10);
                    }
                });
        }

        //Main
        var strFromDate = "03/25/2015";
        var format = "MM/DD/YYYY";
        var fromDate = moment(strFromDate,format);
        var previousDate =  moment(fromDate).add("days",-14);
        $scope.timeData = [];
        $scope.BerthData = [
            {"id":1,"idx":0,"name":"B01","start_postion":0,"end_position":300,"from_bitt":1,"to_bitt":15,"group":"AA","length":300,"depth":17},
            {"id":2,"idx":1,"name":"B02","start_postion":300,"end_position":600,"from_bitt":16,"to_bitt":30,"group":"AA","length":300,"depth":17},
            {"id":3,"idx":2,"name":"B03","start_postion":600,"end_position":900,"from_bitt":31,"to_bitt":45,"group":"BB","length":300,"depth":17},
            {"id":4,"idx":3,"name":"B04","start_postion":900,"end_position":1200,"from_bitt":46,"to_bitt":60,"group":"BB","length":300,"depth":17}
        ];

        $scope.BittData = [
            {
                "id_berth": 1,
                "berth_name": "B01",
                "data":[
                    {"id":1,"idx":0,"name":"01","start_position":0,"end_position":20},
                    {"id":2,"idx":1,"name":"02","start_position":20.1,"end_position":40},
                    {"id":3,"idx":2,"name":"03","start_position":40.1,"end_position":60},
                    {"id":4,"idx":3,"name":"04","start_position":60.1,"end_position":80},
                    {"id":5,"idx":4,"name":"05","start_position":80.1,"end_position":100},
                    {"id":6,"idx":5,"name":"06","start_position":100.1,"end_position":120},
                    {"id":7,"idx":6,"name":"07","start_position":120.1,"end_position":140},
                    {"id":8,"idx":7,"name":"08","start_position":140.1,"end_position":160},
                    {"id":9,"idx":8,"name":"09","start_position":160.1,"end_position":180},
                    {"id":10,"idx":9,"name":"10","start_position":180.1,"end_position":200},
                    {"id":11,"idx":10,"name":"11","start_position":200.1,"end_position":220},
                    {"id":12,"idx":11,"name":"12","start_position":220.1,"end_position":240},
                    {"id":13,"idx":12,"name":"13","start_position":240.1,"end_position":260},
                    {"id":14,"idx":13,"name":"14","start_position":260.1,"end_position":280},
                    {"id":15,"idx":14,"name":"15","start_position":280.1,"end_position":300}
                ]
            },
            {
                "id_berth": 2,
                "berth_name": "B02",
                "data":[
                    {"id":16,"idx":15,"name":"16","start_position":300.1,"end_position":320},
                    {"id":17,"idx":16,"name":"17","start_position":320.1,"end_position":340},
                    {"id":18,"idx":17,"name":"18","start_position":340.1,"end_position":360},
                    {"id":19,"idx":18,"name":"19","start_position":360.1,"end_position":380},
                    {"id":20,"idx":19,"name":"20","start_position":380.1,"end_position":400},
                    {"id":21,"idx":20,"name":"21","start_position":400.1,"end_position":420},
                    {"id":22,"idx":21,"name":"22","start_position":420.1,"end_position":440},
                    {"id":23,"idx":22,"name":"23","start_position":440.1,"end_position":460},
                    {"id":24,"idx":23,"name":"24","start_position":460.1,"end_position":480},
                    {"id":25,"idx":24,"name":"25","start_position":480.1,"end_position":500},
                    {"id":26,"idx":25,"name":"26","start_position":500.1,"end_position":520},
                    {"id":27,"idx":26,"name":"27","start_position":520.1,"end_position":540},
                    {"id":28,"idx":27,"name":"28","start_position":540.1,"end_position":560},
                    {"id":29,"idx":28,"name":"29","start_position":560.1,"end_position":580},
                    {"id":30,"idx":29,"name":"30","start_position":580.1,"end_position":600}
                ]
            },
            {
                "id_berth": 3,
                "berth_name": "B03",
                "data":[
                    {"id":31,"idx":30,"name":"31","start_position":600.1,"end_position":620},
                    {"id":32,"idx":31,"name":"32","start_position":620.1,"end_position":640},
                    {"id":33,"idx":32,"name":"33","start_position":640.1,"end_position":660},
                    {"id":34,"idx":33,"name":"34","start_position":660.1,"end_position":680},
                    {"id":35,"idx":34,"name":"35","start_position":680.1,"end_position":700},
                    {"id":36,"idx":35,"name":"36","start_position":700.1,"end_position":720},
                    {"id":37,"idx":36,"name":"37","start_position":720.1,"end_position":740},
                    {"id":38,"idx":37,"name":"38","start_position":740.1,"end_position":760},
                    {"id":39,"idx":38,"name":"39","start_position":760.1,"end_position":780},
                    {"id":40,"idx":39,"name":"40","start_position":780.1,"end_position":800},
                    {"id":41,"idx":40,"name":"41","start_position":800.1,"end_position":820},
                    {"id":42,"idx":41,"name":"42","start_position":820.1,"end_position":840},
                    {"id":43,"idx":42,"name":"43","start_position":840.1,"end_position":860},
                    {"id":44,"idx":43,"name":"44","start_position":860.1,"end_position":880},
                    {"id":45,"idx":44,"name":"45","start_position":880.1,"end_position":900}
                ]
            },
            {
                "id_berth": 4,
                "berth_name": "B04",
                "data":[
                    {"id":31,"idx":30,"name":"46","start_position":900.1,"end_position":920},
                    {"id":32,"idx":31,"name":"47","start_position":920.1,"end_position":940},
                    {"id":33,"idx":32,"name":"48","start_position":940.1,"end_position":960},
                    {"id":34,"idx":33,"name":"49","start_position":960.1,"end_position":980},
                    {"id":35,"idx":34,"name":"50","start_position":980.1,"end_position":1000},
                    {"id":36,"idx":35,"name":"51","start_position":1000.1,"end_position":1020},
                    {"id":37,"idx":36,"name":"52","start_position":1020.1,"end_position":1040},
                    {"id":38,"idx":37,"name":"53","start_position":1040.1,"end_position":1060},
                    {"id":39,"idx":38,"name":"54","start_position":1060.1,"end_position":1080},
                    {"id":40,"idx":39,"name":"55","start_position":1080.1,"end_position":1100},
                    {"id":41,"idx":40,"name":"56","start_position":1100.1,"end_position":1120},
                    {"id":42,"idx":41,"name":"57","start_position":1120.1,"end_position":1140},
                    {"id":43,"idx":42,"name":"58","start_position":1140.1,"end_position":1160},
                    {"id":44,"idx":43,"name":"59","start_position":1160.1,"end_position":1180},
                    {"id":45,"idx":44,"name":"60","start_position":1180.1,"end_position":1200}
                ]
            }
        ] ;

        $scope.VesselData = [
           {   "id":1,"berth_id":1,"code":"HJNY","name":"Hanijin Newyork","LOA":200,"LBP":200,"bridge_to_stern":100,
                "vessel_color":"rgb(32, 227, 84)","calling_status_color":"red","calling_type_color":"blue","service_lane_color":"black","along_side":"0123S","along_side_name":"S","head_position":300,
                "berth_dir_cd":"0042LR","status":"P","eta_date":"12/03/2015 0:00","etd_date":"12/03/2015 15:00",
                stern_ramp:{ramp_width:20,ramp_start_position:10,ramp_degree:120,ramp_occupied_distance:20},
                side_ramp:{ramp_width:20,ramp_start_position:40,ramp_degree:120,ramp_occupied_distance:20}
            },
            {"id":2,"berth_id":2,"code":"NYK","name":"Hanijin SaiGon","LOA":200,"LBP":200,"bridge_to_stern":100,
                "vessel_color":"rgb(189,64,189)","calling_status_color":"red","calling_type_color":"blue","service_lane_color":"black","along_side":"0123P","along_side_name":"P","head_position":620,
                "berth_dir_cd":"0042LR","status":"P","eta_date":"14/03/2015 10:00","etd_date":"14/03/2015 21:00",
                stern_ramp:{ramp_width:20,ramp_start_position:10,ramp_degree:130,ramp_occupied_distance:20},
                side_ramp:{ramp_width:20,ramp_start_position:40,ramp_degree:130, ramp_occupied_distance:20}
            }
        ];

       $scope.BerthGroupData = [];
       $scope.GroupByBerth = function(){
           $timeout(function(){

               var items_temp = [];
               var items = $("#berth-group").find("div");
               if(items.length >0){
                   for(var i=0;i<items.length;i++){
                       var obj = {"group":$(items[i]).text(),"width":$(items[i]).width(),isCheck:false};
                       items_temp.push(obj);
                   }
               }

               var width =0;
               if(items_temp.length == 1){
                   width = items_temp[0].width;
                   var obj = {"group":items_temp[0].group,"from_idx":0,"to_idx":0,"width":width};
                   $scope.BerthGroupData.push(obj);
               }
               else {
                   for(var i=0;i<items_temp.length-1;i++) {
                      if(items_temp[i].isCheck == false){

                          $(items[i]).attr("group-name",items_temp[i].group);
                          width = items_temp[i].width
                          items_temp[i].isCheck = true;
                          var berthObj = {"group":items_temp[i].group,"from_idx":i,"to_idx":i,"width":width};
                          $scope.BerthGroupData.push(berthObj);

                          for(var j=i+1;j<items_temp.length;j++) {
                              if(items_temp[i].group == items_temp[j].group) {

                                  width += items_temp[j].width;
                                  var idx = 0;
                                  var found = $.map($scope.BerthGroupData, function(val, index ) {
                                      idx = index;
                                      return val.group == items_temp[j].group ? val : null;
                                  });
                                  if(found != null) {
                                      $scope.BerthGroupData[idx].width = width
                                      $scope.BerthGroupData[idx].to_idx = j;
                                  }

                                  $(items[i]).css("width",width + 1);
                                  $(items[i]).css("background","#B9B9B9");
                                  $(items[j]).remove();
                                  items_temp[j].isCheck = true;
                              }
                              else
                              {
                                  if(j == items_temp.length -1)
                                  {
                                      var berthObj = {"group":items_temp[j].group,"from_idx":j,"to_idx":j,"width":items_temp[j].width +1};
                                      $scope.BerthGroupData.push(berthObj);
                                  }
                                  else
                                    break;
                              }
                          }
                      }
                   }
               }
           },50);
       }


        $scope.isAssignBitt = false;
        $scope.CheckValidationVesselInBerth = function() {

            $timeout(function () {
                var content = "";
                var isError = false;
                var dataSave = $scope.GetVesselDataEdit();

                if (typeof dataSave == 'undefined' || dataSave.length == 0)
                    return;

                for (var i = 0; i < dataSave.length; i++) {

                    var vessel_tag = $("#vessel-"+dataSave[i].id);
                    if(vessel_tag != 'undefined'){

                        var left_position = 0;
                        var right_position = 0;
                        if($(vessel_tag).attr("vessel-dir") == "left-right"){
                            left_position = dataSave[i].head_position - parseInt($(vessel_tag).attr("loa"));
                            right_position = dataSave[i].head_position;
                        }
                        else {
                            left_position = dataSave[i].head_position;
                            right_position = dataSave[i].head_position + parseInt($(vessel_tag).attr("loa"));
                        }

                        var berth_left = $scope.GetBerthGroupByPosition(left_position);
                        var berth_right = $scope.GetBerthGroupByPosition(right_position);

                        if (berth_left != berth_right) {
                            isError = true;
                            content += dataSave[i].vessel_code + ", ";
                        }
                    }
                }

                if (isError) {
                    $scope.OpenMessageBox("<p>Vessel Position is not valid.</p>"+ "<p>Check Berth Group.</p>" + "<p style='margin-top: 5px;'>" + content.substr(0, content.length - 2) + "</p>");
                    $scope.isAssignBitt = false;
                }
                else
                    $scope.isAssignBitt = true;
            }, 100);
        }

        $scope.GetBerthGroupByPosition =function(position){
            var items = $("#berth-group").find("div");
            if(typeof items == 'undefined' || items.length ==0)
                return null;

            for(var i=0;i<items.length;i++)
            {
                var left = $(items[i]).position().left;
                var right= $(items[i]).position().left + $(items[i]).width() + 1;

                if((left ==0 ? position >= left: position > left) && position <= right){
                    return $(items[i]).attr("group-name");
                }
            }
        }


        $scope.CheckValidationVessel = function(){

            var isValid = false;
            var dataSave = $scope.GetVesselDataEdit();
            if(typeof dataSave == 'undefined')
                return;

            var content ="Vessel invalid: ";
             for(var i=0;i<dataSave.length -1;i++) {
                for(var j=i+1;j<dataSave.length;j++){

                    var headPostion1 = dataSave[i].head_position;
                    var LOA1 = dataSave[i].LOA;
                    var vessel_top1 = dataSave[i].vessel_top;
                    var height1 = dataSave[i].vessel_height;
                    var vessel_dir1 = dataSave[i].vessel_dir;
                    var stern1 =0;
                    if(vessel_dir1 == "left-right")
                    {
                        stern1 = headPostion1 - LOA1;
                    }
                    else
                    {
                        stern1 = headPostion1 + LOA1;
                        var temp = headPostion1;
                        headPostion1 = stern1;
                        stern1 = temp;
                    }

                    var stern2=0;
                    var headPostion2 = dataSave[j].head_position;
                    var LOA2 = dataSave[j].LOA;
                    var vessel_top2 = dataSave[j].vessel_top;
                    var height2 = dataSave[j].vessel_height;
                    var vessel_dir2 = dataSave[j].vessel_dir;
                    if(vessel_dir2 == "left-right")
                    {
                        stern2 = headPostion2 - LOA2;
                    }
                    else
                    {
                        stern2 = headPostion2 + LOA2
                        var temp = headPostion2;
                        headPostion2 = stern2;
                        stern2 = temp;
                    }

                    /*var rec1 = {x:stern1 - dataSave[i].mooring_distant_left,y:vessel_top1,height:height1,width:LOA1};
                    var rec2 = {x:stern2 - dataSave[i].mooring_distant_left,y:vessel_top2,height:height2,width:LOA2};*/

                     var rec1 = {
                         left:{morring:stern1 - dataSave[i].mooring_distant_left,vessel:stern1},
                         right:{morring:headPostion1 + dataSave[i].mooring_distant_left, vessel:headPostion1},
                         top:{vessel: vessel_top1},
                         bottom:{vessel: vessel_top1 + height1}
                     };
                    var rec2 = {
                        left:{morring: stern2 - dataSave[i].mooring_distant_left ,vessel: stern2},
                        right:{morring:headPostion2 + dataSave[i].mooring_distant_left, vessel:headPostion2},
                        top:{vessel: vessel_top2},
                        bottom:{vessel: vessel_top2 + height2}
                    };

                    if($scope.CheckRetangles(rec1,rec2,dataSave[i].mooring_distant_left))
                    {
                        isValid = true;
                        content += dataSave[j].vessel_code +", ";
                    }
                }
             }

            if(isValid == true) {
                $scope.OpenMessageBox("<p>The bitt of vessel berthing position can't be used for another vessel.</p>" + "<p style='color: red;'>"+content.substr(0,content.length -2)+"</p>");
            }
        }

        $scope.CheckRetangles = function(a,b, morring_bit_distant) {

            //Check a in b
            //a primary
            var isError = false;
            var isVerticalError = false;
            if(b.top.vessel >= a.top.vessel && b.top.vessel <= a.bottom.vessel)
                isVerticalError = true;
            if(b.bottom.vessel >= a.top.vessel && b.bottom.vessel <= a.bottom.vessel)
                isVerticalError = true;

            if(isVerticalError == true){

                if( b.left.morring >= a.left.vessel && b.left.morring <= a.right.vessel)
                    isError = true;
                if( b.left.vessel >= a.left.vessel && b.left.vessel <= a.right.vessel)
                    isError = true;

                if(b.right.morring >= a.left.vessel && b.right.morring <= a.right.vessel)
                    isError = true;
                if(b.right.vessel >= a.left.vessel && b.right.vessel <= a.right.vessel)
                    isError = true;

            }


            return isError;
        }

        $scope.InitMessageBox = function(){
            // if user clicked on button, the overlay layer or the dialogbox, close the dialog
            $('a.btn-ok, #dialog-overlay, #dialog-box').click(function () {
                $('#dialog-overlay, #dialog-box').hide();
                return false;
            });

            // if user resize the window, call the same function again
            // to make sure the overlay fills the screen and dialogbox aligned to center
            $(window).resize(function () {

                //only do it if the dialog box is not hidden
                if (!$('#dialog-box').is(':hidden')) $scope.OpenMessageBox();
            });
        }
        //Popup dialog
        $scope.OpenMessageBox = function(message) {

            var maskHeight = $(document).height();
            var maskWidth = $(window).width();
            var dialogTop =  (maskHeight/3) - ($('#dialog-box').height());
            var dialogLeft = (maskWidth/2) - ($('#dialog-box').width()/2);

            $('#dialog-overlay').css({height:maskHeight, width:maskWidth}).show();
            $('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();
            $('#dialog-message').html(message);
        }

        $scope.EditMooringDistance = function(){

        }

        $scope.lastOffset = 0;
        $scope.lastLeftOffset = 0;
        $scope.scrollTop = 0;
        $scope.scrollLeft = 0;
        $scope.InitScroll = function(){

            $("#div_scroll").on('scroll', function (e)
            {
                var left = $(this).scrollLeft();
                $scope.scrollLeft = left;

                clearTimeout( $.data( this, "scrollCheck" ) );
                $.data( this, "scrollCheck", setTimeout(function() {

                    var leftOffset = left - $scope.lastLeftOffset;
                    var leftItems =  $("#vessel-line-content div.line-vertical");
                    if(typeof leftItems != 'undefined' && leftItems.length >0) {
                        for (var i = 0; i < leftItems.length; i++) {
                            var left_item = parseInt($(leftItems[i]).css("left").replace("px",""));
                            $(leftItems[i]).css("left", left_item - leftOffset);
                        }
                    }
                    $scope.lastLeftOffset = left;

                }, 100));
                $('#col2-sub1').scrollLeft($(this).scrollLeft());
                $('#col2').scrollLeft($(this).scrollLeft());
            });

            $('#col2').on('scroll', function (e)
            {
                var top = $(this).scrollTop();
                $scope.scrollTop = top;

                var left = $(this).scrollLeft();
                $scope.scrollLeft = left;

                clearTimeout( $.data( this, "scrollCheck" ) );
                $.data( this, "scrollCheck", setTimeout(function() {

                    var offset = top - $scope.lastOffset;
                    var items = $("#vessel-line-content div.line-horizontal");
                    if(typeof items != 'undefined' && items.length >0) {
                        for (var i = 0; i < items.length; i++) {
                            var item_top = parseInt($(items[i]).css("top").replace("px",""));
                            $(items[i]).css("top", item_top - offset);
                        }
                    }
                    $scope.lastOffset = top;
                }, 100));

                var height = $("#col1-sub2").css("height").replace("px","");
                $("#col3-sub2").css("height",parseInt(height) -2);

                $('#col3').scrollTop(top);
                $('#col1').scrollTop(top);
            });
        }


        $scope.VesselDisplay = function (isShowGang, isShowBridge, isShowRamp, isShowGrid){

            if(isShowGang){
                $("div.vessel-gang").show();
            }
            else{
                $("div.vessel-gang").hide();
            }

            if(isShowBridge){
                $("div.vessel-bridge").show();
            }
            else{
                $("div.vessel-bridge").hide();
            }

            if(isShowRamp){
                $("div.vessel-ramp").show();
            }
            else{
                $("div.vessel-ramp").hide();
            }

            if(isShowGrid){
                $("div.guide-line").show();
            }
            else{
                $("div.guide-line").hide();
            }
        }

        $scope.DrawColor = function(status){
            var items = $("div.shiping");
            if(typeof items != 'undefined' && items.length >0){
                for(var i=0;i<items.length;i++){
                    var color = $(items[i]).attr(status);
                    $(items[i]).find("div.shipping-content").css("background",color);
                }
            }
        }

        $scope.berth_direction = ["0042LR","0042RL"];
        $scope.along_side_type = ["0123S","0123P"];
        $scope.mooring_distant_left = 20;
        $scope.mooring_distant_right = 20;

        $scope.InitTableTime(strFromDate,format,14);
        $scope.InitBerth($scope.BerthData,$scope.BittData);
        $scope.InitMap($scope.timeData);
        $scope.InitVessel(previousDate,$scope.VesselData,$scope.mooring_distant_left,$scope.mooring_distant_right);
        $scope.InitMouseEvent();
        $scope.GroupByBerth();
        $scope.InitMessageBox();
        $scope.InitScroll();

        $timeout(function(){
            $scope.VesselDisplay(true,true,true,false);
        },50);

        $scope.SetDisableScroll = function(tag, isDisable){
            if(isDisable){
                $(tag).css("overflow","hidden");
            }
            else {
                $(tag).css("overflow","auto");
            }
        }


        var div_vessel_selected;
        $scope.MoveStep = 10;
        var ccc = 0;
        $scope.InitArrowKeys = function (){
            $(document).keydown(function(e) {
                var map = $('#vessel-content');
                if(typeof div_vessel_selected == 'undefined' || typeof map == 'undefined')
                    return;
                var vessel_status = $(div_vessel_selected).attr("vessel-status");
                if(vessel_status != "P")
                    return;
                console.log("count: ",ccc);ccc++;
                var key = e.which;
                switch(event.which) {
                    case 37: //Left
                        var parent_left = $(map).offset().left;
                        var child_left = $(div_vessel_selected).offset().left;
                        if(child_left - $scope.MoveStep >= parent_left){
                            div_vessel_selected.animate(
                                {
                                    left: '-='+$scope.MoveStep
                                }, 0, null);
                        }
                        e.preventDefault();
                        break;

                    case 38: //Top
                        var parent_top = $(map).offset().top;
                        var child_top = $(div_vessel_selected).offset().top;
                        if(child_top - $scope.MoveStep >= parent_top){
                            div_vessel_selected.animate(
                                {
                                    top: '-='+$scope.MoveStep
                                }, 0,null);
                        }
                        e.preventDefault();
                        break;

                    case 39: //Right
                        var parent_right =  $(map).width() + $(map).offset().left;
                        var child_right = $(div_vessel_selected).offset().left + $(div_vessel_selected).width();
                        if(parent_right >= child_right + $scope.MoveStep){
                            div_vessel_selected.animate(
                                {
                                    left: '+='+$scope.MoveStep
                                }, 0,null);
                        }
                        e.preventDefault();
                        break;

                    case 40:
                        var parent_bottom = $(map).offset().top + $(map).height();
                        var child_bottom = $(div_vessel_selected).offset().top + $(div_vessel_selected).height();
                        if(child_bottom + $scope.MoveStep <= parent_bottom){
                            div_vessel_selected.animate(
                                {
                                    top: '+='+$scope.MoveStep
                                }, 0,null);
                        }
                        e.preventDefault();
                        break;
                }


                $timeout(function(){
                    $scope.UpdateLine(div_vessel_selected);
                    $scope.UpdateData(div_vessel_selected);
                    $scope.UpdateGangRightPositionByVessel(div_vessel_selected);
                },200);


            });
        }

        $scope.InitArrowKeys();
    });