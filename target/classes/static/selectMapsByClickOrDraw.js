

var map;
var layers = new ol.layer.Tile({
    title : 'VWorld Gray Map',
    visible : true,
    type : 'base',
        
	//source : new ol.source.OSM(),
    source : new ol.source.XYZ({
    url:'http://xdworld.vworld.kr:8080/2d/Base/201802/{z}/{x}/{y}.png'
    })
});

var view = new ol.View({
	projection : 'EPSG:3857',
    //EPSG:900913
	center : ol.proj.fromLonLat([127.0000, 35.7000]),
	zoom:9,
});

//전라북도 구역추가
var pointsLayer = new ol.layer.Vector({
	title: 'all sigungu',
	source : new ol.source.Vector({
		url : './data/ALL_SIGUNGU.json',
		format : new ol.format.GeoJSON()
	})
});

//지도를 canvas로 그려라
function init(){
	map = new ol.Map({
		target : 'polygonmap',
        //canvas로 랜더링할거야
		renderer : 'canvas',
		view : view
	});
	map.addLayer(layers);
	map.addLayer(pointsLayer);
}

init();

//선택가능한 구역 시작
var select = new ol.interaction.Select();
map.addInteraction(select);
var selectedFeatures = select.getFeatures();


//그려라
var sketch;

var drawingSource = new ol.source.Vector({
	useSpatialIndex : false
});
var drawingLayer = new ol.layer.Vector({
	source: drawingSource
});
map.addLayer(drawingLayer);



layers['vworld'] = new ol.layer.Tile({
    title: 'VWorld Gray Map',
    visible: true,
    type: 'base',
    source : new ol.source.XYZ({
        url : 'http://xdworld.vworld.kr:8080/2d/Base/201612/{z}/{x}/{y}.png'
    })
});
//그리고, 클릭이벤트시 타 지역 클릭불가
var draw;
var modify;
var listener;


//ctrl과 여러지역 선택해서 지역그림그리기가능
draw = new ol.interaction.Draw({
	source : drawingSource,
	type : 'Polygon',
    //이게 그릴 수 있는 
	condition : ol.events.condition.platformModifierKeyOnly
});
map.addInteraction(draw);


draw.on('drawstart',function(event){
	drawingSource.clear();
    //타지역 선택시 지금 지역 해체
	select.setActive(false);
	
	sketch = event.feature;
	
	listener = sketch.getGeometry().on('change',function(event){
		selectedFeatures.clear();
		var polygon = event.target;
		var features = pointsLayer.getSource().getFeatures();
		

		for (var i = 0 ; i < features.length; i++){
			if(polygon.intersectsExtent(features[i].getGeometry().getExtent())){
				selectedFeatures.push(features[i]);
			}
		}
	});
},this);



draw.on('drawend', function(event) {
	sketch = null;
	delaySelectActivate();
	selectedFeatures.clear();

	var polygon = event.feature.getGeometry();
	var features = pointsLayer.getSource().getFeatures();

	for (var i = 0 ; i < features.length; i++){
		if(polygon.intersectsExtent(features[i].getGeometry().getExtent())){
			selectedFeatures.push(features[i]);
		}
	}
	
	
});


var modify = new ol.interaction.Modify({
	features: drawingSource.getFeaturesCollection()
});
map.addInteraction(modify);


modify.on('modifystart',function(event){
	sketch = event.features;
	select.setActive(false);
	listener = event.features.getArray()[0].getGeometry().on('change',function(event){
		selectedFeatures.clear();
		var polygon = event.target;
		var features = pointsLayer.getSource().getFeatures();

		for (var i = 0 ; i < features.length; i++){
			if(polygon.intersectsExtent(features[i].getGeometry().getExtent())){
				selectedFeatures.push(features[i]);
			}
		}
	});
},this);

modify.on('modifyend',function(event){
	sketch = null;
	delaySelectActivate();
	selectedFeatures.clear();
	var polygon = event.features.getArray()[0].getGeometry();
	var features = pointsLayer.getSource().getFeatures();

	for (var i = 0 ; i < features.length; i++){
		if(polygon.intersectsExtent(features[i].getGeometry().getExtent())){
			selectedFeatures.push(features[i]);
		}
	}

},this);

  // 각 행정구역 마우스 오버시 하이라이팅
        var selectPointerMove = new ol.interaction.Select({
            condition: ol.events.condition.pointerMove,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 4
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,000,0.6)'
                })
			
            })
        });
        // interaction 추가
        map.addInteraction(selectPointerMove);
/*딜레이 걸기
function delaySelectActivate(){
	setTimeout(function(){
		select.setActive(true)
	},1);
}*/

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

