
const geotiffLayer = new ol.layer.Image();
var map = "";

function map_Default_Set(set_Lon , set_Lat) {
    map = new ol.Map({
        target: 'map',
        layers: [
            layers['vworld'] = new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            geotiffLayer
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([set_Lon, set_Lat]),
            zoom: 7
        })
    });
}

function map_Popup_Set(set_Lon , set_Lat , jsonarr) {
    var popup = new ol.Overlay({
        element: document.getElementById('popup')
    });

    var locaarr = [];
    for (var i = 0; i < jsonarr.length; i++) {
        locaarr.push([jsonarr[i].Lon, jsonarr[i].Lat, jsonarr[i].Velocity]);
    }
    var sourceFeatures = new ol.source.Vector(),
        layerFeatures = new ol.layer.Vector({ source: sourceFeatures });

    for (var i = 0; i < locaarr.length; i++) {
        var style1 = [
            new ol.style.Style({
                image: new ol.style.Icon(({
                    scale: 2,
                    rotateWithView: false,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    opacity: 0,
                    src: '../../img/common/marker1.png'
                })),
                text: new ol.style.Text({
                    scale: 0,
                    fill: new ol.style.Fill({
                        color: '#000000'
                    }),
                    offsetX: 0,
                    offsetY: -32,
                }),
                zIndex: 5
            }),
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: 'rgba( 248, 105, 109 ,1.0)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,1)'
                    })
                })
            })
        ];
        console.log(locaarr[i][0] +"-"+locaarr[i][1]);
        var feature = new ol.Feature({
            type: 'click',
            desc: jsonarr[i],
            geometry: new ol.geom.Point(ol.proj.transform([locaarr[i][0], locaarr[i][1]], 'EPSG:4326', 'EPSG:3857'))
        });
        feature.setStyle(style1);

        sourceFeatures.addFeature(feature);
    }

    map = new ol.Map({
        target: 'map',
        layers: [
            layers['vworld'] = new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            geotiffLayer,layerFeatures
        ],
        overlays: [popup],
        view: new ol.View({
            center: ol.proj.fromLonLat([set_Lon, set_Lat]),
            zoom: 10
        })
    });

    map.on('singleclick', function (evt) {
        var f = map.forEachFeatureAtPixel(evt.pixel, function (ft, layer) {
            return ft;
        });
        if (evt.dragging) {
            return;
        }
        var feature = map.forEachFeatureAtPixel(map.getEventPixel(evt.originalEvent), function (feature) {
            return feature;
        });
        if (feature && f && f.get('type') == 'click') {
            var geometry = f.getGeometry();
            var coord = geometry.getCoordinates();
            $("#popup").empty(); 
            var popuphtml = '<img src="../../img/img_server/chasu/Forecasted_water_level/'+f.get('desc').KONAME.replace("_","")+'/'+forecast+'.png" style="width:500px; height:360px;" alt="">';
            $("#popup").append(popuphtml);
            $("#popup").show();
            popup.setPosition([coord[0], coord[1]]);
        } else {
            $("#popup").hide();
        }
    });
}

