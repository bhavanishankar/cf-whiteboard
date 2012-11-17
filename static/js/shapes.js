/**
 * Shapes.js
 * About this : Defines all the shapes and its default values.
 *
 */

var shapes = {
		rectangle: {
			toolAction: function(args) {
				var rect = new fabric.Rect({
				  top: args.top,
				  left: args.left,
				  width: args.width,
				  height: args.height,
				  fill: args.fillColor
				});
			rect.name = "rectangle";	
			rect.uid = args.uid;
			app.canvas.add(rect);		
			},
		
			defaultValues:{
				top: 200,
				left: 500,
				width: 150,
				height: 50,
				fillColor: '#ccc'
			},
			
			modifyAction: function (args) {
				var obj = util.getObjectById(args.uid, app.canvas);
				var recvdObj = args.object;
				shapes.updateProperties(obj, recvdObj);
			}			
		},
		
		circle: {
			toolAction: function(args) {
				var circle = new fabric.Circle({
					radius: args.radius,
					left: args.left,
					top: args.top,
					fill: args.fillColor,
					stroke: args.strokeColor
				});
				circle.name = "circle";	
				circle.uid = args.uid;
				app.canvas.add(circle);
			},
			defaultValues:{
				radius: 50,
				top: 100,
				left: 100,
				width: 150,
				height: 50,
				fillColor: '#ccc',
				storkeColor: '#f00'
			},
			modifyAction: function (args) {
				var obj = util.getObjectById(args.uid, app.canvas);
				var recvdObj = args.object;
				shapes.updateProperties(obj, recvdObj);
				obj.radius = recvdObj.width/2;
			}				
		},
		
		triangle: {
			toolAction: function(args) {
				var triangle = new fabric.Triangle({
				width: args.width,
				height: args.height,
				left: args.left,
				top: args.top,
				fill: args.fillColor,
				stroke: args.strokeColor
			});
			triangle.name = "triangle";
			triangle.uid = args.uid;
		   app.canvas.add(triangle);
			},
			defaultValues:{
				top: 100,
				left: 200,
				width: 150,
				height: 50,
				fillColor: '#cccccc',
				storkeColor: '#000'
			},
			modifyAction: function (args) {
				var obj = util.getObjectById(args.uid, app.canvas);
				var recvdObj = args.object;
				shapes.updateProperties(obj, recvdObj);					
			}	
		},
		line: {
			toolAction: function(args) {
				var _line = new fabric.Line([0, 0, 300, 0],{
				fill: args.fillColor,
				stroke: args.strokeColor,
				strokeWidth: args.strokeWidth,
				scaleY: 1,
				top:args.top,
				left:args.left
			});
			_line.name = "line";
			_line.uid = args.uid;
		   app.canvas.add(_line);
			},
			defaultValues:{
				top: 200,
				left: 200,
				width: 300,
				height: 50,
				fillColor: '#cccccc',
				storkeColor: '#f00',
				strokeWidth: 3
			},
			modifyAction: function (args) {
				var obj = util.getObjectById(args.uid, app.canvas);
				var recvdObj = args.object;
				shapes.updateProperties(obj, recvdObj);					
			}
		},
	
		arc: {
			toolAction: function(args) {
				var _arc = new fabric.Path('M 0 100 a 100 100 0 1 1 200 0' ,
				{ stroke: args.storkeColor, 
				strokeWidth: 5, 
				fill: "none", 
				width: args.width, 
				height: args.height,
				top:args.top,
				left: args.left 
				});
				_arc.name = "arc";
				_arc.uid = args.uid;
				app.canvas.add(_arc); 
			},
			defaultValues:{
				width: 200,
				height: 100,
				storkeColor: '#cccccc',
				strokeWidth: 5,
				top: 100,
				left: 150
			},
			modifyAction: function (args) {
				var obj = util.getObjectById(args.uid, app.canvas);
				var recvdObj = args.object;
				shapes.updateProperties(obj, recvdObj);					
			}	
			
		},
		
		arrow: {
			toolAction: function(args) {
				var _arrow = new fabric.Path('M 0 10 L 50 10 L 50 0 L 70 20 L 50 40 L 50 30 L 0 30 z',
				{
					left: args.left, 
					top: args.top, 
					fill:'#ccc', 
					stroke: '#ccc',
					storkeWidth: args.strokeWidth 
				});
				_arrow.name = "arrow";
				_arrow.uid = args.uid;
				_arrow.set({top:args.top, left:args.left});
				app.canvas.add(_arrow); 
			},
			defaultValues:{
				storkeColor: '#cccccc',
				strokeWidth: 3,
				top: 100,
				left: 150
			},
			modifyAction: function (args) {
				var obj = util.getObjectById(args.uid, app.canvas);
				var recvdObj = args.object;
				shapes.updateProperties(obj, recvdObj);					
			}
		},
		
		arrow_bidir: {
			toolAction: function(args) {
				var _arrow = new fabric.Path('M 0 20 L 10 0 L 10 10 L 30 10 L 30 0 L 40 20 L 30 40 L 30 30 L 10 30 L 10 40 z',
				{
					left: args.left, 
					top: args.top, 
					fill:'#ccc', 
					stroke: '#ccc',
					storkeWidth: args.strokeWidth 
				});
				_arrow.name = "arrow_bidir";
				_arrow.uid = args.uid;
				_arrow.set({top:args.top, left:args.left});
				app.canvas.add(_arrow); 
				app.canvas.renderAll();
			},
			defaultValues:{
				storkeColor: '#cccccc',
				strokeWidth: 3,
				top: 100,
				left: 150
			},
			modifyAction: function (args) {
				var obj = util.getObjectById(args.uid, app.canvas);
				var recvdObj = args.object;
				shapes.updateProperties(obj, recvdObj);					
			}
		},
		updateProperties: function (obj, recvdObj) {
			obj.left = recvdObj.left;
			obj.top = recvdObj.top;
			obj.scaleX = recvdObj.scaleX;
			obj.scaleY = recvdObj.scaleY;
			obj.width = recvdObj.width;
			obj.height = recvdObj.height;
			obj.setAngle(recvdObj.angle);
			if (recvdObj.fill) {
				obj.set("fill", recvdObj.fill);
			}
			if (recvdObj.stroke) {
				obj.set("stroke", recvdObj.stroke);
			}
			if (obj.text) {
				obj.text = recvdObj.text;
			}
			if(recvdObj.path) {
				obj.path = recvdObj.path;
			}
	
			if(obj.name === 'line') {
				obj.scaleY = 1;
			}
		}	
	
}