function map_Chart_Overlay_Set(set_Lon , set_Lat , jsonarr) {
    var locaarr = [];
    var label_arr = new Array();
    var data_arr = new Array();
    var data_index = 0;

    var pnt = new ol.geom.Point(ol.proj.transform([set_Lon, set_Lat],
        'EPSG:4326', 'EPSG:3857'));
    var korea = pnt.getCoordinates();

    var myView = new ol.View({
        center: korea,
        zoom: 12
    }); //뷰 객체를 전역변수로 뺀다.

    var projection = ol.proj.get('EPSG:4326');

    // The tile size supported by the ArcGIS tile service.
    var tileSize = 512;

    var urlTemplate = 'https://server.arcgisonline.com/arcgis/rest/services/' +
        'ESRI_Imagery_World_2D/MapServer/tile/{z}/{y}/{x}';
    
    var map1 = new ol.Map({
        target: 'map1', 	//산샤댐 위성지도
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    projection: projection,
                    tileSize: tileSize,
                    maxZoom: 13,
                    tileUrlFunction: function (tileCoord) {
                        return urlTemplate.replace('{z}', (tileCoord[0] - 1).toString())
                            .replace('{x}', (tileCoord[1]).toString())
                            .replace('{y}', (tileCoord[2]).toString());
                    },
                    wrapX: true
                })
            })
        ],
        view: new ol.View({
            center: korea,
            zoom: 12
        })
    });
    
    /*
    // 아래버전은 vworld 버전 -> 문제점은 확대할수록 해상도가 급격히 깨짐(대한민국 제외)
    // 처음 맵 로드시 확대 줌이 높거나 줌단계가 낮아지면 지도 표출이 안됨
    var map1 = new ol.Map({
        target: 'map1', 	//산샤댐 위성지도
        layers: [
            new ol.layer.Tile({
                title: 'VWorld Gray Map',
                visible: true,
                type: 'base',
                source: new ol.source.XYZ({
                    url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201612/{z}/{x}/{y}.jpeg'
                })
            })
        ],
        view: new ol.View({
            center: korea,
            zoom: 12
        })
    });
    */

    var popup = new ol.Overlay({
        element: document.getElementById('popup')
    });

    var parsing = areaJsonData();  //읽어온 데이터 파싱

    var areare = areaCodeData();
    locaarr = [];
    for (var i = 0; i < parsing.length; i++) {
        locaarr.push([parsing[i].values_.Lon, parsing[i].values_.Lat, parsing[i].values_.Velocity]);
    }
    var sourceFeatures = new ol.source.Vector(),
        layerFeatures = new ol.layer.Vector({ source: sourceFeatures });

    for (var i = 0; i < locaarr.length; i++) {

        var indcolor = "";
        var rcolor = "";
        if (Number(locaarr[i][2]) > 3) {
            indcolor = 'rgba( 248, 105, 109 ,1.0)';
            rcolor = 'marker1';
        } else if (Number(locaarr[i][2]) > 2) {
            indcolor = 'rgba( 251, 189, 140 ,1.0)';
            rcolor = 'marker2';
        } else if (Number(locaarr[i][2]) > 1.5) {
            indcolor = 'rgba( 249, 229, 116 ,1.0)';
            rcolor = 'marker3';
        } else if (Number(locaarr[i][2]) > 1) {
            indcolor = 'rgba( 223, 223, 125 ,1.0)';
            rcolor = 'marker4';
        } else {
            indcolor = 'rgba( 88, 185, 116 ,1.0)';
            rcolor = 'marker5';
        }
        var style1 = [
            new ol.style.Style({
                image: new ol.style.Icon(({
                    scale: 0.9,
                    rotateWithView: false,
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    opacity: 0,
                    src: '../../img/common/' + rcolor + '.png'
                })),
                text: new ol.style.Text({
                    text: '' + i + '',
                    scale: 0,
                    fill: new ol.style.Fill({
                        color: '#000000'
                    }),
                    offsetX: 0,
                    offsetY: -32,
                }),
                zIndex: 5
            }),
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: indcolor
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,1)'
                    })
                })
            })
        ];
        var feature = new ol.Feature({
            type: 'click',
            desc: areare[i],
            geometry: new ol.geom.Point(ol.proj.transform([locaarr[i][0], locaarr[i][1]], 'EPSG:4326', 'EPSG:3857'))
        });
        feature.setStyle(style1);

        sourceFeatures.addFeature(feature);
    }

    map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            layerFeatures
        ],
        overlays: [popup],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: ({
                collapsible: false
            })
        }),
        view: myView
    });

    var c1, c2, z1, z2;
    map1.on('moveend', function (e) {
        c1 = map1.getView().getCenter();
        z1 = map1.getView().getZoom();
        map.getView().setCenter(c1);
        map.getView().setZoom(z1+2);
        //map2.zoomTo(z1);
        e.preventDefault();
    });
    map.on('moveend', function (e) {
        c2 = map.getView().getCenter();
        z2 = map.getView().getZoom();
        map1.getView().setCenter(c2);
        map1.getView().setZoom(z2-2);
        //map1.zoomTo(z2);
    });

    map.on('singleclick', function (evt) {
        label_arr = new Array();
        data_arr = new Array();
        data_index = 0;
        var f = map.forEachFeatureAtPixel(evt.pixel, function (ft, layer) {
            return ft;
        });
        if (evt.dragging) {
            return;
        }
        var feature = map.forEachFeatureAtPixel(map.getEventPixel(evt.originalEvent), function (feature) {
            return feature;
        });

        if (feature && f && f.get('type') == 'click') {
            var geometry = f.getGeometry();
            var coord = geometry.getCoordinates();
            data_arr.push(new Array(coord));
            var pop_count = 0;
            var cord_count = 0;
            
            for (var i = 0; i < data_index; i++) {
                if (data_arr[i][0][0] == coord[0] && data_arr[i][0][1] == coord[1]) {
                    cord_count++;
                    pop_count++;
                }
            }
            if (pop_count == 1) {
                data_arr.pop();
            }
            pop_count = 0;
            if (cord_count < 1) {
                data_arr[data_index].push(f.getStyle()[1].image_.fill_.color_);
                data_arr[data_index].push(f.getStyle()[0].text_.text_);
                for (var key in f.get('desc')) {
                    if (key.substring(0, 1) == "D") {
                        label_arr.push(key.substring(2));
                        data_arr[data_index].push(f.get('desc')[key]);
                        cord_count = 0;
                    }
                }
                data_index++;
            }
            $("#popup").empty();
            $("#popup").append("<canvas id='line-chart"+f.getStyle()[0].text_.text_+"'></canvas>");
            popup.setPosition([coord[0], coord[1]]);
            $('.chart_reset').show();
            $("#popup").show();
            if (cord_count < 1) {
                create_linechart(f.getStyle()[0].text_.text_, label_arr, data_arr);
            }
        } else {
            $("#popup").hide();
        }
    });
}


if(map != ""){
    var currZoom = map.getView().getZoom();
    map.on('moveend', function (e) {
        var newZoom = map.getView().getZoom();
        if (currZoom != newZoom) {
            console.log('zoom end, new zoom: ' + newZoom);
            currZoom = newZoom;
        }
    });
}


var layers = {};
layers['satellite'] = new ol.layer.Tile({
    title: 'VWorld Gray Map',
    visible: true,
    type: 'base',
    source: new ol.source.XYZ({
        url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201612/{z}/{x}/{y}.jpeg'
    })
});


function baseChange(data) {
    if (data == "satellite") {
        $("#base-layer").text("위성");
        $("#base-layer").attr("onclick", "baseChange('vworld')");

    } else {
        $("#base-layer").text("지도");
        $("#base-layer").attr("onclick", "baseChange('satellite')");
    }

    var layer = layers[data];
    if (layer) {
        layer.setOpacity(1);
        updateRenderEdgesOnLayer(layer);
        map.getLayers().setAt(0, layer);
    }
}

var updateRenderEdgesOnLayer = function (layer) {
    if (layer instanceof ol.layer.Tile) {
        var source = layer.getSource();
    }
};


function onGeotiffLoaded(data) {
    const tiff = GeoTIFF.parse(data);
    const image = tiff.getImage();
    const rawBox = image.getBoundingBox();
    console.log(rawBox);
    //for some reason, geotiff.js calculates BBOX assuming that origin is the lower-left corner
    //but at least for gdal_translate-generated raster, it's the upper-left one, so the BBOX has to be adjusted
    const box = [rawBox[0], rawBox[1] - (rawBox[3] - rawBox[1]), rawBox[2], rawBox[1]];
    const bands = image.readRasters(); //DEMs are single-band rasters, so band 0 can be hardcoded here
    let the_canvas = document.createElement('canvas'); //create an offscreen canvas for rendering
    //calculate the minimal and maximal pixel value of a raster
    //@FIXME: Math.min.apply doesn't work with arrays of that size - causes RangeError
    //@FIXME hardcode min/max for now
    var minValue = 0; // domain default값은 minValue=0, maxValue=1 인데 그렇게 설정하면 제대로 표출되지 않아 지금처럼 수정함 -> 전우현 연구원님께서 확인 중에 계심
    var maxValue = 0.5;
    var myMin = 0; //for 8bit dataset
    var myMax = 0;
    for(var i=0; i<bands[0].length; i++){
        if(myMax < bands[0][i]){
            myMax = bands[0][i];
        }
        /* if(myMin > bands[0][i]){
        myMin = bands[0][i];
        }*/
    }
    
    minValue = myMin;
    maxValue = myMax;
    let colorScale = 'greys';
    if (bands.length == 3) { //흑백 tif파일은 bands.length == 1, RGB tif파일은 bands.length == 3(R,G,B)
        colorScale = 'earth';
    }
    const plot = new plotty.plot({
        canvas: the_canvas,
        data: bands[0], width: image.getWidth(), height: image.getHeight(),
        domain: [minValue, maxValue], clampLow: true, clampHigh: true, colorScale: colorScale
    });
    plot.render();
    const imgSource = new ol.source.ImageStatic({
        url: the_canvas.toDataURL("image/png"),
        imageExtent: box,
        projection: 'EPSG:3857' //to enable on-the-fly raster reprojection
    })
    geotiffLayer.setSource(imgSource);
};

var directory_Tiff = {
    "sub31" : {
        "LULC" : "envi/000_LULC/LULC_2019_30_epsg3857",
        "S1GRD" : "envi/001_S1GRD/S1B_IW_GRDH_1SDV_20180120T213156_20180120T213222_009260_0109A6_2806_NR_Cal_Deb_ML_Spk_SRGR_TC",
        "S1APV" : "envi/002_S1APV/result/z_s_A_01_TC1_epsg3857"
    },
    "sub1" : {
        "05" : "chasu/Forecasted_flood_maps/EMS_lt05_FldMap/",
        "10" : "chasu/Forecasted_flood_maps/EMS_lt10_FldMap/",
        "15" : "chasu/Forecasted_flood_maps/EMS_lt15_FldMap/"
    },
    "sub24" : {
        "sentinel-1_preprocessed" : "esu/001_Sentinel_1_Preprocessed/",
        "TU_Wien" : "esu/002_TU_Wien/",
        "Regression" : "esu/003_Regression/",
        "ANN" : "esu/004_ANN/",
        "SWDI" : "esu/005_SWDI/"
    }
};

function tiffLoad(page_Type , data_Type , file_Type , search_Data) {
    var area = data_Type;

    var areaDirectory = directory_Tiff[page_Type][area];
    if(page_Type == "sub24") {
        file_Type += search_Data+"_epsg3857"
    } else if(page_Type == "sub1") {
        file_Type = search_Data.substring(0,6) + file_Type;
    }
    var fileName = '/img/img_server/' + areaDirectory + file_Type + '.tif';
    console.log("--->"+fileName);
    fetch(fileName).then(
        function (response) {
            if(response.status != 200){
                alert("자료가 없습니다");
            }
            return response.arrayBuffer();
        }
    ).then(onGeotiffLoaded).catch(function (error) {
        console.log("자료가 없습니다"+error);
    });
}


function areaJsonData() {
    var areajsondata = "";
    $.ajax({
        url: '../../data/case2.json',
        type: 'get',
        async: false,
        contentType: 'text',
        success: function (data) {
            var format = new ol.format.GeoJSON({   //포멧할 GeoJSON 객체 생성
                featureProjection: 'EPSG:3857'
            });
            areajsondata = format.readFeatures(data);
        }
    });
    return areajsondata;
}

function areaCodeData() {
    var areadata = [];
    $.ajax({
        url: '../../data/case1.json',
        type: 'get',
        async: false,
        contentType: 'text',
        success: function (data) {
            var format = new ol.format.GeoJSON({   //포멧할 GeoJSON 객체 생성
                featureProjection: 'EPSG:3857'
            });
            var parsing = format.readFeatures(data);  //읽어온 데이터 파싱
            let vectorSource = new ol.source.Vector({  //벡터의 구조를 파싱한 데이터로 넣기
                features: parsing
            });
            let vectorLayer = new ol.layer.Vector({ source: vectorSource });
            for (var i = 0; i < parsing.length; i++) {
                areadata.push(parsing[i].values_);
            }
        }
    });
    return areadata;
}

function create_linechart(chart_Id,label_arr, data_arr) {
    var new_data = new Array();
    for (var j = 3; j < data_arr[0].length; j++) {
        new_data.push(data_arr[0][j]);
    }
    var lichart = new Chart(document.getElementById("line-chart"+chart_Id+""), {
        type: 'line',
        data: {
            labels: label_arr,
            datasets: [
                {
                    data: new_data,
                    label: data_arr[0][2],
                    borderColor: data_arr[0][1],
                    fill: false
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: '시계열 범위 그래프',
            },
            legend: {
                position: 'right'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        max: 25,
                        min: -25
                    }
                }]
            }
        }
    });
    for (var i = 1; i < data_arr.length; i++) {
        new_data = new Array();
        for (var j = 3; j < data_arr[i].length; j++) {
            new_data.push(data_arr[i][j]);
        }
        lichart.data.datasets.push({
            data: new_data,
            label: data_arr[i][2],
            borderColor: data_arr[i][1],
            fill: false
        });
        lichart.update();
    }
}



$('#openModalBtn').on('click', function () {
    $('#modalBox').modal('show');
});
$('#closeModalBtn').on('click', function () {
    $('#modalBox').modal('hide');
});

$('#item> label').on('click', function () {
    $('#dropdown1').text($(this).text());
});

$('#DataSelect> label').on('click', function () {
    $('#dropdown1').text($(this).text());
});

$('#AlgorithmSelect> label').on('click', function () {
    $('#dropdown2').text($(this).text());
});